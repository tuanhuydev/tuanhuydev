/*
  Warnings:

  - Made the column `content` on table `posts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "deletedAt" TIMESTAMP(6),
ALTER COLUMN "content" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deletedAt" TIMESTAMP(6);
