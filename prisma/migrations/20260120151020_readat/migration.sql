/*
  Warnings:

  - The `read` column on the `Messages` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "read",
ADD COLUMN     "read" TIMESTAMP(3);
