/*
  Warnings:

  - A unique constraint covering the columns `[applicantId]` on the table `Allotment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Allotment_applicantId_key" ON "Allotment"("applicantId");
