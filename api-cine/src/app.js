import express from "express";
import peliculasRouter from "./routes/peliculas.routes.js";
import directoresRouter from "./routes/directores.routes.js";
import cinesRouter from "./routes/cines.routes.js";
import { logger } from "./middleware/logger.js";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(logger);

app.use(
  cors({ origin: ["http://localhost:5173", "http://localhost:4173"] })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    nombre: "API de Cine",
    estado: "funcionando"
  });
});

app.use("/api/peliculas", peliculasRouter);
app.use("/api/directores", directoresRouter);
app.use("/api/cines", cinesRouter);

app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada"
  });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});