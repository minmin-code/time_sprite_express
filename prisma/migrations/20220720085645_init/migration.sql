/*
  Warnings:

  - You are about to drop the column `clock` on the `todo` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `todo` table. All the data in the column will be lost.
  - You are about to drop the column `ddl` on the `todo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `todo` DROP COLUMN `clock`,
    DROP COLUMN `date`,
    DROP COLUMN `ddl`,
    ADD COLUMN `deadline` DATETIME(3) NULL;
