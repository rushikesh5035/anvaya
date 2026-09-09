/*
  Warnings:

  - A unique constraint covering the columns `[userId,githubId]` on the table `repository` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "repository_githubId_key";

-- CreateTable
CREATE TABLE "review" (
    "id" TEXT NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "pullRequestNumber" INTEGER NOT NULL,
    "pullRequestTitle" TEXT NOT NULL,
    "pullRequestUrl" TEXT NOT NULL,
    "review" TEXT NOT NULL,
    "reviewStatus" TEXT NOT NULL DEFAULT 'completed',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "review_repositoryId_idx" ON "review"("repositoryId");

-- CreateIndex
CREATE UNIQUE INDEX "repository_userId_githubId_key" ON "repository"("userId", "githubId");

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;
