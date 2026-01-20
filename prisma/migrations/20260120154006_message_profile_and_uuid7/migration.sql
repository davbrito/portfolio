/*
  Warnings:

  - Added the required column `profileId` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Experience" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Messages" ADD COLUMN     "profileId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Proyects" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Skills" ALTER COLUMN "id" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
