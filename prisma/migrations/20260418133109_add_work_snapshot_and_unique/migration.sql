/*
  Warnings:

  - A unique constraint covering the columns `[developerProfileId,workId]` on the table `Acquisition` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Acquisition" ADD COLUMN     "workSnapshot" JSONB NOT NULL DEFAULT '{}';

-- CreateIndex
CREATE UNIQUE INDEX "Acquisition_developerProfileId_workId_key" ON "Acquisition"("developerProfileId", "workId");
