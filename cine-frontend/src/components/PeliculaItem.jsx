function PeliculaItem({ pelicula, onModificar, onEliminar }) {
  return (
    <article>
      <h3>{pelicula.titulo}</h3>
      {pelicula.anio && <p>Año: {pelicula.anio}</p>}
      {pelicula.director && <p>Director: {pelicula.director.nombre}</p>}
      
      <button onClick={() => onModificar(pelicula)}>Editar</button>
      <button onClick={() => onEliminar(pelicula.id)}>Eliminar</button>
    </article>
  );
}

export default PeliculaItem;