/*
  Warnings:

  - You are about to alter the column `ddl` on the `todo` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `todo` ADD COLUMN `date` DATETIME(3) NULL,
    MODIFY `ddl` DATETIME(3) NULL;
