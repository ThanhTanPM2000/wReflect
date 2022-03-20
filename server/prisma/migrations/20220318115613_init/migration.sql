/*
  Warnings:

  - You are about to drop the column `selectedBoard` on the `Team` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "InviteLink" DROP CONSTRAINT "InviteLink_teamId_fkey";

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "selectedBoard";
