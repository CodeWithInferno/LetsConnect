/*
  Warnings:

  - You are about to drop the column `bannerImage` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `certificateEligible` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `_ProgrammingLanguageToProject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProjectToSkill` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProgrammingLanguageToProject" DROP CONSTRAINT "_ProgrammingLanguageToProject_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProgrammingLanguageToProject" DROP CONSTRAINT "_ProgrammingLanguageToProject_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToSkill" DROP CONSTRAINT "_ProjectToSkill_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToSkill" DROP CONSTRAINT "_ProjectToSkill_B_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "bannerImage",
DROP COLUMN "certificateEligible",
ADD COLUMN     "skillId" TEXT;

-- DropTable
DROP TABLE "_ProgrammingLanguageToProject";

-- DropTable
DROP TABLE "_ProjectToSkill";

-- CreateTable
CREATE TABLE "_ProjectLanguages" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectLanguages_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProjectLanguages_B_index" ON "_ProjectLanguages"("B");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectLanguages" ADD CONSTRAINT "_ProjectLanguages_A_fkey" FOREIGN KEY ("A") REFERENCES "ProgrammingLanguage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectLanguages" ADD CONSTRAINT "_ProjectLanguages_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
