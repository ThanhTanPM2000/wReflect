/*
  Warnings:

  - Added the required column `status` to the `HealthCheck` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HealthCheck" ADD COLUMN     "status" "StatusHealthCheck" NOT NULL;
