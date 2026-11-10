export function validarPelicula(req, res, next) {
  const { titulo, directorId, categoria } = req.body;

  // 1. Validar el título (Obligatorio, string, mínimo 3 caracteres)
  if (!titulo || typeof titulo !== "string" || titulo.trim().length < 3) {
    return res.status(400).json({
      error: "El título es obligatorio y debe tener al menos 3 caracteres."
    });
  }

  // 2. Validar el directorId (Obligatorio por esquema Prisma, debe ser un número entero)
  if (directorId === undefined || typeof directorId !== "number" || !Number.isInteger(directorId)) {
    return res.status(400).json({
      error: "El directorId es obligatorio y debe ser un número entero válido."
    });
  }

  // 3. Validar la categoría (Opcional, pero si se envía debe ser un string válido)
  if (categoria !== undefined && (typeof categoria !== "string" || categoria.trim().length === 0)) {
    return res.status(400).json({
      error: "La categoría debe ser un texto válido."
    });
  }

  next();
}