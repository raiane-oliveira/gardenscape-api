/*
  Warnings:

  - Made the column `planted_at` on table `plants_on_garden` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "gardens" DROP CONSTRAINT "gardens_user_id_fkey";

-- DropForeignKey
ALTER TABLE "plants_on_garden" DROP CONSTRAINT "plants_on_garden_garden_id_fkey";

-- AlterTable
ALTER TABLE "plants_on_garden" ALTER COLUMN "planted_at" SET NOT NULL,
ALTER COLUMN "planted_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "gardens" ADD CONSTRAINT "gardens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plants_on_garden" ADD CONSTRAINT "plants_on_garden_garden_id_fkey" FOREIGN KEY ("garden_id") REFERENCES "gardens"("id") ON DELETE CASCADE ON UPDATE CASCADE;
