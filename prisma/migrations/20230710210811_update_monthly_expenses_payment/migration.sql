-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MonthlyExpenses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "installments" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "monthlyInterest" REAL NOT NULL,
    "initialMonth" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment" BOOLEAN NOT NULL DEFAULT false,
    "cardId" TEXT NOT NULL,
    CONSTRAINT "MonthlyExpenses_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MonthlyExpenses" ("cardId", "description", "id", "initialMonth", "installments", "monthlyInterest", "value") SELECT "cardId", "description", "id", "initialMonth", "installments", "monthlyInterest", "value" FROM "MonthlyExpenses";
DROP TABLE "MonthlyExpenses";
ALTER TABLE "new_MonthlyExpenses" RENAME TO "MonthlyExpenses";
CREATE UNIQUE INDEX "MonthlyExpenses_id_key" ON "MonthlyExpenses"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
