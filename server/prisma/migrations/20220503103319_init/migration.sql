/*
  Warnings:

  - You are about to drop the `Answer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MemberAnswer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MemberComment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_memberAnswersId_fkey";

-- DropForeignKey
ALTER TABLE "AnswerOnCriteria" DROP CONSTRAINT "AnswerOnCriteria_resultId_fkey";

-- DropForeignKey
ALTER TABLE "Evaluation" DROP CONSTRAINT "Evaluation_assessmentId_fkey";

-- DropForeignKey
ALTER TABLE "Evaluation" DROP CONSTRAINT "Evaluation_assessorId_fkey";

-- DropForeignKey
ALTER TABLE "MemberAnswer" DROP CONSTRAINT "MemberAnswer_healthCheckId_fkey";

-- DropForeignKey
ALTER TABLE "MemberAnswer" DROP CONSTRAINT "MemberAnswer_memberId_fkey";

-- DropForeignKey
ALTER TABLE "MemberComment" DROP CONSTRAINT "MemberComment_healthCheckId_fkey";

-- DropForeignKey
ALTER TABLE "MemberComment" DROP CONSTRAINT "MemberComment_memberId_fkey";

-- DropForeignKey
ALTER TABLE "MemberOnHealthCheckOnQuestion" DROP CONSTRAINT "MemberOnHealthCheckOnQuestion_healthCheckId_fkey";

-- DropForeignKey
ALTER TABLE "MemberOnHealthCheckOnQuestion" DROP CONSTRAINT "MemberOnHealthCheckOnQuestion_memberId_fkey";

-- DropForeignKey
ALTER TABLE "MemberOnHealthCheckOnQuestion" DROP CONSTRAINT "MemberOnHealthCheckOnQuestion_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_concerningMemberId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_evaluationId_fkey";

-- DropForeignKey
ALTER TABLE "Template" DROP CONSTRAINT "Template_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TemplateQuestion" DROP CONSTRAINT "TemplateQuestion_templateId_fkey";

-- DropForeignKey
ALTER TABLE "UserOnCriteria" DROP CONSTRAINT "UserOnCriteria_criteriaId_fkey";

-- DropForeignKey
ALTER TABLE "UserOnCriteria" DROP CONSTRAINT "UserOnCriteria_userId_fkey";

-- DropTable
DROP TABLE "Answer";

-- DropTable
DROP TABLE "MemberAnswer";

-- DropTable
DROP TABLE "MemberComment";

-- AddForeignKey
ALTER TABLE "Evaluation" ADD FOREIGN KEY ("assessorId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD FOREIGN KEY ("concerningMemberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerOnCriteria" ADD FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateQuestion" ADD FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberOnHealthCheckOnQuestion" ADD FOREIGN KEY ("healthCheckId") REFERENCES "HealthCheck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberOnHealthCheckOnQuestion" ADD FOREIGN KEY ("questionId") REFERENCES "TemplateQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberOnHealthCheckOnQuestion" ADD FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnCriteria" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnCriteria" ADD FOREIGN KEY ("criteriaId") REFERENCES "Criteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;
