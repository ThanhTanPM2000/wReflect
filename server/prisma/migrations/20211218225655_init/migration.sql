-- CreateEnum
CREATE TYPE "TeamStatus" AS ENUM ('DOING', 'DONE');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('PENDING_INVITATION', 'JOINED');

-- CreateEnum
CREATE TYPE "UserOnlineStatus" AS ENUM ('ONLINE', 'OFFLINE');

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "data" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ownerEmail" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "TeamStatus" NOT NULL DEFAULT E'DOING',
    "picture" TEXT NOT NULL,
    "numOfMember" INTEGER NOT NULL DEFAULT 1,
    "isPublish" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamToken" (
    "id" SERIAL NOT NULL,
    "teamId" INTEGER NOT NULL,
    "inviteEmail" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" SERIAL NOT NULL,
    "isOwner" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT,
    "teamId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT,
    "status" "MemberStatus" NOT NULL DEFAULT E'JOINED',

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT E'NotInitiated',

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL DEFAULT E'Unknown',
    "nickname" TEXT NOT NULL DEFAULT E'Unknown',
    "picture" TEXT NOT NULL,
    "gender" TEXT NOT NULL DEFAULT E'Unspecified',
    "workplace" TEXT,
    "address" TEXT,
    "userStatus" "UserOnlineStatus" NOT NULL DEFAULT E'OFFLINE',
    "school" TEXT,
    "introduction" TEXT,
    "phoneNumber" TEXT,
    "talents" TEXT,
    "interests" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session.userId_token_unique" ON "Session"("userId", "token");

-- CreateIndex
CREATE INDEX "Session.expiresAt_index" ON "Session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Member.email_teamId_unique" ON "Member"("email", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE INDEX "User.email_index" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile.userId_unique" ON "UserProfile"("userId");

-- AddForeignKey
ALTER TABLE "Session" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamToken" ADD FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
