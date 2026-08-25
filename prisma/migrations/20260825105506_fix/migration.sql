/*
  Warnings:

  - You are about to drop the column `onwer` on the `repository` table. All the data in the column will be lost.
  - Added the required column `owner` to the `repository` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "repository" DROP COLUMN "onwer",
ADD COLUMN     "owner" TEXT NOT NULL;
