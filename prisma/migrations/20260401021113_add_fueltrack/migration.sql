-- CreateTable
CREATE TABLE "fueltrack_days" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "pfc_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "post_meal_walks" INTEGER NOT NULL DEFAULT 0,
    "fasted_walk" BOOLEAN NOT NULL DEFAULT false,
    "insulin_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "overall_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fueltrack_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "walk_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "duration_min" INTEGER NOT NULL,
    "steps" INTEGER,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "meal_type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "walk_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fueltrack_days_user_id_date_key" ON "fueltrack_days"("user_id", "date");

-- CreateIndex
CREATE INDEX "walk_logs_user_id_date_idx" ON "walk_logs"("user_id", "date");

-- AddForeignKey
ALTER TABLE "fueltrack_days" ADD CONSTRAINT "fueltrack_days_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "walk_logs" ADD CONSTRAINT "walk_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
