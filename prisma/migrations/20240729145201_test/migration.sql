/*
  Warnings:

  - Added the required column `lat` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lon` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `lat` DOUBLE NOT NULL,
    ADD COLUMN `lon` DOUBLE NOT NULL;
