-- CreateTable
CREATE TABLE "AccessPass" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "zoneName" TEXT NOT NULL,
    "zoneDetail" TEXT,
    "requestedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requestDate" TEXT NOT NULL,
    "requestTime" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "revokedAt" DATETIME,
    "usedAt" DATETIME,
    CONSTRAINT "AccessPass_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AccessPass_token_key" ON "AccessPass"("token");

-- CreateIndex
CREATE INDEX "AccessPass_userId_expiresAt_idx" ON "AccessPass"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "AccessPass_requestDate_idx" ON "AccessPass"("requestDate");
