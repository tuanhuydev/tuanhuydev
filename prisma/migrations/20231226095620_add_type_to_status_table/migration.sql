-- DropIndex
DROP INDEX "tasks_statusId_key";

-- AlterTable
ALTER TABLE "statuses" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'default';
