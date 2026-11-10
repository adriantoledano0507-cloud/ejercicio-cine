import prisma from "../lib/prisma.js";

export async function listarPeliculas(req, res) {
  try {
    const peliculas = await prisma.pelicula.findMany({
      orderBy: { id: "asc" },
      include: {
        director: true,
        cines: true
      }
    });
    res.json(peliculas);
  } catch (error) {
    // 🔍 Esto imprimirá el error real en tu terminal de Node
    console.error("ERROR DETALLADO EN PRISMA:", error);
    
    res.status(500).json({ error: "No se pudieron obtener las películas" });
  }
}

export async function obtenerPelicula(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "El id debe ser un numero entero" });
    }

    const pelicula = await prisma.pelicula.findUnique({
      where: { id },
      include: {
        director: true,
        cines: true
      }
    });

    if (!pelicula) {
      return res.status(404).json({ error: "Película no encontrada" });
    }

    res.json(pelicula);
  } catch (error) {
    res.status(500).json({ error: "No se pudo obtener la película" });
  }
}

export async function crearPelicula(req, res) {
  try {
    const { titulo, categoria, directorId, cinesIds } = req.body;

    if (!titulo || typeof titulo !== "string" || titulo.trim().length < 2) {
      return res.status(400).json({ error: "El título es obligatorio y debe tener al menos 2 caracteres" });
    }

    const parsedDirectorId = Number(directorId);
    if (!Number.isInteger(parsedDirectorId)) {
      return res.status(400).json({ error: "El directorId debe ser un número entero válido" });
    }

    // Verificar que el director exista
    const directorExistente = await prisma.director.findUnique({
      where: { id: parsedDirectorId }
    });

    if (!directorExistente) {
      return res.status(404).json({ error: "El director especificado no existe" });
    }

    const pelicula = await prisma.pelicula.create({
      data: {
        titulo: titulo.trim(),
        categoria: categoria?.trim() || null,
        directorId: parsedDirectorId,
        // Si mandas un array de IDs de cines (ej: [1, 2]), los conectamos
        cines: cinesIds && Array.isArray(cinesIds) ? {
          connect: cinesIds.map(cineId => ({ id: Number(cineId) }))
        } : undefined
      },
      include: {
        director: true,
        cines: true
      }
    });

    res.status(201).json(pelicula);
  } catch (error) {
    res.status(500).json({ error: "No se pudo crear la película" });
  }
}

export async function actualizarPelicula(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "El id debe ser un numero entero" });
    }

    const existente = await prisma.pelicula.findUnique({
      where: { id }
    });

    if (!existente) {
      return res.status(404).json({ error: "Película no encontrada" });
    }

    const { titulo, categoria, directorId, cinesIds } = req.body;
    const datos = {};

    if (titulo !== undefined) {
      if (typeof titulo !== "string" || titulo.trim().length < 2) {
        return res.status(400).json({
          error: "El título debe tener al menos 2 caracteres"
        });
      }
      datos.titulo = titulo.trim();
    }

    if (categoria !== undefined) {
      datos.categoria =
        typeof categoria === "string" && categoria.trim()
          ? categoria.trim()
          : null;
    }

    if (directorId !== undefined) {
      const parsedDirectorId = Number(directorId);
      if (!Number.isInteger(parsedDirectorId)) {
        return res.status(400).json({ error: "El directorId debe ser un número entero" });
      }

      const directorExistente = await prisma.director.findUnique({
        where: { id: parsedDirectorId }
      });

      if (!directorExistente) {
        return res.status(404).json({ error: "El director especificado no existe" });
      }

      datos.directorId = parsedDirectorId;
    }

    // Actualización de la relación muchos a muchos con Cines si se proporciona
    if (cinesIds !== undefined) {
      if (!Array.isArray(cinesIds)) {
        return res.status(400).json({ error: "cinesIds debe ser un array de IDs" });
      }
      datos.cines = {
        set: cinesIds.map(cineId => ({ id: Number(cineId) }))
      };
    }

    const pelicula = await prisma.pelicula.update({
      where: { id },
      data: datos,
      include: {
        director: true,
        cines: true
      }
    });

    res.json(pelicula);
  } catch (error) {
    res.status(500).json({ error: "No se pudo actualizar la película" });
  }
}

export async function eliminarPelicula(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "El id debe ser un numero entero" });
    }

    const existente = await prisma.pelicula.findUnique({
      where: { id }
    });

    if (!existente) {
      return res.status(404).json({ error: "Película no encontrada" });
    }

    await prisma.pelicula.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "No se pudo eliminar la película" });
  }
}