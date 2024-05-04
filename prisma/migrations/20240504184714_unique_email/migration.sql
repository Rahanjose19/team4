/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Applicant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `course_id` to the `Allotment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `district` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `graduationYear` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `major` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `percentage` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `school` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Applicant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Allotment" ADD COLUMN     "course_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Applicant" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "district" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "graduationYear" INTEGER NOT NULL,
ADD COLUMN     "major" TEXT NOT NULL,
ADD COLUMN     "percentage" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "school" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Applicant_email_key" ON "Applicant"("email");
