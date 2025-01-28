/*
  Warnings:

  - You are about to drop the column `phoneExtension` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "phoneExtension",
ADD COLUMN     "phone_extension" TEXT;
