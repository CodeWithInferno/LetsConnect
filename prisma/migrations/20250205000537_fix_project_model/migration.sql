/*
  Warnings:

  - You are about to drop the column `languages` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `skillsRequired` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "languages",
DROP COLUMN "skillsRequired";

-- CreateTable
CREATE TABLE "ProgrammingLanguage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ProgrammingLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectToSkill" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectToSkill_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProgrammingLanguageToProject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProgrammingLanguageToProject_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProgrammingLanguage_name_key" ON "ProgrammingLanguage"("name");

-- CreateIndex
CREATE INDEX "_ProjectToSkill_B_index" ON "_ProjectToSkill"("B");

-- CreateIndex
CREATE INDEX "_ProgrammingLanguageToProject_B_index" ON "_ProgrammingLanguageToProject"("B");

-- AddForeignKey
ALTER TABLE "_ProjectToSkill" ADD CONSTRAINT "_ProjectToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToSkill" ADD CONSTRAINT "_ProjectToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProgrammingLanguageToProject" ADD CONSTRAINT "_ProgrammingLanguageToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "ProgrammingLanguage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProgrammingLanguageToProject" ADD CONSTRAINT "_ProgrammingLanguageToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
