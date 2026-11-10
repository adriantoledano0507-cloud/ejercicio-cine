import { Router } from "express";
import {
  listarDirectores,
  obtenerDirector,
  crearDirector,
  actualizarDirector,
  eliminarDirector
} from "../controllers/directores.controller.js";
import { comprobarApiKey } from "../middleware/apiKey.js";

const router = Router();

router.get("/", listarDirectores);
router.get("/:id", obtenerDirector);
router.post("/", comprobarApiKey, crearDirector);
router.patch("/:id", comprobarApiKey, actualizarDirector);
router.delete("/:id", comprobarApiKey, eliminarDirector);

export default router;