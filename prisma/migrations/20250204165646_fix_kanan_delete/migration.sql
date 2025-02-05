-- DropForeignKey
ALTER TABLE "KanbanBoard" DROP CONSTRAINT "KanbanBoard_projectId_fkey";

-- AddForeignKey
ALTER TABLE "KanbanBoard" ADD CONSTRAINT "KanbanBoard_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
