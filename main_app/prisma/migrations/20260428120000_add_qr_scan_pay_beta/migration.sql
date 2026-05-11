DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'QRTransactionStatus') THEN
    CREATE TYPE "QRTransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "feature_flags" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "feature_flags_key_key" ON "feature_flags"("key");

CREATE TABLE IF NOT EXISTS "qr_transactions" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "amountINR" DECIMAL(65,30) NOT NULL,
  "amountUSDT" DECIMAL(65,30) NOT NULL,
  "fee" DECIMAL(65,30) NOT NULL DEFAULT 0,
  "transactionHash" TEXT,
  "status" "QRTransactionStatus" NOT NULL DEFAULT 'PENDING',
  "qrCodeData" TEXT,
  "adminCompletedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "qr_transactions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "qr_transactions_transactionHash_key" ON "qr_transactions"("transactionHash");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'qr_transactions_userId_fkey'
  ) THEN
    ALTER TABLE "qr_transactions"
      ADD CONSTRAINT "qr_transactions_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "users"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

INSERT INTO "feature_flags" ("id", "key", "enabled", "createdAt", "updatedAt")
SELECT
  'qr-scan-pay-beta',
  'qr_scan_pay_enabled',
  false,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM "feature_flags" WHERE "key" = 'qr_scan_pay_enabled'
);
