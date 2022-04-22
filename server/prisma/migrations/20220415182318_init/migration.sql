/*
  Warnings:

  - The primary key for the `AssessmentOnCriteria` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[assessmentId,criteriaId]` on the table `AssessmentOnCriteria` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `AssessmentOnCriteria` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "AssessmentOnCriteria" DROP CONSTRAINT "AssessmentOnCriteria_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "MemberOnAssessmentOnCriteria" (
    "id" TEXT NOT NULL,
    "criteriaId" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "point" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentOnCriteria.assessmentId_criteriaId_unique" ON "AssessmentOnCriteria"("assessmentId", "criteriaId");

-- AddForeignKey
ALTER TABLE "MemberOnAssessmentOnCriteria" ADD FOREIGN KEY ("criteriaId", "assessmentId") REFERENCES "AssessmentOnCriteria"("criteriaId", "assessmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberOnAssessmentOnCriteria" ADD FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
