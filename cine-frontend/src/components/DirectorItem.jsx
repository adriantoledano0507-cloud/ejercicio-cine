function DirectorItem({ director, onModificar, onEliminar }) {
  return (
    <article>
      <h3>{director.nombre}</h3>
      {director.nacionalidad && <p>Nacionalidad: {director.nacionalidad}</p>}
      
      <button onClick={() => onModificar(director)}>Editar</button>
      <button onClick={() => onEliminar(director.id)}>Eliminar</button>
    </article>
  );
}

export default DirectorItem;