-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "limit" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MonthlyExpenses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "descrition" TEXT NOT NULL,
    "installments" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "monthlyInterest" REAL NOT NULL,
    "initialMonth" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cardId" TEXT NOT NULL,
    CONSTRAINT "MonthlyExpenses_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Card_id_key" ON "Card"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyExpenses_id_key" ON "MonthlyExpenses"("id");
