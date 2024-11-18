-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "repertoireId" INTEGER NOT NULL,
    "seatNumbers" INTEGER[],
    "userEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_repertoireId_fkey" FOREIGN KEY ("repertoireId") REFERENCES "Repertoire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
