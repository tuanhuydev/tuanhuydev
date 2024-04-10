-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('BUG', 'ISSUE', 'STORY', 'EPIC');

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "type" "TaskType" NOT NULL DEFAULT 'ISSUE';
