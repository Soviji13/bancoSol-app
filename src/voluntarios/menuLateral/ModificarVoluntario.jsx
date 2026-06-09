import { useEffect, useState } from "react";
import { ModalTurno } from "../usosVarios/ModalTurno";
import "./voluntarioLateral.css";
import {
  obtenerVoluntarios,
  actualizarVoluntario,
} from "../../api/voluntariosApi";
import { apiRequest } from "../../api/apiClient";

export function ModificarVoluntario({ manejaContenidoLateral }) {
  const [voluntarioBase, setVoluntarioBase] = useState(null);
  const [cargandoInicial, setCargandoInicial] = useState(true);

  //estados de campos MODIFICABLES
  const [entidad, setEntidad] = useState("");
  const [responsable, setResponsable] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [turnosPlanos, setTurnosPlanos] = useState([]);

  //estados modal turnos
  const [modalTurnoAbierto, setModalTurnoAbierto] = useState(false);
  const [nuevoTurnoTienda, setNuevoTurnoTienda] = useState("");
  const [nuevoTurnoDia, setNuevoTurnoDia] = useState("");
  const [nuevoTurnoFranja, setNuevoTurnoFranja] = useState("");

  const [entidadesBackend, setEntidadesBackend] = useState([]);
  const [tiendasBackend, setTiendasBackend] = useState([]);

  // Cargar datos
  useEffect(() => {
    const idSeleccionado = localStorage.getItem("voluntarioSeleccionadoId");
    const campaniaIdActual = localStorage.getItem("campaniaActivaId"); // <-- Añadido
    if (!idSeleccionado) return;

    Promise.all([
      apiRequest("/entidades"),
      apiRequest("/tiendas"),
      obtenerVoluntarios(campaniaIdActual, { id: idSeleccionado }),
    ])
      .then(([resEntidades, resTiendas, resVol]) => {
        setEntidadesBackend(resEntidades);
        setTiendasBackend(resTiendas);

        if (resVol && resVol.length > 0) {
          const vol = resVol[0];
          setVoluntarioBase(vol);
          setEntidad(vol.perteneceA || "");
          setResponsable(vol.responsableEntidad || "");
          setObservaciones(vol.observaciones || "");

          const turnosAplanados = [];
          if (vol.asignaciones) {
            vol.asignaciones.forEach((asig) => {
              asig.turnos.forEach((t) => {
                turnosAplanados.push({
                  turnoId: t.turnoId,
                  tienda: asig.tiendaNombre,
                  dia: t.dia,
                  franja: t.franjaHoraria,
                });
              });
            });
          }
          setTurnosPlanos(turnosAplanados);
        }
        setCargandoInicial(false);
      })
      .catch((error) => {
        console.error("Error al cargar datos:", error);
        setCargandoInicial(false);
      });
  }, []);

  const entidadesUnicas = entidadesBackend.map((e) => e.nombre);
  const entidadSeleccionadaObjeto = entidadesBackend.find(
    (e) => e.nombre === entidad,
  );
  const responsablesDisponibles = entidadSeleccionadaObjeto
    ? entidadSeleccionadaObjeto.responsables.map((r) => r.nombre)
    : [];

  const tiendasUnicas = tiendasBackend.map((t) => t.nombre);
  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const handleCambioEntidad = (e) => {
    setEntidad(e.target.value);
    setResponsable("");
  };

  const cerrarPanel = () => {
    window.dispatchEvent(new Event("salirModoEdicion"));
    manejaContenidoLateral("detalle-voluntario");
  };

  const handleGuardarCambios = async (e) => {
    e.preventDefault();
    const campaniaIdActual = localStorage.getItem("campaniaActivaId") || 3;

    const payload = {
      campaniaId: parseInt(campaniaIdActual),
      entidad,
      responsable,
      horasSueltas: voluntarioBase.horasSueltas,
      horaInicio: voluntarioBase.horaComienzo
        ? voluntarioBase.horaComienzo.slice(0, 5)
        : null,
      horaFin: voluntarioBase.horaFinal
        ? voluntarioBase.horaFinal.slice(0, 5)
        : null,
      observaciones,
      turnosAsignados: turnosPlanos,
    };

    try {
      await actualizarVoluntario(voluntarioBase.id, payload);
      window.dispatchEvent(new Event("refrescarTablaVoluntarios"));
      cerrarPanel();
    } catch (error) {
      console.error("Error actualizando", error);
      alert("Error al actualizar voluntario.");
    }
  };

  const handleEliminarTurno = (indexTurno) => {
    const nuevosTurnos = turnosPlanos.filter((_, i) => i !== indexTurno);
    setTurnosPlanos(nuevosTurnos);
  };

  const handleAbrirModalTurno = () => {
    setNuevoTurnoTienda("");
    setNuevoTurnoDia("");
    setNuevoTurnoFranja("");
    setModalTurnoAbierto(true);
  };

  const handleGuardarTurno = () => {
    const franjaFinal = voluntarioBase.horasSueltas
      ? `${voluntarioBase.horaComienzo.slice(0, 5)} - ${voluntarioBase.horaFinal.slice(0, 5)}`
      : nuevoTurnoFranja;
    const nuevoTurno = {
      tienda: nuevoTurnoTienda,
      dia: nuevoTurnoDia,
      franja: franjaFinal,
    };
    setTurnosPlanos([...turnosPlanos, nuevoTurno]);
    setModalTurnoAbierto(false);
  };

  // La barrera contra null. Todo lo que use voluntarioBase.algo va DEBAJO de esto.
  if (cargandoInicial || !voluntarioBase) {
    return (
      <aside className="panel-detalle-lateral">
        <div className="panel-detalle-cargando" style={{ padding: "20px" }}>
          Cargando datos del voluntario...
        </div>
      </aside>
    );
  }

  // Ahora es 100% seguro usar voluntarioBase
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

      <form
        id="form-modificar"
        className="panel-detalle-contenido"
        onSubmit={handleGuardarCambios}
      >
        {/*Entidad colab*/}
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
              {entidadesUnicas.map((ent, id) => (
                <option key={id} value={ent}>
                  {ent}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/*Resp entidad */}
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

        {/*turnos*/}
        <div className="detalle-bloque">
          <span className="texto-azul">Turnos asignados:</span>
          <div className="contenedor-tablas-turnos">
            {turnosPlanos.length > 0 ? (
              <ul className="lista-turnos-agregados">
                {turnosPlanos.map((t, index) => (
                  <li
                    key={index}
                    style={{
                      marginBottom: "5px",
                      padding: "5px",
                      border: "1px solid #ccc",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>
                      <strong>{t.tienda}</strong> | {t.dia} | {t.franja}
                    </span>
                    <button
                      type="button"
                      className="btn-eliminar-turno-tabla"
                      onClick={() => handleEliminarTurno(index)}
                    >
                      X
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div
                className="texto-sin-turnos"
                style={{ marginBottom: "10px" }}
              >
                Sin turnos asignados
              </div>
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

        {/*observ*/}
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
        horaInicio={
          voluntarioBase.horaComienzo
            ? voluntarioBase.horaComienzo.slice(0, 5)
            : null
        }
        horaFin={
          voluntarioBase.horaFinal ? voluntarioBase.horaFinal.slice(0, 5) : null
        }
        puedeGuardarTurno={puedeGuardarTurno}
        onGuardarTurno={handleGuardarTurno}
      />
    </aside>
  );
}
