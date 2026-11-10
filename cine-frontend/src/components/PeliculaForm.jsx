import { useState } from "react";

function PeliculaForm({ directores, cines, onCrear }) {
  const [titulo, setTitulo] = useState("");
  const [anio, setAnio] = useState("");
  const [directorId, setDirectorId] = useState("");
  const [cineId, setCineId] = useState(""); // Opcional si tu modelo lo requiere
  const [enviando, setEnviando] = useState(false);

  async function manejarSubmit(evento) {
    evento.preventDefault();
    setEnviando(true);

    // Preparamos el objeto con los tipos de datos correctos para la API (Ids como números o strings según tu backend)
    const datosPelicula = {
      titulo: titulo.trim(),
      anio: anio ? parseInt(anio, 10) : undefined,
      directorId: directorId ? parseInt(directorId, 10) : undefined,
      // cineId: cineId ? parseInt(cineId, 10) : undefined, // Descomenta si tu BD vincula película con cine directamente
    };

    const creada = await onCrear(datosPelicula);
    setEnviando(false);
    
    if (creada) {
      setTitulo("");
      setAnio("");
      setDirectorId("");
      setCineId("");
    }
  }

  return (
    <form onSubmit={manejarSubmit}>
      <h2>Nueva película</h2>
      <label>
        Título
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          minLength={2}
        />
      </label>

      <label>
        Año
        <input
          type="number"
          value={anio}
          onChange={(e) => setAnio(e.target.value)}
        />
      </label>

      {/* Selector de Director obligatorio para que no dé error de relación */}
      <label>
        Director
        <select
          value={directorId}
          onChange={(e) => setDirectorId(e.target.value)}
          required
        >
          <option value="">-- Selecciona un director --</option>
          {directores.map((dir) => (
            <option key={dir.id} value={dir.id}>
              {dir.nombre}
            </option>
          ))}
        </select>
      </label>

      <button type="submit" disabled={enviando}>
        {enviando ? "Creando..." : "Crear película"}
      </button>
    </form>
  );
}

export default PeliculaForm;