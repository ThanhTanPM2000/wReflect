-- DropForeignKey
ALTER TABLE "AssessmentOnCriteria" DROP CONSTRAINT "AssessmentOnCriteria_assessmentId_fkey";

-- DropForeignKey
ALTER TABLE "AssessmentOnCriteria" DROP CONSTRAINT "AssessmentOnCriteria_criteriaId_fkey";

-- AddForeignKey
ALTER TABLE "AssessmentOnCriteria" ADD FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentOnCriteria" ADD FOREIGN KEY ("criteriaId") REFERENCES "Criteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;
