-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "national_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "credit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "secret" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User.phone_number_unique" ON "User"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "User.national_id_unique" ON "User"("national_id");
