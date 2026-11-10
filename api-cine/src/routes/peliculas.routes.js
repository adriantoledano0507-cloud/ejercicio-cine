import { Router } from "express";
import {
  listarPeliculas,
  obtenerPelicula,
  crearPelicula,
  actualizarPelicula,
  eliminarPelicula
} from "../controllers/peliculas.controller.js";
import { comprobarApiKey } from "../middleware/apiKey.js";

const router = Router();

router.get("/", listarPeliculas);
router.get("/:id", obtenerPelicula);
router.post("/", comprobarApiKey, crearPelicula);
router.patch("/:id", comprobarApiKey, actualizarPelicula);
router.delete("/:id", comprobarApiKey, eliminarPelicula);

export default router;