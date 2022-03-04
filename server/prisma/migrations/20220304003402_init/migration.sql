/*
  Warnings:

  - A unique constraint covering the columns `[healthCheckId,questionId,userId]` on the table `MemberComment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "MemberComment.healthCheckId_userId_unique";

-- CreateIndex
CREATE UNIQUE INDEX "MemberComment.healthCheckId_questionId_userId_unique" ON "MemberComment"("healthCheckId", "questionId", "userId");
