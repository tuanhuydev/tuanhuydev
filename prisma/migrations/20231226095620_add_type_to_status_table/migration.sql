-- DropIndex
DROP INDEX "tasks_statusId_key";

-- AlterTable
ALTER TABLE "status" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'default';
