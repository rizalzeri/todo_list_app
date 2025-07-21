/*
  Warnings:

  - You are about to drop the column `color` on the `categories` table. All the data in the column will be lost.
  - Added the required column `end_time` to the `todos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `todos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "master_data"."categories" DROP COLUMN "color",
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "raw_data"."todos" ADD COLUMN     "end_time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start_time" TIMESTAMP(3) NOT NULL;
