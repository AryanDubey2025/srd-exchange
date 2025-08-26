/*
  Warnings:

  - You are about to drop the column `accountName` on the `bank_details` table. All the data in the column will be lost.
  - You are about to drop the column `bankName` on the `bank_details` table. All the data in the column will be lost.
  - Added the required column `accountHolderName` to the `bank_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."bank_details" DROP COLUMN "accountName",
DROP COLUMN "bankName",
ADD COLUMN     "accountHolderName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "profileCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "upiId" TEXT;
