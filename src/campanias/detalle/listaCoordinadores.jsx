export function ListaCoordinadores({
  coordinadores,
  idsSeleccionadosSet,
  modoGestionarCoordinadores,
  guardando,
  onAlternarCoordinador,
}) {
  if (coordinadores.length === 0) {
    return (
      <div className="detalle-campania__lista-coordinadores">
        <p className="detalle-campania__grupo-vacio">
          No hay coordinadores registrados.
        </p>
      </div>
    );
  }

  return (
    <div className="detalle-campania__lista-coordinadores">
      {coordinadores.map((coordinador) => {
        const participa = idsSeleccionadosSet.has(String(coordinador.id));

        return (
          <button
            key={coordinador.id}
            type="button"
            className={
              participa
                ? "detalle-campania__coordinador detalle-campania__coordinador--participa"
                : "detalle-campania__coordinador detalle-campania__coordinador--no-participa"
            }
            onClick={() => onAlternarCoordinador(coordinador.id)}
            disabled={!modoGestionarCoordinadores || guardando}
          >
            <span>{coordinador.nombre}</span>
            <small>{participa ? "Participa" : "No participa"}</small>
          </button>
        );
      })}
    </div>
  );
}
