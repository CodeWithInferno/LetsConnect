/*
  Warnings:

  - You are about to drop the column `programmingLanguages` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "programmingLanguages";

-- CreateTable
CREATE TABLE "UserProgrammingLanguage" (
    "userId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "UserProgrammingLanguage_pkey" PRIMARY KEY ("userId","languageId")
);

-- AddForeignKey
ALTER TABLE "UserProgrammingLanguage" ADD CONSTRAINT "UserProgrammingLanguage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgrammingLanguage" ADD CONSTRAINT "UserProgrammingLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "ProgrammingLanguage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
