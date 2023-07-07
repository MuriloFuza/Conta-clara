/*
  Warnings:

  - You are about to alter the column `limit` on the `Card` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Card" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "limit" INTEGER NOT NULL,
    "dueDate" TEXT NOT NULL,
    "userId" TEXT NOT NULL
);
INSERT INTO "new_Card" ("dueDate", "id", "limit", "name", "userId") SELECT "dueDate", "id", "limit", "name", "userId" FROM "Card";
DROP TABLE "Card";
ALTER TABLE "new_Card" RENAME TO "Card";
CREATE UNIQUE INDEX "Card_id_key" ON "Card"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
