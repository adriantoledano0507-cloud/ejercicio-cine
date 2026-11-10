function CineItem({ cine, onModificar, onEliminar }) {
  return (
    <article>
      <h3>{cine.nombre}</h3>
      {cine.ciudad && <p>Ciudad: {cine.ciudad}</p>}
      
      <button onClick={() => onModificar(cine)}>Editar</button>
      <button onClick={() => onEliminar(cine.id)}>Eliminar</button>
    </article>
  );
}

export default CineItem;