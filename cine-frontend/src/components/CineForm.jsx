import { useState } from "react";

function CineForm({ onCrear }) {
  const [nombre, setNombre] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function manejarSubmit(evento) {
    evento.preventDefault();
    setEnviando(true);
    const creado = await onCrear({ 
      nombre: nombre.trim(), 
      ciudad: ciudad.trim() 
    });
    setEnviando(false);
    if (creado) {
      setNombre("");
      setCiudad("");
    }
  }

  return (
    <form onSubmit={manejarSubmit}>
      <h2>Nuevo cine</h2>
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
        Ciudad
        <input
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
        />
      </label>
      <button type="submit" disabled={enviando}>
        {enviando ? "Creando..." : "Crear cine"}
      </button>
    </form>
  );
}

export default CineForm;