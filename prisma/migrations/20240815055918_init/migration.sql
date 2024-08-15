/*
  Warnings:

  - A unique constraint covering the columns `[mobile_number]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Contact_mobile_number_key` ON `Contact`(`mobile_number`);
