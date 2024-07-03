/*
  Warnings:

  - You are about to drop the column `user_id` on the `subscriptions` table. All the data in the column will be lost.
  - Added the required column `customer_id` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_user_id_fkey";

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "user_id",
ADD COLUMN     "customer_id" TEXT NOT NULL;
