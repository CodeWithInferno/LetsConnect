/*
  Warnings:

  - You are about to drop the column `ownerType` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Project` table. All the data in the column will be lost.
  - The primary key for the `ProjectMember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `status` on the `ProjectMember` table. All the data in the column will be lost.
  - You are about to drop the `ProjectActivity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectResource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProjectToProjectCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProjectToProjectTag` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,projectId]` on the table `ProjectMember` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectType` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Made the column `deadline` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - The required column `id` was added to the `ProjectMember` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectActivity" DROP CONSTRAINT "ProjectActivity_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectActivity" DROP CONSTRAINT "ProjectActivity_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectResource" DROP CONSTRAINT "ProjectResource_projectId_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToProjectCategory" DROP CONSTRAINT "_ProjectToProjectCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToProjectCategory" DROP CONSTRAINT "_ProjectToProjectCategory_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToProjectTag" DROP CONSTRAINT "_ProjectToProjectTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToProjectTag" DROP CONSTRAINT "_ProjectToProjectTag_B_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "ownerType",
DROP COLUMN "status",
ADD COLUMN     "certificateEligible" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "languages" TEXT[],
ADD COLUMN     "organizationId" TEXT,
ADD COLUMN     "projectType" TEXT NOT NULL,
ALTER COLUMN "deadline" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProjectMember" DROP CONSTRAINT "ProjectMember_pkey",
DROP COLUMN "status",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "ProjectMember_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "ProjectActivity";

-- DropTable
DROP TABLE "ProjectCategory";

-- DropTable
DROP TABLE "ProjectResource";

-- DropTable
DROP TABLE "ProjectTag";

-- DropTable
DROP TABLE "_ProjectToProjectCategory";

-- DropTable
DROP TABLE "_ProjectToProjectTag";

-- CreateIndex
CREATE INDEX "Project_ownerId_idx" ON "Project"("ownerId");

-- CreateIndex
CREATE INDEX "Project_organizationId_idx" ON "Project"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMember_userId_projectId_key" ON "ProjectMember"("userId", "projectId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
