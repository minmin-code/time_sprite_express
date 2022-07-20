/*
  Warnings:

  - You are about to drop the column `deadline` on the `todo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `todo` DROP COLUMN `deadline`,
    ADD COLUMN `ddl` DATETIME(3) NULL;
