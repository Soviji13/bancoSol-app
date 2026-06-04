import { useEffect, useState } from "react";
import { mockVoluntarios } from "../mockDataVoluntarios";
import { ModalTurno } from "../usosVarios/ModalTurno";
import "./voluntarioLateral.css";

export function ModificarVoluntario({ manejaContenidoLateral }) {
  const [voluntarioBase, setVoluntarioBase] = useState(null);

  //estados de campos MODIFICABLES
  const [entidad, setEntidad] = useState("");
  const [responsable, setResponsable] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [asignaciones, setAsignaciones] = useState([]);

  //estados modal turnos para controlar apertura y datos nuevos
  const [modalTurnoAbierto, setModalTurnoAbierto] = useState(false);
  const [nuevoTurnoTienda, setNuevoTurnoTienda] = useState("");
  const [nuevoTurnoDia, setNuevoTurnoDia] = useState("");
  const [nuevoTurnoFranja, setNuevoTurnoFranja] = useState("");

  //cargamos datos del voluntario la primera vez q se abre el panel
  useEffect(() => {
    const idSeleccionado = localStorage.getItem("voluntarioSeleccionadoId");
    if (idSeleccionado) {
      const vol = mockVoluntarios.find((v) => v.id === idSeleccionado);
      if (vol) {
        setVoluntarioBase(vol);
        setEntidad(vol.perteneceA);
        setResponsable(vol.responsableEntidad);
        setObservaciones(vol.observaciones || "");
        setAsignaciones(vol.asignaciones || []); //cargamos turnos previos
      }
    }
  }, []);

  const entidadesUnicas = [
    ...new Set(mockVoluntarios.map((v) => v.perteneceA)),
  ];
  const responsablesDisponibles = [
    ...new Set(
      mockVoluntarios
        .filter((v) => v.perteneceA === entidad)
        .map((v) => v.responsableEntidad),
    ),
  ];
  const tiendasUnicas = [
    ...new Set(
      mockVoluntarios.flatMap((v) => v.asignaciones.map((a) => a.tiendaNombre)),
    ),
  ];
  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  if (!voluntarioBase)
    return (
      <div className="panel-detalle-cargando">Cargando modificaciones...</div>
    );

  const handleCambioEntidad = (e) => {
    setEntidad(e.target.value);
    setResponsable(""); //borramos el responsable si cambia la entidad para no liar datos
  };

  const cerrarPanel = () => {
    window.dispatchEvent(new Event("salirModoEdicion")); //avisamos al footer con un evento global
    manejaContenidoLateral("detalle-voluntario"); //volvemos a detalle voluntarios DONDE NO SE EDITA NADA SOLO LECTURA
  };

  //ESTE HAY Q CAMBIARLO PARA CONEXION CON LA API
  const handleGuardarCambios = (e) => {
    e.preventDefault(); //evitamos q recargue la pagina por defecto el submit!!!!
    console.log("Guardando cambios del voluntario ID", voluntarioBase.id, {
      entidad,
      responsable,
      observaciones,
      asignaciones,
    });
    //hay q enviarlo a la api y luego salir
    window.dispatchEvent(new Event("salirModoEdicion")); //avisamos al footer
    manejaContenidoLateral("detalle-voluntario");
  };

  //logica para gestionar los turnos en la tabla
  const handleEliminarTurno = (tiendaId, turnoId) => {
    const nuevasAsignaciones = asignaciones
      .map((asig) => {
        if (asig.tiendaId === tiendaId) {
          return {
            ...asig,
            turnos: asig.turnos.filter((t) => t.turnoId !== turnoId),
          };
        }
        return asig;
      })
      .filter((asig) => asig.turnos.length > 0); //si la tienda se queda sin turnos la borramos entera
    setAsignaciones(nuevasAsignaciones);
  };

  const handleAbrirModalTurno = () => {
    setNuevoTurnoTienda("");
    setNuevoTurnoDia("");
    setNuevoTurnoFranja("");
    setModalTurnoAbierto(true);
  }; //limpiamos datos y abrimos el flotante

  const handleGuardarTurno = () => {
    const franjaFinal = voluntarioBase.horasSueltas
      ? `${voluntarioBase.horaComienzo} - ${voluntarioBase.horaFinal}`
      : nuevoTurnoFranja;

    const nuevoTurno = {
      turnoId: `TEMP_${Date.now()}`, //id temporal hasta q lo haga spring boot
      dia: nuevoTurnoDia,
      franjaHoraria: franjaFinal,
    };

    const nuevasAsignaciones = [...asignaciones];
    const tiendaExistenteIndex = nuevasAsignaciones.findIndex(
      (a) => a.tiendaNombre === nuevoTurnoTienda,
    );

    //si la tienda ya la tenia asignada le metemos turno nuevo, si no creamos tablr para tienda nueva
    if (tiendaExistenteIndex >= 0) {
      nuevasAsignaciones[tiendaExistenteIndex].turnos.push(nuevoTurno);
    } else {
      nuevasAsignaciones.push({
        tiendaId: `TEMP_T_${Date.now()}`,
        tiendaNombre: nuevoTurnoTienda,
        turnos: [nuevoTurno],
      });
    }

    setAsignaciones(nuevasAsignaciones);
    setModalTurnoAbierto(false); //cerramos al terminar
  };

  //validaciones de datos
  const esMalagaCapital =
    voluntarioBase.localidad?.toLowerCase() === "málaga capital";
  const puedeGuardarTurno =
    nuevoTurnoTienda !== "" &&
    nuevoTurnoDia !== "" &&
    (voluntarioBase.horasSueltas || nuevoTurnoFranja !== "");

  return (
    <aside className="panel-detalle-lateral">
      <header className="panel-lateral-header header-edicion">
        <div className="panel-lateral-info">
          <h2 className="panel-lateral-titulo">
            Voluntario ID: {voluntarioBase.id}
          </h2>
          <p className="panel-lateral-subtitulo subtitulo-edicion">
            Modificando datos del voluntario
          </p>
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

      {/* FORMULARIO Q ENVUELVE TODO EL CONTENIDO. IMPORTANTE EL ID PARA ENGANCHARLO CON EL BOTON DEL FOOTER */}
      <form
        id="form-modificar"
        className="panel-detalle-contenido"
        onSubmit={handleGuardarCambios}
      >
        {/*entidad colab (editable)*/}
        <div className="detalle-bloque">
          <div className="campo-editable-bloque">
            <span className="texto-azul">Entidad colaboradora:</span>
            <select
              className="select-caja"
              value={entidad}
              onChange={handleCambioEntidad}
              required
            >
              <option value="" disabled>
                Seleccione entidad...
              </option>
              {entidadesUnicas.map((entidad, id) => (
                <option key={id} value={entidad}>
                  {entidad}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/*responsable (editable)*/}
        <div className="detalle-bloque">
          <div className="campo-editable-bloque mb-medio">
            <span className="texto-azul">Responsable:</span>
            <select
              className="select-caja"
              value={responsable}
              onChange={(e) => setResponsable(e.target.value)}
              disabled={!entidad}
              required
            >
              <option value="" disabled>
                {entidad
                  ? "Seleccione responsable..."
                  : "Elija entidad primero"}
              </option>
              {responsablesDisponibles.map((resp, id) => (
                <option key={id} value={resp}>
                  {resp}
                </option>
              ))}
            </select>
          </div>
          <div className="detalle-grupo-filas">
            <div>
              <span className="texto-azul">Teléfono:</span>{" "}
              {voluntarioBase.telefono}
            </div>
            <div>
              <span className="texto-azul">Email:</span> {voluntarioBase.email}
            </div>
          </div>
        </div>

        {/*direccion*/}
        <div className="detalle-bloque">
          <div className="detalle-grupo-filas">
            <div>
              <span className="texto-azul">Localidad:</span>{" "}
              {voluntarioBase.localidad}
            </div>
            <div>
              <span className="texto-azul">Domicilio:</span>{" "}
              {voluntarioBase.domicilio}
            </div>
            {esMalagaCapital && voluntarioBase.distrito && (
              <div>
                <span className="texto-azul">Distrito:</span>{" "}
                {voluntarioBase.distrito}
              </div>
            )}
          </div>
        </div>

        {/*turnos (editable)*/}
        <div className="detalle-bloque">
          <span className="texto-azul">Turnos asignados:</span>
          <div className="contenedor-tablas-turnos">
            {asignaciones.length > 0 ? (
              asignaciones.map((asig) => (
                <div key={asig.tiendaId} className="grupo-tienda-turnos">
                  <div className="titulo-tienda-turnos">
                    Tienda: {asig.tiendaNombre}
                  </div>
                  <table className="tabla-turnos-detalle">
                    <tbody>
                      {asig.turnos.map((turno) => (
                        <tr key={turno.turnoId}>
                          <td className="celda-dia-edicion texto-azul">
                            {turno.dia}
                          </td>
                          <td className="celda-franja-edicion">
                            {turno.franjaHoraria}
                          </td>
                          <td className="celda-accion-eliminar">
                            <button
                              type="button"
                              className="btn-eliminar-turno-tabla"
                              onClick={() =>
                                handleEliminarTurno(
                                  asig.tiendaId,
                                  turno.turnoId,
                                )
                              }
                            >
                              X
                            </button>
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

            <button
              type="button"
              className="btn-turno-inline btn-nuevo-margen"
              onClick={handleAbrirModalTurno}
            >
              Añadir turno
            </button>
          </div>
        </div>

        {/*observaciones*/}
        <div className="detalle-bloque bloque-observaciones">
          <span className="texto-azul">Observaciones:</span>
          <textarea
            className="textarea-datos"
            rows="5"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Añade notas del voluntario..."
          ></textarea>
        </div>
      </form>

      <ModalTurno
        isOpen={modalTurnoAbierto}
        onClose={() => setModalTurnoAbierto(false)}
        tiendasUnicas={tiendasUnicas}
        diasSemana={diasSemana}
        nuevoTurnoTienda={nuevoTurnoTienda}
        setNuevoTurnoTienda={setNuevoTurnoTienda}
        nuevoTurnoDia={nuevoTurnoDia}
        setNuevoTurnoDia={setNuevoTurnoDia}
        nuevoTurnoFranja={nuevoTurnoFranja}
        setNuevoTurnoFranja={setNuevoTurnoFranja}
        horasSueltas={voluntarioBase.horasSueltas ? "si" : "no"}
        horasCompletadas={true}
        horaInicio={voluntarioBase.horaComienzo}
        horaFin={voluntarioBase.horaFinal}
        puedeGuardarTurno={puedeGuardarTurno}
        onGuardarTurno={handleGuardarTurno}
      />
    </aside>
  );
}
