/*
  Warnings:

  - You are about to drop the column `memberId` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the `AssessmentOnCritera` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Critera` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ownerId` to the `Assessment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Assessment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AssessmentStatus" AS ENUM ('PLANNED', 'DOING', 'COMPLETE', 'REOPENED');

-- DropForeignKey
ALTER TABLE "Assessment" DROP CONSTRAINT "Assessment_memberId_fkey";

-- DropForeignKey
ALTER TABLE "AssessmentOnCritera" DROP CONSTRAINT "AssessmentOnCritera_assessmentId_fkey";

-- DropForeignKey
ALTER TABLE "AssessmentOnCritera" DROP CONSTRAINT "AssessmentOnCritera_criteraId_fkey";

-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "memberId",
ADD COLUMN     "ownerId" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "AssessmentStatus" NOT NULL;

-- DropTable
DROP TABLE "AssessmentOnCritera";

-- DropTable
DROP TABLE "Critera";

-- DropEnum
DROP TYPE "ReflectionCriteriaStatus";

-- CreateTable
CREATE TABLE "AssessmentOnCriteria" (
    "assessmentId" TEXT NOT NULL,
    "criteriaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,

    PRIMARY KEY ("assessmentId","criteriaId")
);

-- CreateTable
CREATE TABLE "Criteria" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Criteria.name_unique" ON "Criteria"("name");

-- AddForeignKey
ALTER TABLE "Assessment" ADD FOREIGN KEY ("ownerId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentOnCriteria" ADD FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentOnCriteria" ADD FOREIGN KEY ("criteriaId") REFERENCES "Criteria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
