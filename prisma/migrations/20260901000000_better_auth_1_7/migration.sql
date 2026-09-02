-- Better Auth 1.7 upgrade: account identity strategy ("provider-id")
-- and rate limit storage schema changes.

-- AlterTable: add nullable issuer column first
ALTER TABLE "accounts" ADD COLUMN "issuer" TEXT;

-- Backfill: only email/password ("credential") accounts exist in this app
UPDATE "accounts" SET "issuer" = 'local:' || "providerId" WHERE "issuer" IS NULL;

-- Make issuer required and enforce the new compound identity
ALTER TABLE "accounts" ALTER COLUMN "issuer" SET NOT NULL;
CREATE UNIQUE INDEX "accounts_issuer_accountId_uidx" ON "accounts"("issuer", "accountId");

-- AlterTable: rateLimits columns are now required with a unique key
DELETE FROM "rateLimits" WHERE "key" IS NULL;
UPDATE "rateLimits" SET "count" = 0 WHERE "count" IS NULL;
UPDATE "rateLimits" SET "lastRequest" = 0 WHERE "lastRequest" IS NULL;
DELETE FROM "rateLimits" a USING "rateLimits" b
  WHERE a."key" = b."key" AND a."id" > b."id";
ALTER TABLE "rateLimits" ALTER COLUMN "key" SET NOT NULL;
ALTER TABLE "rateLimits" ALTER COLUMN "count" SET NOT NULL;
ALTER TABLE "rateLimits" ALTER COLUMN "lastRequest" SET NOT NULL;
CREATE UNIQUE INDEX "rateLimits_key_key" ON "rateLimits"("key");
