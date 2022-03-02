/*
  Warnings:

  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MemberAnswers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MemberComments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_memberAnswersId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_healthCheckId_fkey";

-- DropForeignKey
ALTER TABLE "MemberAnswers" DROP CONSTRAINT "MemberAnswers_healthCheckId_fkey";

-- DropForeignKey
ALTER TABLE "MemberAnswers" DROP CONSTRAINT "MemberAnswers_userId_fkey";

-- DropForeignKey
ALTER TABLE "MemberComments" DROP CONSTRAINT "MemberComments_healthCheckId_fkey";

-- DropForeignKey
ALTER TABLE "MemberComments" DROP CONSTRAINT "MemberComments_userId_fkey";

-- AlterTable
ALTER TABLE "Answer" ALTER COLUMN "value" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "MemberAnswers";

-- DropTable
DROP TABLE "MemberComments";

-- CreateTable
CREATE TABLE "MemberAnswer" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "healthCheckId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberComment" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "healthCheckId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MemberAnswer" ADD FOREIGN KEY ("healthCheckId") REFERENCES "HealthCheck"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberAnswer" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD FOREIGN KEY ("memberAnswersId") REFERENCES "MemberAnswer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberComment" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberComment" ADD FOREIGN KEY ("healthCheckId") REFERENCES "HealthCheck"("id") ON DELETE SET NULL ON UPDATE CASCADE;
