/*
  Warnings:

  - Made the column `alloted` on table `Applicant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Applicant" ALTER COLUMN "alloted" SET NOT NULL,
ALTER COLUMN "alloted" SET DEFAULT false;
