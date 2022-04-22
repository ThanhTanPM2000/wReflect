/*
  Warnings:

  - You are about to drop the column `memberId` on the `AssessorOnAssessment` table. All the data in the column will be lost.
  - Added the required column `concerningMemberId` to the `AssessorOnAssessment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AssessorOnAssessment" DROP CONSTRAINT "AssessorOnAssessment_memberId_fkey";

-- AlterTable
ALTER TABLE "AssessorOnAssessment" DROP COLUMN "memberId",
ADD COLUMN     "concerningMemberId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AssessorOnAssessment" ADD FOREIGN KEY ("concerningMemberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
