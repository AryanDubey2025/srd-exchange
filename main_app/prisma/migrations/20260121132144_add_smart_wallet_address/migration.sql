/*
  Warnings:

  - You are about to drop the column `smartWalletAddress` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_smartWalletAddress_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "smartWalletAddress";
