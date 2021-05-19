-- CreateEnum
CREATE TYPE "ScannerType" AS ENUM ('consumer', 'checker');

-- CreateTable
CREATE TABLE "Scanner" (
    "id" TEXT NOT NULL,
    "type" "ScannerType" NOT NULL,
    "carrier_id" TEXT NOT NULL,
    "valid_prices" INTEGER[],

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Scanner" ADD FOREIGN KEY ("carrier_id") REFERENCES "Carrier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
