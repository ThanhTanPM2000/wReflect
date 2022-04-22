/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the `AssessingMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AssessorOnAssessmentOnCriteria` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `creatorId` to the `Assessment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AssessingMember" DROP CONSTRAINT "AssessingMember_assessorOnAssessmentOnCriteriaId_fkey";

-- DropForeignKey
ALTER TABLE "AssessingMember" DROP CONSTRAINT "AssessingMember_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Assessment" DROP CONSTRAINT "Assessment_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "AssessorOnAssessmentOnCriteria" DROP CONSTRAINT "AssessorOnAssessmentOnCriteria_assessorId_fkey";

-- DropForeignKey
ALTER TABLE "AssessorOnAssessmentOnCriteria" DROP CONSTRAINT "AssessorOnAssessmentOnCriteria_criteriaId_assessmentId_fkey";

-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "ownerId",
ADD COLUMN     "creatorId" TEXT NOT NULL;

-- DropTable
DROP TABLE "AssessingMember";

-- DropTable
DROP TABLE "AssessorOnAssessmentOnCriteria";

-- CreateTable
CREATE TABLE "AssessorOnAssessment" (
    "id" TEXT NOT NULL,
    "assessmentOnCriteriaId" TEXT NOT NULL,
    "assessorId" TEXT NOT NULL,
    "point" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Assessment" ADD FOREIGN KEY ("creatorId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessorOnAssessment" ADD FOREIGN KEY ("assessorId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessorOnAssessment" ADD FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessorOnAssessment" ADD FOREIGN KEY ("assessmentOnCriteriaId") REFERENCES "AssessmentOnCriteria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
