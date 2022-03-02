-- CreateEnum
CREATE TYPE "StatusHealthCheck" AS ENUM ('OPEN', 'CLOSED');

-- CreateTable
CREATE TABLE "HealthCheck" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL,
    "isCustom" BOOLEAN NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberAnswers" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "healthCheckId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "memberAnswersId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberComments" (
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

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "healthCheckId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HealthCheck.boardId_unique" ON "HealthCheck"("boardId");

-- AddForeignKey
ALTER TABLE "HealthCheck" ADD FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthCheck" ADD FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberAnswers" ADD FOREIGN KEY ("healthCheckId") REFERENCES "HealthCheck"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberAnswers" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD FOREIGN KEY ("memberAnswersId") REFERENCES "MemberAnswers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberComments" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberComments" ADD FOREIGN KEY ("healthCheckId") REFERENCES "HealthCheck"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD FOREIGN KEY ("healthCheckId") REFERENCES "HealthCheck"("id") ON DELETE SET NULL ON UPDATE CASCADE;
