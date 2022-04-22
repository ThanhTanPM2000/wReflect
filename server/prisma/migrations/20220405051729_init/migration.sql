/*
  Warnings:

  - The values [PLANNED,DOING,COMPLETE] on the enum `AssessmentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AssessmentStatus_new" AS ENUM ('Planned', 'Doing', 'Complete', 'REOPENED');
ALTER TABLE "Assessment" ALTER COLUMN "status" TYPE "AssessmentStatus_new" USING ("status"::text::"AssessmentStatus_new");
ALTER TYPE "AssessmentStatus" RENAME TO "AssessmentStatus_old";
ALTER TYPE "AssessmentStatus_new" RENAME TO "AssessmentStatus";
DROP TYPE "AssessmentStatus_old";
COMMIT;
