export function GrupoCadenas({
  titulo,
  cadenas,
  modoAsignarCadenas,
  idsSeleccionadosSet,
  guardando,
  onAlternarCadena,
}) {
  return (
    <section className="detalle-campania__grupo-cadenas">
      <h3 className="detalle-campania__grupo-titulo">{titulo}</h3>

      <div className="detalle-campania__lista-cadenas">
        {cadenas.length === 0 ? (
          <p className="detalle-campania__grupo-vacio">
            No hay cadenas en este grupo.
          </p>
        ) : (
          cadenas.map((cadena) => {
            const seleccionada = idsSeleccionadosSet.has(String(cadena.id));

            return (
              <label
                key={cadena.id}
                className={
                  seleccionada
                    ? "detalle-campania__cadena detalle-campania__cadena--participa"
                    : "detalle-campania__cadena detalle-campania__cadena--no-participa"
                }
              >
                {modoAsignarCadenas && (
                  <input
                    type="checkbox"
                    checked={seleccionada}
                    onChange={() => onAlternarCadena(cadena.id)}
                    disabled={guardando}
                  />
                )}

                <span>{cadena.nombre}</span>
              </label>
            );
          })
        )}
      </div>
    </section>
  );
}
