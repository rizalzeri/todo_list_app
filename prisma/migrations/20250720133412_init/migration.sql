/*
  Warnings:

  - You are about to drop the `todos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "master_data"."todos" DROP CONSTRAINT "todos_category_id_fkey";

-- DropForeignKey
ALTER TABLE "master_data"."todos" DROP CONSTRAINT "todos_import_batch_id_fkey";

-- DropTable
DROP TABLE "master_data"."todos";

-- CreateTable
CREATE TABLE "raw_data"."todos" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "due_date" TIMESTAMP(3) NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "category_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "import_batch_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "todos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "raw_data"."todos" ADD CONSTRAINT "todos_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "master_data"."categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raw_data"."todos" ADD CONSTRAINT "todos_import_batch_id_fkey" FOREIGN KEY ("import_batch_id") REFERENCES "raw_data"."import_batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;
