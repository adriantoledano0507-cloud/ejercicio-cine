import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// El adaptador recibe un objeto con la URL de la base de datos
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db"
});

const prisma = new PrismaClient({ adapter });

export default prisma;