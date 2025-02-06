/*
  Warnings:

  - You are about to drop the column `skillId` on the `Project` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_skillId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "skillId";
