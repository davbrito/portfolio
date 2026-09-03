# Prisma 7 → 8 migration

Status: **Phases 1-4 done. Phase 5 blocked** on better-auth's Prisma 8 support ([prisma/better-auth#11077](https://github.com/better-auth/better-auth/issues/11077), open, unaddressed as of 2026-09-03). The app now runs both Prisma clients side by side, permanently until that lands.

## What's on which client

| Client                           | Package                          | Config                                        | Used by                                                                                                                |
| -------------------------------- | -------------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `db` (Prisma 7)                  | `@prisma/prisma7`                | `prisma7.config.ts`, `prisma/schema.prisma`   | `src/lib/auth.ts` only (better-auth's `prismaAdapter`)                                                                 |
| `db8` (Prisma 8 / "Prisma Next") | `prisma`, `@prisma/orm-postgres` | `prisma.config.ts`, `prisma8/contract.prisma` | Everything else: `src/data/portfolio.ts`, `src/actions/contact.ts`, `src/service/profile.ts`, `src/actions/profile.ts` |

Both connect to the same Neon database (`DATABASE_URL`). There is no data split — it's the same tables, read/written through two different client libraries depending on the code path.

## What was done

- **Phase 1** — Renamed the `prisma` package to `@prisma/prisma7`, `prisma.config.ts` to `prisma7.config.ts`. No behavior change.
- **Phase 2** — Installed `prisma`/`@prisma/orm-postgres` (v8) alongside. Inferred the v8 contract (`prisma8/contract.prisma`) from the live DB via `contract infer`, then hand-corrected it: added `@@map(...)` for `Profile`/`Experience`/`Messages`/`Proyects`/`Skills` (their table names are exact-case PascalCase in Postgres, unmapped in the v7 schema too — infer's default lowercasing was wrong), added `@default(uuid(7))` back to the four UUID id columns (v7 generated those client-side, so `contract infer` — which only reads the DB, not Prisma-level defaults — didn't see them), and declared `Experience.highlights`/`Proyects.tags` as nullable arrays (`String[]?`) to match what's actually in the DB — **by explicit decision, not a DB migration**: those columns really are nullable and the app doesn't need a `NOT NULL` guarantee there.
- **Phase 3** — Migrated every non-auth route to `db8`, one at a time, each verified against the real DB before moving on:
  - `src/data/portfolio.ts` (landing page data)
  - `src/actions/contact.ts` (contact form + admin messages CRUD)
  - `src/service/profile.ts` / `src/actions/profile.ts` (admin profile editor, YAML export)
- **Phase 4** — Wrote the baseline migration (`migrations/app/20260903T0300_baseline`, `null → ff7145e9...`) via the **offline** `migration plan` path and set the `db` ref to that hash. `migrate:deploy` now runs `prisma db migrate` (v8) instead of `prisma7 migrate deploy`.

## Pending / deferred

- **better-auth stays on Prisma 7 indefinitely.** `src/lib/auth.ts` and `src/lib/db.ts` are untouched and will stay that way until better-auth ships v8 support. No action needed until then — just don't remove `@prisma/prisma7` / `prisma7.config.ts` / `prisma/schema.prisma` / `prisma/generated/`.
- **`_prisma_migrations` table** (Prisma 7's migration ledger) is still in the database, deliberately excluded from the v8 contract. It's inert from Prisma 8's point of view and still required by `prisma7 migrate deploy` for the auth tables. Per Prisma's own guide, it's safe to drop once better-auth (and its schema) fully move to v8 — not before.
- **`orm-postgres@8.0.0-rc.8` typing gap**: `.include()` on `db8.orm.public.<Model>` produces an unresolved row type (fields decay to `unknown`/`any`) on this rc. Where we kept `.include()` for the single-round-trip win (`findProfile`, `getPortfolioData`), the result is cast against hand-written row types in `src/lib/db8-rows.ts`. Where we didn't, we used separate flat queries instead (`src/actions/contact.ts`). No existing Prisma issue matches this exactly (closest: [#30104](https://github.com/prisma/orm/issues/30104), [#30166](https://github.com/prisma/orm/issues/30166)) — worth re-checking against a newer `orm-postgres` release before removing the casts.
- **Still on release candidates.** `prisma@8.0.0-rc.12` and `@prisma/orm-postgres@8.0.0-rc.8` (the latest `orm-postgres` has published) — not GA. Revisit pinned versions when 8.0.0 ships stable.

## Production DB — what actually needs to happen

Everything above (`contract infer`, `db sign`, `migration plan`, `db verify`) was run against the **development** database only. Production is a separate database and has no marker yet — **`db8` will throw `Database error while reading contract marker` on its first query in prod until this is done.**

**One-time, before this branch first deploys:**

1. Make sure prod's schema is fully caught up with Prisma 7 migrations (`prisma7 migrate deploy` against prod, same as always, if there's anything pending).
2. Check prod's schema doesn't differ from what the v8 contract expects: `pnpm prisma db verify --db "$PROD_DATABASE_URL"`. If this reports drift, it needs to be resolved (most likely the same `@@map`/nullability/`@default(uuid(7))` corrections already made in `prisma8/contract.prisma` — see _What was done_ above — will already cover it, since prod should have the same schema as dev; but verify, don't assume).
3. If clean, sign prod's marker: `pnpm prisma db sign --db "$PROD_DATABASE_URL"`. This only writes a marker row — no schema change.
4. Then deploy.

This is a one-time step for the first deploy of this migration. No `CREATE`/`ALTER`/`DROP` runs against prod as part of it — steps 2-3 are read-only plus a single marker-row write. Once signed, ordinary deploys don't need to repeat this.

Going forward, deploy pipeline changes:

- `pnpm run migrate:deploy` (used by `.github/workflows/migrate.yml`, manually triggered) now runs `prisma db migrate` instead of `prisma7 migrate deploy`. The next real schema change to any v8-owned table goes through `prisma migration plan --name <slug>` (commit the generated `migrations/app/<dir>/`) then that workflow.
- Auth-table schema changes (if better-auth ever needs one before Phase 5) still need `prisma7 migrate deploy` run by hand — there's no CI step for it since none has been needed.
