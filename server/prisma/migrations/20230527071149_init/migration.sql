-- RenameIndex
ALTER INDEX "BanningUser.userId_unique" RENAME TO "BanningUser_userId_key";

-- RenameIndex
ALTER INDEX "Criteria.name_unique" RENAME TO "Criteria_name_key";

-- RenameIndex
ALTER INDEX "Evaluation.assessmentId_assessorId_unique" RENAME TO "Evaluation_assessmentId_assessorId_key";

-- RenameIndex
ALTER INDEX "HealthCheck.boardId_unique" RENAME TO "HealthCheck_boardId_key";

-- RenameIndex
ALTER INDEX "HealthCheck.teamId_boardId_unique" RENAME TO "HealthCheck_teamId_boardId_key";

-- RenameIndex
ALTER INDEX "HealthCheckTemplate.title_unique" RENAME TO "HealthCheckTemplate_title_key";

-- RenameIndex
ALTER INDEX "Member.userId_teamId_unique" RENAME TO "Member_userId_teamId_key";

-- RenameIndex
ALTER INDEX "Session.expiresAt_index" RENAME TO "Session_expiresAt_idx";

-- RenameIndex
ALTER INDEX "Session.userId_token_unique" RENAME TO "Session_userId_token_key";

-- RenameIndex
ALTER INDEX "TemplateQuestion.title_templateId_unique" RENAME TO "TemplateQuestion_title_templateId_key";

-- RenameIndex
ALTER INDEX "User.email_index" RENAME TO "User_email_idx";

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";

-- RenameIndex
ALTER INDEX "UserOnCriteria.userId_criteriaId_unique" RENAME TO "UserOnCriteria_userId_criteriaId_key";
