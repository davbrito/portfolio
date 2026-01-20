-- CreateTable
CREATE TABLE "Proyects" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT,
    "repoUrl" TEXT,
    "image" TEXT,
    "imageAlt" TEXT,
    "tags" TEXT[],

    CONSTRAINT "Proyects_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Proyects" ADD CONSTRAINT "Proyects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
