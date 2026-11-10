import prisma from "../lib/prisma.js";

export async function listarCines(req, res) {
  try {
    const cines = await prisma.cine.findMany({
      orderBy: { id: "asc" },
      include: {
        peliculas: true
      }
    });
    res.json(cines);
  } catch (error) {
    res.status(500).json({ error: "No se pudieron obtener los cines" });
  }
}

export async function obtenerCine(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "El id debe ser un numero entero" });
    }

    const cine = await prisma.cine.findUnique({
      where: { id },
      include: {
        peliculas: true
      }
    });

    if (!cine) {
      return res.status(404).json({ error: "Cine no encontrado" });
    }

    res.json(cine);
  } catch (error) {
    res.status(500).json({ error: "No se pudo obtener el cine" });
  }
}

export async function crearCine(req, res) {
  try {
    const { nombre, peliculasIds } = req.body;

    if (!nombre || typeof nombre !== "string" || nombre.trim().length < 2) {
      return res.status(400).json({ error: "El nombre es obligatorio y debe tener al menos 2 caracteres" });
    }

    const cine = await prisma.cine.create({
      data: {
        nombre: nombre.trim(),
        // Permite opcionalmente asociar películas al crear el cine mediante un array de IDs (ej: [1, 2])
        peliculas: peliculasIds && Array.isArray(peliculasIds) ? {
          connect: peliculasIds.map(peliculaId => ({ id: Number(peliculaId) }))
        } : undefined
      },
      include: {
        peliculas: true
      }
    });

    res.status(201).json(cine);
  } catch (error) {
    res.status(500).json({ error: "No se pudo crear el cine" });
  }
}

export async function actualizarCine(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "El id debe ser un numero entero" });
    }

    const existente = await prisma.cine.findUnique({
      where: { id }
    });

    if (!existente) {
      return res.status(404).json({ error: "Cine no encontrado" });
    }

    const { nombre, peliculasIds } = req.body;
    const datos = {};

    if (nombre !== undefined) {
      if (typeof nombre !== "string" || nombre.trim().length < 2) {
        return res.status(400).json({
          error: "El nombre debe tener al menos 2 caracteres"
        });
      }
      datos.nombre = nombre.trim();
    }

    // Actualización de la relación muchos a muchos con Películas si se proporciona
    if (peliculasIds !== undefined) {
      if (!Array.isArray(peliculasIds)) {
        return res.status(400).json({ error: "peliculasIds debe ser un array de IDs" });
      }
      datos.peliculas = {
        set: peliculasIds.map(peliculaId => ({ id: Number(peliculaId) }))
      };
    }

    const cine = await prisma.cine.update({
      where: { id },
      data: datos,
      include: {
        peliculas: true
      }
    });

    res.json(cine);
  } catch (error) {
    res.status(500).json({ error: "No se pudo actualizar el cine" });
  }
}

export async function eliminarCine(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "El id debe ser un numero entero" });
    }

    const existente = await prisma.cine.findUnique({
      where: { id }
    });

    if (!existente) {
      return res.status(404).json({ error: "Cine no encontrado" });
    }

    await prisma.cine.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "No se pudo eliminar el cine" });
  }
}