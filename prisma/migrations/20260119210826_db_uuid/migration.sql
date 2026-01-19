-- AlterTable
ALTER TABLE "Experience" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "Messages" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "Skills" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
