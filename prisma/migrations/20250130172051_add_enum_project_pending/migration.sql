-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('PENDING', 'ACTIVE', 'REJECTED');

-- AlterTable
ALTER TABLE "ProjectMember" ADD COLUMN     "status" "MembershipStatus" NOT NULL DEFAULT 'PENDING';
