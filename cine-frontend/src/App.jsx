import { useCallback, useEffect, useState } from "react";
import { obtenerPeliculas, crearPelicula, modificarPelicula, eliminarPelicula } from "./services/peliculasApi";
import { obtenerDirectores, crearDirector, modificarDirector, eliminarDirector } from "./services/directoresApi";
import { obtenerCines, crearCine, modificarCine, eliminarCine } from "./services/cinesApi";

import PeliculaItem from "./components/PeliculaItem";
import PeliculaForm from "./components/PeliculaForm";
import DirectorItem from "./components/DirectorItem";
import DirectorForm from "./components/DirectorForm";
import CineItem from "./components/CineItem";
import CineForm from "./components/CineForm";
 
function App() {
  const [peliculas, setPeliculas] = useState([]);
  const [directores, setDirectores] = useState([]);
  const [cines, setCines] = useState([]);
  
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");
  
  // Estado específico para los avisos de acciones (crear, modificar, eliminar)
  const [aviso, setAviso] = useState(null); // { tipo: "ok" | "error", texto }

  // --- ESTADO PARA LA API KEY (con inicializador perezoso) ---
  const [apiKey, setApiKey] = useState(
    () => sessionStorage.getItem("apiKey") ?? ""
  );
 
  const cargarDatos = useCallback(async () => {
    try {
      setErrorCarga("");
      const [resPeliculas, resDirectores, resCines] = await Promise.all([
        obtenerPeliculas(),
        obtenerDirectores(),
        obtenerCines()
      ]);
      setPeliculas(resPeliculas);
      setDirectores(resDirectores);
      setCines(resCines);
    } catch (err) {
      setErrorCarga(err.message);
    }
  }, []);
 
  useEffect(() => {
    cargarDatos().finally(() => setCargando(false));
  }, [cargarDatos]);
 
  function reintentar() {
    setCargando(true);
    cargarDatos().finally(() => setCargando(false));
  }

  function mostrarAviso(tipo, texto) {
    setAviso({ tipo, texto });
  }

  // --- FUNCIÓN PARA GUARDAR LA API KEY EN SESSIONSTORAGE ---
  function guardarApiKey() {
    sessionStorage.setItem("apiKey", apiKey);
    mostrarAviso("ok", "Clave guardada durante la sesión");
  }

  // --- MANEJADORES DE PELÍCULAS ---
  async function manejarCrearPelicula(datos) {
    try {
      const nueva = await crearPelicula(datos);
      setPeliculas((actuales) => [...actuales, nueva]);
      mostrarAviso("ok", "Película creada correctamente");
      return true;
    } catch (err) {
      mostrarAviso("error", err.message);
      return false;
    }
  }

  async function manejarEliminarPelicula(id) {
    if (!confirm("¿Estás seguro de eliminar esta película?")) return;
    try {
      await eliminarPelicula(id);
      setPeliculas((actuales) => actuales.filter((p) => p.id !== id));
      mostrarAviso("ok", "Película eliminada");
    } catch (err) {
      mostrarAviso("error", err.message);
    }
  }

  async function manejarModificarPelicula(pelicula) {
    const nuevoTitulo = prompt("Introduce el nuevo título para la película:", pelicula.titulo);
    if (!nuevoTitulo || nuevoTitulo.trim() === "") return;

    const cambios = { titulo: nuevoTitulo.trim() };
    try {
      const actualizada = await modificarPelicula(pelicula.id, cambios);
      setPeliculas((actuales) =>
        actuales.map((p) =>
          p.id === pelicula.id ? { ...p, ...cambios, ...actualizada } : p
        )
      );
      mostrarAviso("ok", "Película actualizada correctamente");
    } catch (err) {
      mostrarAviso("error", err.message);
    }
  }

  // --- MANEJADORES DE DIRECTORES ---
  async function manejarCrearDirector(datos) {
    try {
      const nuevo = await crearDirector(datos);
      setDirectores((actuales) => [...actuales, nuevo]);
      mostrarAviso("ok", "Director creado correctamente");
      return true;
    } catch (err) {
      mostrarAviso("error", err.message);
      return false;
    }
  }

  async function manejarEliminarDirector(id) {
    if (!confirm("¿Estás seguro de eliminar este director?")) return;
    try {
      await eliminarDirector(id);
      setDirectores((actuales) => actuales.filter((d) => d.id !== id));
      mostrarAviso("ok", "Director eliminado");
    } catch (err) {
      mostrarAviso("error", err.message);
    }
  }

  async function manejarModificarDirector(director) {
    const nuevoNombre = prompt("Introduce el nuevo nombre para el director:", director.nombre);
    if (!nuevoNombre || nuevoNombre.trim() === "") return;

    const cambios = { nombre: nuevoNombre.trim() };
    try {
      const actualizado = await modificarDirector(director.id, cambios);
      setDirectores((actuales) =>
        actuales.map((d) =>
          d.id === director.id ? { ...d, ...cambios, ...actualizado } : d
        )
      );
      mostrarAviso("ok", "Director actualizado correctamente");
    } catch (err) {
      mostrarAviso("error", err.message);
    }
  }

  // --- MANEJADORES DE CINES ---
  async function manejarCrearCine(datos) {
    try {
      const nuevo = await crearCine(datos);
      setCines((actuales) => [...actuales, nuevo]);
      mostrarAviso("ok", "Cine creado correctamente");
      return true;
    } catch (err) {
      mostrarAviso("error", err.message);
      return false;
    }
  }

  async function manejarEliminarCine(id) {
    if (!confirm("¿Estás seguro de eliminar este cine?")) return;
    try {
      await eliminarCine(id);
      setCines((actuales) => actuales.filter((c) => c.id !== id));
      mostrarAviso("ok", "Cine eliminado");
    } catch (err) {
      mostrarAviso("error", err.message);
    }
  }

  async function manejarModificarCine(cine) {
    const nuevoNombre = prompt("Introduce el nuevo nombre para el cine:", cine.nombre);
    if (!nuevoNombre || nuevoNombre.trim() === "") return;

    const cambios = { nombre: nuevoNombre.trim() };
    try {
      const actualizado = await modificarCine(cine.id, cambios);
      setCines((actuales) =>
        actuales.map((c) =>
          c.id === cine.id ? { ...c, ...cambios, ...actualizado } : c
        )
      );
      mostrarAviso("ok", "Cine actualizado correctamente");
    } catch (err) {
      mostrarAviso("error", err.message);
    }
  }
 
  return (
    <main>
      <h1>Gestor de Cine</h1>
      
      {/* SECCIÓN DE ACCESO A OPERACIONES PROTEGIDAS */}
      <section>
        <h2>Acceso a operaciones protegidas</h2>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="API key"
        />
        <button onClick={guardarApiKey}>Guardar durante la sesión</button>
      </section>
      
      {/* Aviso global para acciones de éxito o error */}
      {aviso && (
        <p className={`aviso aviso-${aviso.tipo}`} role="status">
          {aviso.texto}
        </p>
      )}

      {cargando && <p>Cargando información...</p>}
      
      {!cargando && errorCarga && (
        <div role="alert">
          <p>{errorCarga}</p>
          <button onClick={reintentar}>Reintentar</button>
        </div>
      )}
      
      {!cargando && !errorCarga && (
        <div>
          {/* SECCIÓN DE PELÍCULAS */}
          <section>
            <h2>Películas</h2>
            <PeliculaForm 
              directores={directores} 
              cines={cines} 
              onCrear={manejarCrearPelicula} 
            />
            
            {peliculas.length === 0 && <p>No hay películas.</p>}
            {peliculas.map((pelicula) => (
              <PeliculaItem
                key={pelicula.id}
                pelicula={pelicula}
                onModificar={manejarModificarPelicula}
                onEliminar={manejarEliminarPelicula}
              />
            ))}
          </section>
          
          <hr />

          {/* SECCIÓN DE DIRECTORES */}
          <section>
            <h2>Directores</h2>
            <DirectorForm onCrear={manejarCrearDirector} />
            {directores.length === 0 && <p>No hay directores.</p>}
            {directores.map((director) => (
              <DirectorItem
                key={director.id}
                director={director}
                onModificar={manejarModificarDirector}
                onEliminar={manejarEliminarDirector}
              />
            ))}
          </section>

          <hr />

          {/* SECCIÓN DE CINES */}
          <section>
            <h2>Cines</h2>
            <CineForm onCrear={manejarCrearCine} />
            {cines.length === 0 && <p>No hay cines.</p>}
            {cines.map((cine) => (
              <CineItem
                key={cine.id}
                cine={cine}
                onModificar={manejarModificarCine}
                onEliminar={manejarEliminarCine}
              />
            ))}
          </section>
        </div>
      )}
    </main>
  );
}
 
export default App;

