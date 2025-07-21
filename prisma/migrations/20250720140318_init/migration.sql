/*
  Warnings:

  - You are about to drop the column `is_completed` on the `todos` table. All the data in the column will be lost.
  - Added the required column `status_id` to the `todos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "raw_data"."todos" DROP COLUMN "is_completed",
ADD COLUMN     "status_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "master_data"."statuses" (
    "id" SERIAL NOT NULL,
    "status_name" VARCHAR(100) NOT NULL,

    CONSTRAINT "statuses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "raw_data"."todos" ADD CONSTRAINT "todos_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "master_data"."statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
