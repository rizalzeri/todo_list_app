/*
  Warnings:

  - You are about to drop the column `import_batch_id` on the `todos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "raw_data"."todos" DROP CONSTRAINT "todos_import_batch_id_fkey";

-- AlterTable
ALTER TABLE "raw_data"."todos" DROP COLUMN "import_batch_id";
