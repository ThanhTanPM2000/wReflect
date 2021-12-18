/*
  Warnings:

  - A unique constraint covering the columns `[userId,token]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Session.userId_token_unique" ON "Session"("userId", "token");
