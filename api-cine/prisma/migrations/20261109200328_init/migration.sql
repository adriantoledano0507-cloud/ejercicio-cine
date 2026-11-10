-- CreateTable
CREATE TABLE "Pelicula" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "categoria" TEXT,
    "directorId" INTEGER NOT NULL,
    CONSTRAINT "Pelicula_directorId_fkey" FOREIGN KEY ("directorId") REFERENCES "Director" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Director" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Cine" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CineToPelicula" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CineToPelicula_A_fkey" FOREIGN KEY ("A") REFERENCES "Cine" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CineToPelicula_B_fkey" FOREIGN KEY ("B") REFERENCES "Pelicula" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_CineToPelicula_AB_unique" ON "_CineToPelicula"("A", "B");

-- CreateIndex
CREATE INDEX "_CineToPelicula_B_index" ON "_CineToPelicula"("B");
