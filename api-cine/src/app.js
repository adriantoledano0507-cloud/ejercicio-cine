import express from "express";
import cors from "cors";
import peliculasRouter from "./routes/peliculas.routes.js";
import directoresRouter from "./routes/directores.routes.js";
import cinesRouter from "./routes/cines.routes.js";
import { logger } from "./middleware/logger.js";

const app = express();
const PRODUCCION = process.env.NODE_ENV === "production";

app.use(express.json());
app.use(logger);

// Configuración de CORS dinámica (admite local o variables de entorno para producción)
const origenes = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://localhost:4173"];

app.use(cors({ origin: origenes }));

// Ruta de salud: sirve para comprobar que el servicio está vivo
app.get("/", (req, res) => {
  res.json({ estado: "ok", servicio: "api-cine" });
});

// Rutas de las entidades de cine
app.use("/api/peliculas", peliculasRouter);
app.use("/api/directores", directoresRouter);
app.use("/api/cines", cinesRouter);

// Manejador de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada"
  });
});

// Manejador de errores global: el detalle va a los LOGS, no al usuario
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: PRODUCCION ? "Error interno del servidor" : err.message,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});