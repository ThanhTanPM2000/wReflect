-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_memberAnswersId_fkey";

-- DropForeignKey
ALTER TABLE "HealthCheck" DROP CONSTRAINT "HealthCheck_boardId_fkey";

-- DropForeignKey
ALTER TABLE "HealthCheck" DROP CONSTRAINT "HealthCheck_teamId_fkey";

-- DropForeignKey
ALTER TABLE "MemberAnswer" DROP CONSTRAINT "MemberAnswer_healthCheckId_fkey";

-- DropForeignKey
ALTER TABLE "MemberAnswer" DROP CONSTRAINT "MemberAnswer_userId_fkey";

-- DropForeignKey
ALTER TABLE "MemberComment" DROP CONSTRAINT "MemberComment_healthCheckId_fkey";

-- DropForeignKey
ALTER TABLE "MemberComment" DROP CONSTRAINT "MemberComment_userId_fkey";

-- AddForeignKey
ALTER TABLE "HealthCheck" ADD FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthCheck" ADD FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberAnswer" ADD FOREIGN KEY ("healthCheckId") REFERENCES "HealthCheck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberAnswer" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD FOREIGN KEY ("memberAnswersId") REFERENCES "MemberAnswer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberComment" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberComment" ADD FOREIGN KEY ("healthCheckId") REFERENCES "HealthCheck"("id") ON DELETE CASCADE ON UPDATE CASCADE;
