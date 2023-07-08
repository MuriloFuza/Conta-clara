-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Card" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "limit" INTEGER NOT NULL,
    "dueDate" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "statusInvoice" TEXT NOT NULL DEFAULT 'open'
);
INSERT INTO "new_Card" ("dueDate", "id", "limit", "name", "statusInvoice", "userId") SELECT "dueDate", "id", "limit", "name", "statusInvoice", "userId" FROM "Card";
DROP TABLE "Card";
ALTER TABLE "new_Card" RENAME TO "Card";
CREATE UNIQUE INDEX "Card_id_key" ON "Card"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
