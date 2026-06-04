import { useEffect, useState } from "react";
import { mockVoluntarios } from "../mockDataVoluntarios";
import "./voluntarioLateral.css";

export function DetalleVoluntario({ manejaContenidoLateral }) {
  const [voluntario, setVoluntario] = useState(null);

  // sacamos la logica de busqueda a una funcion normal
  const cargarVoluntarioDesdeMemoria = () => {
    const idSeleccionado = localStorage.getItem("voluntarioSeleccionadoId");
    if (idSeleccionado) {
      const vol = mockVoluntarios.find((v) => v.id === idSeleccionado);
      setVoluntario(vol);
    }
  };

  //necesitamos usar un evento global como en js, sucede lo mismo los componentes del contenido y
  //el menu lateral no tienen relacin directa por lo que meter eventos es lo menos engorroso !!!!!!!!

  useEffect(() => {
    //carga el voluntario la primera vez q se abre el panel
    cargarVoluntarioDesdeMemoria();

    //escucha el evento global de la tabla para cuando cambie el vol seleccionado
    window.addEventListener(
      "cambioVoluntarioTabla",
      cargarVoluntarioDesdeMemoria,
    );

    //si cerramos panel deja de escuchar
    return () => {
      window.removeEventListener(
        "cambioVoluntarioTabla",
        cargarVoluntarioDesdeMemoria,
      );
    };
  }, []); //dependencias vacias porq los eventos del window ya hacen el trabajo dinamico

  const cerrarPanel = () => {
    localStorage.removeItem("voluntarioSeleccionadoId");
    manejaContenidoLateral("menuLateral");
    window.dispatchEvent(new Event("cierrePanelDetalle"));
  };

  if (!voluntario)
    return <div className="panel-detalle-cargando">Cargando...</div>;

  const esMalagaCapital =
    voluntario.localidad?.toUpperCase() === "MÁLAGA CAPITAL";

  return (
    <aside className="panel-detalle-lateral">
      <header className="panel-lateral-header">
        <div className="panel-lateral-info">
          <h2 className="panel-lateral-titulo">
            Voluntario ID: {voluntario.id}
          </h2>
          <p className="panel-lateral-subtitulo">Información detallada</p>
        </div>
        <div className="panel-lateral-acciones">
          <button
            className="btn-cerrar-lateral"
            onClick={cerrarPanel}
            type="button"
          >
            X
          </button>
        </div>
      </header>

      <div className="panel-detalle-contenido">
        <div className="detalle-bloque">
          <span className="texto-azul">Entidad colaboradora:</span>{" "}
          {voluntario.perteneceA}
        </div>

        <div className="detalle-bloque">
          <div>
            <span className="texto-azul">Responsable:</span>{" "}
            {voluntario.responsableEntidad}
          </div>
          <div className="detalle-grupo-filas">
            <div>
              <span className="texto-azul">Teléfono:</span>{" "}
              {voluntario.telefono}
            </div>
            <div>
              <span className="texto-azul">Email:</span> {voluntario.email}
            </div>
          </div>
        </div>

        <div className="detalle-bloque">
          <div className="detalle-grupo-filas">
            <div>
              <span className="texto-azul">Localidad:</span>{" "}
              {voluntario.localidad}
            </div>
            <div>
              <span className="texto-azul">Domicilio:</span>{" "}
              {voluntario.domicilio}
            </div>
            {esMalagaCapital && voluntario.distrito && (
              <div>
                <span className="texto-azul">Distrito:</span>{" "}
                {voluntario.distrito}
              </div>
            )}
          </div>
        </div>

        <div className="detalle-bloque">
          <span className="texto-azul">Turnos asignados:</span>
          <div className="contenedor-tablas-turnos">
            {voluntario.asignaciones.length > 0 ? (
              voluntario.asignaciones.map((asig) => (
                <div key={asig.tiendaId} className="grupo-tienda-turnos">
                  <div className="titulo-tienda-turnos">
                    Tienda: {asig.tiendaNombre}
                  </div>
                  <table className="tabla-turnos-detalle">
                    <tbody>
                      {asig.turnos.map((turno) => (
                        <tr key={turno.turnoId}>
                          <td className="celda-dia texto-azul">{turno.dia}</td>
                          <td className="celda-franja">
                            {turno.franjaHoraria}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))
            ) : (
              <div className="texto-sin-turnos">Sin turnos asignados</div>
            )}
          </div>
        </div>

        <div className="detalle-bloque bloque-observaciones">
          <span className="texto-azul">Observaciones:</span>
          <div className="caja-observaciones">
            {voluntario.observaciones || "Sin observaciones."}
          </div>
        </div>
      </div>
    </aside>
  );
}
