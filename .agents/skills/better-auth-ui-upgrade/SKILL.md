---
name: better-auth-ui-upgrade
description: >-
  Procedure to upgrade `@better-auth-ui/core` and `@better-auth-ui/react` in
  this repo and regenerate the auth components that the shadcn CLI copies into
  `src/components/auth` and `src/lib/auth`. Use whenever the task is to bump
  better-auth-ui ("actualizar better-auth-ui", "subir mejor-auth-ui", "upgrade
  @better-auth-ui") or to regenerate those components from the Better Auth UI
  registry (`shadcn add @better-auth-ui/...`). Also covers why the components
  live in the repo instead of `node_modules`, why `shadcn` is run with `pnpm dlx`,
  and how the 24 h `minimumReleaseAge` policy interacts with new releases.
metadata:
  library: "@better-auth-ui/react"
  library_version: "1.7.19"
  registry_style: "base-lyra"
---

# Upgrading `@better-auth-ui`

Bumping the two npm packages is only half of it: the auth UI is **not** in
`node_modules`, the shadcn CLI copies it into `src/components/auth` and
`src/lib/auth`. So the upgrade is bump the versions, then re-run `shadcn add`
and review what it overwrote.

> Repo state when this was written: `@better-auth-ui/core` and
> `@better-auth-ui/react` at `^1.7.19`. Previous upgrades: `280481b`
> (1.6.x → 1.7.15) and `608cdfd` ("update auth", → 1.7.19).

## How it works

- `components.json` registers `@better-auth-ui` →
  `https://better-auth-ui.com/r/{style}/{name}.json`, resolved with the repo's
  style `base-lyra`. The URL is version-less, so it always serves the latest
  registry: bumping the packages alone does not update the copied files.
- `shadcn add --overwrite` **replaces files without asking**.
- `shadcn` is not a dependency of this repo; run it with `pnpm dlx`.
- The packages use plain semver ranges in `package.json` (`"^1.7.19"`), not a
  `catalog:` entry. Both must move to the same version.
- Registry metadata is authoritative. Read it instead of guessing:
  `curl -s https://better-auth-ui.com/r/base-lyra/<item>.json`.

## Before you start

1. Clean tree with the current state committed. One commit per step.
2. Record the reference commit (`git log --oneline -1`); you will diff against it.
3. Record the baseline: `pnpm typecheck`, `pnpm lint`, `pnpm format:check`,
   `pnpm test`.

## Steps

### 1. Bump the versions

In `package.json`, both packages to the same version:

```jsonc
"@better-auth-ui/core": "^X.Y.Z",
"@better-auth-ui/react": "^X.Y.Z",
```

```bash
pnpm update @better-auth-ui/core@X.Y.Z @better-auth-ui/react@X.Y.Z
```

`pnpm-workspace.yaml` sets `minimumReleaseAge: 1440` (24 h), so a release
published within the last day is refused unless listed in
`minimumReleaseAgeExclude`. That list currently carries
`"@better-auth-ui/core@1.7.19"` and `"@better-auth-ui/react@1.7.19"`: if the new
version is less than 24 h old, replace those lines with it; otherwise delete
them.

Commit: `chore(deps): subir @better-auth-ui a X.Y.Z`.

### 2. Regenerate the components from the registry

```bash
pnpm dlx shadcn@latest add \
  @better-auth-ui/auth @better-auth-ui/settings \
  @better-auth-ui/passkey @better-auth-ui/user-button \
  --overwrite --yes
```

Those four are the items this repo uses; do not add `admin`, `organization`,
`two-factor`, `username`, `multi-session` or `one-tap` blindly.

The command also rewrites the plain shadcn items the components depend on
(`button`, `field`, `input`, `alert`, …), i.e. `src/components/ui/*`. Those are
registry-owned and prettier-ignored; review them but do not reformat them.

Review `git diff package.json`: the CLI may try to add dependencies the repo
already has (`class-variance-authority`, `bowser`, `date-fns`, `lucide-react`,
`@tanstack/react-form`, `@tanstack/react-query`, `sonner`). Newer versions of
`@better-auth-ui/react` also **import `cn` at runtime** and declare it as a
non-optional peer — check with
`grep -rl 'from "cn"' node_modules/@better-auth-ui/react/dist`, and if it shows
up, `pnpm add cn@^0.4.0`.

### 3. Rewrite the `cn` import

The registry writes `import { cn } from "cn"`; this repo imports it from
`@/lib/utils`:

```bash
grep -rl 'from "cn"' src/components/auth src/lib/auth \
  | xargs -r sed -i 's|from "cn"|from "@/lib/utils"|'
```

### 4. Format and lint

This repo has no Biome and no codemods. The registry output needs Prettier:

```bash
pnpm exec prettier --write src/components/auth src/lib/auth
pnpm lint
```

### 5. Review the overwrite

```bash
git diff <ref> -- src/components/auth src/lib/auth src/components/ui
```

Nothing app-specific lives inside the copied files, so the diff should be
registry output plus Prettier's reflow — `prettier-plugin-tailwindcss` reorders
class names, that is expected. App glue (`src/components/providers.tsx`,
`src/lib/auth/localization.ts`, `src/lib/auth-client.ts`, `src/lib/auth.ts`,
`src/components/ui/**`, `src/pages/auth/**`) is in separate files and is not
touched by `shadcn add`; check it still compiles.

Do not commit the overwrite without reading the whole diff.

### 6. Commit the overwrite on its own

Separate from the version bump and from any glue you had to adjust. To stage
specific hunks, generate a patch and apply it to the index with
`git apply --cached`.

### 7. Verify

```bash
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
DATABASE_URL_UNPOOLED=dummy pnpm build
```

Then test by hand in `pnpm dev`: email + password sign-in/sign-up, GitHub,
Turnstile captcha, passkey, one-tap, and account settings (email, avatar,
password, sessions, linked accounts).

## Common errors

| Symptom | Cause / fix |
| --- | --- |
| `Cannot find module 'cn'` | The new version imports `cn` at runtime: `pnpm add cn@^0.4.0`. |
| `Property 'X' does not exist on type 'AuthLocalization'` | A new localization key; add it in `src/lib/auth/localization.ts`, or the packages and the registry are on different versions. |
| `Type '{ render: ... }' is not assignable to ...Input...` | A `src/components/ui/*` file was overwritten with a non-base-ui version. Restore it from the `base-lyra` registry. |
| Package bump refused | `minimumReleaseAge` (24 h): add the version to `minimumReleaseAgeExclude`. |
| `import { cn } from "cn"` restored after regenerating | Step 3 was skipped. |
