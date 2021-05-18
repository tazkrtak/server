-- CreateEnum
CREATE TYPE "CarrierType" AS ENUM ('bus', 'metro');

-- CreateTable
CREATE TABLE "Carrier" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "type" "CarrierType" NOT NULL,

    PRIMARY KEY ("id")
);
