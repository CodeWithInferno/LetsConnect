/*
  Warnings:

  - Added the required column `position` to the `KanbanTask` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "KanbanTask" ADD COLUMN     "position" INTEGER NOT NULL;
