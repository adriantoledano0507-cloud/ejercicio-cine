import { useState } from "react";

function DirectorForm({ onCrear }) {
  const [nombre, setNombre] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function manejarSubmit(evento) {
    evento.preventDefault();
    setEnviando(true);
    const creado = await onCrear({ 
      nombre: nombre.trim(), 
      nacionalidad: nacionalidad.trim() 
    });
    setEnviando(false);
    if (creado) {
      setNombre("");
      setNacionalidad("");
    }
  }

  return (
    <form onSubmit={manejarSubmit}>
      <h2>Nuevo director</h2>
      <label>
        Nombre
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          minLength={2}
        />
      </label>
      <label>
        Nacionalidad
        <input
          value={nacionalidad}
          onChange={(e) => setNacionalidad(e.target.value)}
        />
      </label>
      <button type="submit" disabled={enviando}>
        {enviando ? "Creando..." : "Crear director"}
      </button>
    </form>
  );
}

export default DirectorForm;