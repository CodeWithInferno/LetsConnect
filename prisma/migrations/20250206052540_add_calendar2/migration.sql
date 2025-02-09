-- AlterTable
ALTER TABLE "CalendarEvent" ADD COLUMN     "assignedToId" TEXT,
ADD COLUMN     "deadline" TIMESTAMP(3),
ADD COLUMN     "priority" TEXT;

-- AddForeignKey
ALTER TABLE "CalendarEvent" ADD CONSTRAINT "CalendarEvent_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
