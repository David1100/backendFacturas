/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Categoria` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Factura` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Servicio` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Categoria" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Cliente" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Factura" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Producto" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Servicio" DROP COLUMN "updatedAt";
