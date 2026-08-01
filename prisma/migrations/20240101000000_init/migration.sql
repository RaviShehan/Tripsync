-- CreateTable
CREATE TABLE "Tour" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "durationHours" INTEGER NOT NULL DEFAULT 3,
    "category" TEXT NOT NULL DEFAULT 'ACTIVITY',
    "imageUrl" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "rating" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "availableSlots" INTEGER NOT NULL DEFAULT 20,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tour_pkey" PRIMARY KEY ("id")
);
