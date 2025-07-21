-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "master_data";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "raw_data";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "users";

-- CreateEnum
CREATE TYPE "raw_data"."ImportStatus" AS ENUM ('pending', 'success', 'failed');

-- CreateTable
CREATE TABLE "master_data"."todos" (
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

-- CreateTable
CREATE TABLE "raw_data"."import_batches" (
    "id" SERIAL NOT NULL,
    "filename" VARCHAR(255) NOT NULL,
    "imported_at" TIMESTAMP(3) NOT NULL,
    "status" "raw_data"."ImportStatus" NOT NULL,
    "error_message" TEXT,

    CONSTRAINT "import_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raw_data"."export_requests" (
    "id" SERIAL NOT NULL,
    "requested_at" TIMESTAMP(3) NOT NULL,
    "filter_params" JSONB,
    "file_url" VARCHAR(255) NOT NULL,

    CONSTRAINT "export_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_data"."categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "color" VARCHAR(7) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "master_data"."todos" ADD CONSTRAINT "todos_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "master_data"."categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_data"."todos" ADD CONSTRAINT "todos_import_batch_id_fkey" FOREIGN KEY ("import_batch_id") REFERENCES "raw_data"."import_batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;
