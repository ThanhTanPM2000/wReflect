-- CreateTable
CREATE TABLE "MemberAnswer" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "healthCheckId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "memberId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "memberAnswersId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberComment" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "healthCheckId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "memberId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MemberAnswer.healthCheckId_memberId_unique" ON "MemberAnswer"("healthCheckId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberComment.healthCheckId_questionId_memberId_unique" ON "MemberComment"("healthCheckId", "questionId", "memberId");

-- AddForeignKey
ALTER TABLE "MemberAnswer" ADD FOREIGN KEY ("healthCheckId") REFERENCES "HealthCheck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberAnswer" ADD FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD FOREIGN KEY ("memberAnswersId") REFERENCES "MemberAnswer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberComment" ADD FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberComment" ADD FOREIGN KEY ("healthCheckId") REFERENCES "HealthCheck"("id") ON DELETE CASCADE ON UPDATE CASCADE;
