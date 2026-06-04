import "./usosVarios.css";

export function PopoverAsignaciones({ asignaciones }) {
  return (
    <div className="popover-contenido">
      {asignaciones.map((asig, index) => (
        <div key={asig.tiendaId} className="popover-grupo">
          <div className="popover-tienda-titulo">{asig.tiendaNombre}</div>
          <ul className="popover-turnos-lista">
            {asig.turnos.map((turno) => (
              <li key={turno.turnoId}>
                {turno.dia}{" "}
                <span className="texto-franja-horaria">
                  ({turno.franjaHoraria})
                </span>
              </li>
            ))}
          </ul>
          {/*pintamos la linea solo si NO es ultima tienda */}
          {index < asignaciones.length - 1 && (
            <hr className="popover-separador" />
          )}
        </div>
      ))}
    </div>
  );
}
