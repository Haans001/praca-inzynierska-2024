-- CreateTable
CREATE TABLE "Repertoire" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Repertoire_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Repertoire_startTime_endTime_key" ON "Repertoire"("startTime", "endTime");

-- AddForeignKey
ALTER TABLE "Repertoire" ADD CONSTRAINT "Repertoire_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
