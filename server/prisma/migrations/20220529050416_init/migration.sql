/*
  Warnings:

  - You are about to drop the column `meetingNote` on the `Member` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BanningUser" DROP CONSTRAINT "BanningUser_userId_fkey";

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "meetingNote";

-- AddForeignKey
ALTER TABLE "BanningUser" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
