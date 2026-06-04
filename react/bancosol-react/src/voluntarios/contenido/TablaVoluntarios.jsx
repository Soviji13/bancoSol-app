import { useState } from "react";
import { PopoverAsignaciones } from "../usosVarios/PopoverAsignaciones";

//popover == desplegable

export function TablaVoluntarios({
  voluntarios,
  filaSeleccionada,
  setFilaSeleccionada,
}) {
  //guardamos q popover esta abierto
  const [popoverAbierto, setPopoverAbierto] = useState(null);

  //si abres uno se cierra el otro automaticamente
  const togglePopover = (id, e) => {
    e.stopPropagation(); //IMPORTANTE!!!:para q no se seleccione la fila entera al abrir el desplegable
    setPopoverAbierto(popoverAbierto === id ? null : id);
  };

  return (
    <table className="voluntarios-tabla">
      <thead>
        <tr>
          <th>ID</th>
          <th>Responsable</th>
          <th>Pertenecen a</th>
          <th className="col-tiendas-turnos">Tiendas y Turnos</th>
        </tr>
      </thead>
      <tbody>
        {voluntarios.length === 0 ? (
          <tr>
            <td colSpan="4">No hay voluntarios asignados en esta campaña.</td>
          </tr>
        ) : (
          voluntarios.map((vol) => (
            <tr
              key={vol.id}
              className={filaSeleccionada === vol.id ? "fila-seleccionada" : ""}
              onClick={() => setFilaSeleccionada(vol.id)}
              onDoubleClick={() => console.log("Abrir detalle de:", vol.id)}
            >
              <td>{vol.id}</td>
              <td>{vol.responsableEntidad}</td>
              <td>{vol.perteneceA}</td>
              <td className="celda-asignaciones">
                {vol.asignaciones.length === 0 ? (
                  <span className="texto-sin-asignaciones">
                    Sin asignaciones
                  </span>
                ) : (
                  <>
                    <button
                      className="btn-desplegar-asignaciones"
                      onClick={(e) => togglePopover(vol.id, e)}
                    >
                      <span>{vol.asignaciones.length} Tienda/s asignadas</span>
                      <span>{popoverAbierto === vol.id ? "▴" : "▾"}</span>
                    </button>

                    {popoverAbierto === vol.id && (
                      <PopoverAsignaciones asignaciones={vol.asignaciones} />
                    )}
                  </>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
