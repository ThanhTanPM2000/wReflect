-- AlterIndex
ALTER INDEX "Criteria_name_key" RENAME TO "Criteria.name_unique";

-- AlterIndex
ALTER INDEX "HealthCheck_boardId_key" RENAME TO "HealthCheck.boardId_unique";

-- AlterIndex
ALTER INDEX "HealthCheck_teamId_boardId_key" RENAME TO "HealthCheck.teamId_boardId_unique";

-- AlterIndex
ALTER INDEX "Member_userId_teamId_key" RENAME TO "Member.userId_teamId_unique";

-- AlterIndex
ALTER INDEX "MemberAnswer_healthCheckId_memberId_key" RENAME TO "MemberAnswer.healthCheckId_memberId_unique";

-- AlterIndex
ALTER INDEX "MemberComment_healthCheckId_questionId_memberId_key" RENAME TO "MemberComment.healthCheckId_questionId_memberId_unique";

-- AlterIndex
ALTER INDEX "Session_expiresAt_idx" RENAME TO "Session.expiresAt_index";

-- AlterIndex
ALTER INDEX "Session_userId_token_key" RENAME TO "Session.userId_token_unique";

-- AlterIndex
ALTER INDEX "User_email_idx" RENAME TO "User.email_index";

-- AlterIndex
ALTER INDEX "User_email_key" RENAME TO "User.email_unique";
