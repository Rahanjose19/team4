-- CreateTable
CREATE TABLE "ApplicantChoice" (
    "priority" INTEGER NOT NULL,
    "quotaId" TEXT,
    "applicantId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "ApplicantChoice_pkey" PRIMARY KEY ("applicantId","priority")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApplicantChoice_applicantId_courseId_key" ON "ApplicantChoice"("applicantId", "courseId");

-- AddForeignKey
ALTER TABLE "ApplicantChoice" ADD CONSTRAINT "ApplicantChoice_quotaId_fkey" FOREIGN KEY ("quotaId") REFERENCES "Quota"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicantChoice" ADD CONSTRAINT "ApplicantChoice_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicantChoice" ADD CONSTRAINT "ApplicantChoice_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
