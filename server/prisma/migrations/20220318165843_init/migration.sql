/*
  Warnings:

  - You are about to drop the `UserProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserProfile" DROP CONSTRAINT "UserProfile_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" VARCHAR(300),
ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT E'UNSPECIFIED',
ADD COLUMN     "interests" VARCHAR(500),
ADD COLUMN     "introduction" VARCHAR(500),
ADD COLUMN     "school" VARCHAR(300),
ADD COLUMN     "talents" VARCHAR(500),
ADD COLUMN     "workplace" VARCHAR(300);

-- DropTable
DROP TABLE "UserProfile";
