import prisma from "../lib/prisma.js";

export async function listarDirectores(req, res) {
  try {
    const directores = await prisma.director.findMany({
      orderBy: { id: "asc" },
      include: {
        peliculas: true
      }
    });
    res.json(directores);
  } catch (error) {
    res.status(500).json({ error: "No se pudieron obtener los directores" });
  }
}

export async function obtenerDirector(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "El id debe ser un numero entero" });
    }

    const director = await prisma.director.findUnique({
      where: { id },
      include: {
        peliculas: true
      }
    });

    if (!director) {
      return res.status(404).json({ error: "Director no encontrado" });
    }

    res.json(director);
  } catch (error) {
    res.status(500).json({ error: "No se pudo obtener el director" });
  }
}

export async function crearDirector(req, res) {
  try {
    const { nombre } = req.body;

    if (!nombre || typeof nombre !== "string" || nombre.trim().length < 2) {
      return res.status(400).json({ error: "El nombre es obligatorio y debe tener al menos 2 caracteres" });
    }

    const director = await prisma.director.create({
      data: {
        nombre: nombre.trim()
      },
      include: {
        peliculas: true
      }
    });

    res.status(201).json(director);
  } catch (error) {
    res.status(500).json({ error: "No se pudo crear el director" });
  }
}

export async function actualizarDirector(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "El id debe ser un numero entero" });
    }

    const existente = await prisma.director.findUnique({
      where: { id }
    });

    if (!existente) {
      return res.status(404).json({ error: "Director no encontrado" });
    }

    const { nombre } = req.body;
    const datos = {};

    if (nombre !== undefined) {
      if (typeof nombre !== "string" || nombre.trim().length < 2) {
        return res.status(400).json({
          error: "El nombre debe tener al menos 2 caracteres"
        });
      }
      datos.nombre = nombre.trim();
    }

    const director = await prisma.director.update({
      where: { id },
      data: datos,
      include: {
        peliculas: true
      }
    });

    res.json(director);
  } catch (error) {
    res.status(500).json({ error: "No se pudo actualizar el director" });
  }
}

export async function eliminarDirector(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "El id debe ser un numero entero" });
    }

    const existente = await prisma.director.findUnique({
      where: { id },
      include: { peliculas: true }
    });

    if (!existente) {
      return res.status(404).json({ error: "Director no encontrado" });
    }

    // Opcional: Validar si tiene películas asociadas antes de eliminar
    if (existente.peliculas.length > 0) {
      return res.status(400).json({ 
        error: "No se puede eliminar el director porque tiene películas asociadas" 
      });
    }

    await prisma.director.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "No se pudo eliminar el director" });
  }
}