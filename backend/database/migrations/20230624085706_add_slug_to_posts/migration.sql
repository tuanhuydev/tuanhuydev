/*
  Warnings:

  - Added the required column `slug` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "posts_authorId_key";

-- AlterTable
ALTER TABLE "posts" ADD COLUMN "slug" TEXT NOT NULL;
