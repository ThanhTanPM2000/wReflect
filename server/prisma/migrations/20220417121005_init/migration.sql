/*
  Warnings:

  - You are about to drop the `MemberOnAssessmentOnCriteria` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MemberOnAssessmentOnCriteria" DROP CONSTRAINT "MemberOnAssessmentOnCriteria_criteriaId_assessmentId_fkey";

-- DropForeignKey
ALTER TABLE "MemberOnAssessmentOnCriteria" DROP CONSTRAINT "MemberOnAssessmentOnCriteria_memberId_fkey";

-- DropTable
DROP TABLE "MemberOnAssessmentOnCriteria";

-- CreateTable
CREATE TABLE "AssessorOnAssessmentOnCriteria" (
    "id" TEXT NOT NULL,
    "criteriaId" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "assessorId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessingMember" (
    "id" TEXT NOT NULL,
    "point" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "assessorOnAssessmentOnCriteriaId" TEXT,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AssessorOnAssessmentOnCriteria" ADD FOREIGN KEY ("criteriaId", "assessmentId") REFERENCES "AssessmentOnCriteria"("criteriaId", "assessmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessorOnAssessmentOnCriteria" ADD FOREIGN KEY ("assessorId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessingMember" ADD FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessingMember" ADD FOREIGN KEY ("assessorOnAssessmentOnCriteriaId") REFERENCES "AssessorOnAssessmentOnCriteria"("id") ON DELETE SET NULL ON UPDATE CASCADE;
