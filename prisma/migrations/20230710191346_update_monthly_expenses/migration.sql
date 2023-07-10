/*
  Warnings:

  - You are about to drop the column `descrition` on the `MonthlyExpenses` table. All the data in the column will be lost.
  - Added the required column `description` to the `MonthlyExpenses` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MonthlyExpenses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "installments" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "monthlyInterest" REAL NOT NULL,
    "initialMonth" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cardId" TEXT NOT NULL,
    CONSTRAINT "MonthlyExpenses_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MonthlyExpenses" ("cardId", "id", "initialMonth", "installments", "monthlyInterest", "value") SELECT "cardId", "id", "initialMonth", "installments", "monthlyInterest", "value" FROM "MonthlyExpenses";
DROP TABLE "MonthlyExpenses";
ALTER TABLE "new_MonthlyExpenses" RENAME TO "MonthlyExpenses";
CREATE UNIQUE INDEX "MonthlyExpenses_id_key" ON "MonthlyExpenses"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
