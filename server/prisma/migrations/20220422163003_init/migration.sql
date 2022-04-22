-- DropForeignKey
ALTER TABLE "AssessorOnAssessment" DROP CONSTRAINT "AssessorOnAssessment_assessmentOnCriteriaId_fkey";

-- AddForeignKey
ALTER TABLE "AssessorOnAssessment" ADD FOREIGN KEY ("assessmentOnCriteriaId") REFERENCES "AssessmentOnCriteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;
