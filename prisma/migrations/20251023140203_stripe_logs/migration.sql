-- CreateTable
CREATE TABLE "stripe_event_logs" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "rawId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stripe_event_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stripe_event_logs_rawId_key" ON "stripe_event_logs"("rawId");
