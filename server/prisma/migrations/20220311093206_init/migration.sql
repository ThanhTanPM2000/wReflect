-- CreateEnum
CREATE TYPE "ReflectionCriteriaStatus" AS ENUM ('PLANNED', 'DOING', 'COMPLETE', 'REOPENED');

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "teamId" TEXT NOT NULL,
    "status" "ReflectionCriteriaStatus" NOT NULL,
    "memberId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentOnCritera" (
    "assessmentId" TEXT NOT NULL,
    "criteraId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,

    PRIMARY KEY ("assessmentId","criteraId")
);

-- CreateTable
CREATE TABLE "Critera" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Critera.name_unique" ON "Critera"("name");

-- AddForeignKey
ALTER TABLE "Assessment" ADD FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentOnCritera" ADD FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentOnCritera" ADD FOREIGN KEY ("criteraId") REFERENCES "Critera"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
