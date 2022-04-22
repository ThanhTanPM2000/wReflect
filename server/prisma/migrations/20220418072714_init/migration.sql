/*
  Warnings:

  - You are about to drop the `Answer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MemberAnswer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MemberComment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_memberAnswersId_fkey";

-- DropForeignKey
ALTER TABLE "MemberAnswer" DROP CONSTRAINT "MemberAnswer_healthCheckId_fkey";

-- DropForeignKey
ALTER TABLE "MemberAnswer" DROP CONSTRAINT "MemberAnswer_memberId_fkey";

-- DropForeignKey
ALTER TABLE "MemberComment" DROP CONSTRAINT "MemberComment_healthCheckId_fkey";

-- DropForeignKey
ALTER TABLE "MemberComment" DROP CONSTRAINT "MemberComment_memberId_fkey";

-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "meetingNote" TEXT NOT NULL DEFAULT E'My meeting note...';

-- DropTable
DROP TABLE "Answer";

-- DropTable
DROP TABLE "MemberAnswer";

-- DropTable
DROP TABLE "MemberComment";

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "teamId" TEXT,
    "description" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateQuestion" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberOnHealthCheckOnQuestion" (
    "id" TEXT NOT NULL,
    "healthCheckId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "point" TEXT NOT NULL,
    "comment" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Template" ADD FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateQuestion" ADD FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberOnHealthCheckOnQuestion" ADD FOREIGN KEY ("healthCheckId") REFERENCES "HealthCheck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberOnHealthCheckOnQuestion" ADD FOREIGN KEY ("questionId") REFERENCES "TemplateQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberOnHealthCheckOnQuestion" ADD FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
