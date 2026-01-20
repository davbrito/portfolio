-- DropForeignKey
ALTER TABLE "Experience" DROP CONSTRAINT "Experience_userId_fkey";

-- DropForeignKey
ALTER TABLE "Proyects" DROP CONSTRAINT "Proyects_userId_fkey";

-- DropForeignKey
ALTER TABLE "Skills" DROP CONSTRAINT "Skills_userId_fkey";

-- AlterTable: rename columns (preserves data)
ALTER TABLE "Experience" RENAME COLUMN "userId" TO "profileId";

-- AlterTable: rename columns (preserves data)
ALTER TABLE "Proyects" RENAME COLUMN "userId" TO "profileId";

-- AlterTable: rename columns (preserves data)
ALTER TABLE "Skills" RENAME COLUMN "userId" TO "profileId";

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skills" ADD CONSTRAINT "Skills_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proyects" ADD CONSTRAINT "Proyects_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
