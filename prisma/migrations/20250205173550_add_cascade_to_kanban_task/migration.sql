-- DropForeignKey
ALTER TABLE "KanbanTask" DROP CONSTRAINT "KanbanTask_projectId_fkey";

-- AddForeignKey
ALTER TABLE "KanbanTask" ADD CONSTRAINT "KanbanTask_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
