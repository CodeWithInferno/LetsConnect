/*
  Warnings:

  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectContributor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectLanguage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectSkill` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_managerId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectContributor" DROP CONSTRAINT "ProjectContributor_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectContributor" DROP CONSTRAINT "ProjectContributor_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectLanguage" DROP CONSTRAINT "ProjectLanguage_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectSkill" DROP CONSTRAINT "ProjectSkill_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectSkill" DROP CONSTRAINT "ProjectSkill_skillId_fkey";

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "ProjectContributor";

-- DropTable
DROP TABLE "ProjectLanguage";

-- DropTable
DROP TABLE "ProjectSkill";
