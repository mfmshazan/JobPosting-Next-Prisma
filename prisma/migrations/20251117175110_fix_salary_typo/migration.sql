/*
  Warnings:

  - You are about to drop the column `salry` on the `Job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "salry",
ADD COLUMN     "salary" TEXT;
