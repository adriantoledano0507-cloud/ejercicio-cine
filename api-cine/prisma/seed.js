import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Crear un director de ejemplo
  const director = await prisma.director.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nombre: "Christopher Nolan",
      nacionalidad: "Británico",
    },
  });

  // 2. Crear un cine de ejemplo
  const cine = await prisma.cine.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nombre: "Cinesa Diagonal",
      ciudad: "Barcelona",
    },
  });

  // 3. Crear una película de ejemplo (ajusta los campos según tu schema.prisma si es necesario)
  await prisma.pelicula.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      titulo: "Origen (Inception)",
      duracion: 148,
      directorId: director.id,
    },
  });

  console.log("¡Semilla ejecutada correctamente con datos de cine!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });