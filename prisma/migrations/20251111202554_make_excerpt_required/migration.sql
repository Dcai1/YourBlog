/*
  Warnings:

  - Made the column `excerpt` on table `BlogPost` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BlogPost" ALTER COLUMN "excerpt" SET NOT NULL;
