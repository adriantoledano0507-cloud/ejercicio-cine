import { Router } from "express";
import {
  listarCines,
  obtenerCine,
  crearCine,
  actualizarCine,
  eliminarCine
} from "../controllers/cines.controller.js";
import { comprobarApiKey } from "../middleware/apiKey.js";

const router = Router();

router.get("/", listarCines);
router.get("/:id", obtenerCine);
router.post("/", comprobarApiKey, crearCine);
router.patch("/:id", comprobarApiKey, actualizarCine);
router.delete("/:id", comprobarApiKey, eliminarCine);

export default router;