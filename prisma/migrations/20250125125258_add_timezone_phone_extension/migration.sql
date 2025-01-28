/*
  Warnings:

  - You are about to drop the column `phone_extension` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "phone_extension",
ADD COLUMN     "phoneExtension" TEXT;
