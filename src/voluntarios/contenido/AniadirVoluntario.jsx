import { useState, useEffect } from "react";
import { apiRequest } from "../../api/apiClient";
import { crearVoluntario } from "../../api/voluntariosApi";
import { ModalTurno } from "../usosVarios/ModalTurno";

export function AniadirVoluntario({ manejaContenidoInicial }) {
  //estados del formulario principal, ya que algunas cosas dependen de los campos q rellenemos
  const [entidad, setEntidad] = useState("");
  const [responsable, setResponsable] = useState("");
  const [horasSueltas, setHorasSueltas] = useState("no");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [turnosAsignados, setTurnosAsignados] = useState([]);

  //estado del modal de turnos para controlar apertura cierre etc
  const [modalTurnoAbierto, setModalTurnoAbierto] = useState(false);
  const [nuevoTurnoTienda, setNuevoTurnoTienda] = useState("");
  const [nuevoTurnoDia, setNuevoTurnoDia] = useState("");
  const [nuevoTurnoFranja, setNuevoTurnoFranja] = useState("");

  const [entidadesBackend, setEntidadesBackend] = useState([]);
  const [tiendasBackend, setTiendasBackend] = useState([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const [resEntidades, resTiendas] = await Promise.all([
          apiRequest("/entidades"),
          apiRequest("/tiendas"),
        ]);
        setEntidadesBackend(resEntidades);
        setTiendasBackend(resTiendas);
      } catch (error) {
        console.error("Error cargando datos dinámicos:", error);
      } finally {
        setCargandoDatos(false);
      }
    };
    cargarDatosIniciales();
  }, []);

  //datos para los select DINAMICOS!!!!!!!!!!!!!!!!!
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
  ];

  //manjeadores
  const handleCambioEntidad = (e) => {
    setEntidad(e.target.value);
    setResponsable(""); //ponemos el responsable vacio para q vuelva a elejirlo, ya que sino podria quedar el de otra entidad y se romperia la logica
  };

  const handleCambioHorasSueltas = (e) => {
    setHorasSueltas(e.target.value);
    if (e.target.value === "no") {
      setHoraInicio("");
      setHoraFin(""); //ponemos horas a vacias si radio de hSueltas es nO
    }
  };

  const handleAbrirModalTurno = () => {
    setNuevoTurnoTienda("");
    setNuevoTurnoDia("");
    setNuevoTurnoFranja("");
    setModalTurnoAbierto(true); //seteamos los datos del turno en el nuevo formulario vacios y mostramos el modal
  };

  const handleGuardarTurno = () => {
    const franjaFinal =
      horasSueltas === "si" ? `${horaInicio} - ${horaFin}` : nuevoTurnoFranja;
    const nuevoTurno = {
      tienda: nuevoTurnoTienda,
      dia: nuevoTurnoDia,
      franja: franjaFinal,
    };
    setTurnosAsignados([...turnosAsignados, nuevoTurno]);
    setModalTurnoAbierto(false); //guardamos los datos del nuevo turno y CERRAMOS el modal
  };

  const handleEliminarTurno = (index) => {
    const nuevosTurnos = turnosAsignados.filter((_, i) => i !== index); //todos menos el q se borra
    setTurnosAsignados(nuevosTurnos);
  };

  //ESTE HAY Q CMABIARLO PARA CONEXION CON API
  const handleGuardarVoluntario = async (e) => {
    e.preventDefault();
    const campaniaIdActual = localStorage.getItem("campaniaActivaId") || 3;

    const vol = {
      campaniaId: parseInt(campaniaIdActual),
      entidad,
      responsable,
      horasSueltas: horasSueltas === "si",
      horaInicio: horasSueltas === "si" ? horaInicio : null,
      horaFin: horasSueltas === "si" ? horaFin : null,
      observaciones,
      turnosAsignados,
    };

    try {
      await crearVoluntario(vol);
      window.dispatchEvent(new Event("refrescarTablaVoluntarios"));
      manejaContenidoInicial("voluntarios");
    } catch (error) {
      console.error("Error al guardar el voluntario:", error);
      alert("Error al añadir el voluntario. Revisa la consola.");
    }
  };

  //Validaciones del modal de turnos
  const horasCompletadas = horaInicio !== "" && horaFin !== "";
  //la tienda no vacia, el dia no vacio, y si el vol es hSueltas tiene q tener las mismas, si no, franja no puede ser vacio
  const puedeGuardarTurno =
    nuevoTurnoTienda !== "" &&
    nuevoTurnoDia !== "" &&
    (horasSueltas === "si" ? horasCompletadas : nuevoTurnoFranja !== "");

  if (cargandoDatos) {
    return (
      <div
        className="texto-cargando"
        style={{ padding: "20px", color: "#0054a6" }}
      >
        Cargando datos del servidor...
      </div>
    );
  }

  return (
    <section className="aniadir-voluntario-contenedor">
      <header className="cabecera-anadir">
        <p className="texto-instruccion">
          Rellene los datos para añadir un nuevo voluntario:
        </p>
      </header>

      <div className="formulario-contenedor">
        <form
          id="form-anadir-voluntario"
          className="form-voluntario"
          onSubmit={handleGuardarVoluntario}
        >
          {/*Entidad colab*/}
          <div className="form-fila">
            <label htmlFor="select-entidad" className="etiqueta-azul">
              Entidad colaboradora:
            </label>
            <select
              id="select-entidad"
              className="select-caja"
              value={entidad}
              onChange={handleCambioEntidad}
              required
            >
              <option value="" disabled>
                Seleccione una entidad...
              </option>
              {entidadesUnicas.map((entidad, id) => (
                <option key={id} value={entidad}>
                  {entidad}
                </option>
              ))}
            </select>
          </div>

          {/*Resp entidad */}
          <div className="form-fila">
            <label htmlFor="select-responsable" className="etiqueta-azul">
              Responsable de entidad:
            </label>
            <select
              id="select-responsable"
              className="select-caja"
              value={responsable}
              onChange={(e) => setResponsable(e.target.value)}
              disabled={!entidad}
              required
            >
              <option value="" disabled>
                {entidad
                  ? "Seleccione un responsable..."
                  : "Primero elija una entidad"}
              </option>
              {responsablesDisponibles.map((resp, id) => (
                <option key={id} value={resp}>
                  {resp}
                </option>
              ))}
            </select>
          </div>

          <hr className="separador-dashed" />

          {/*horas sueltas*/}
          <div className="form-fila">
            <label className="etiqueta-azul">¿Trabaja por horas sueltas?</label>
            <div className="radio-grupo">
              <label className="radio-label">
                <input
                  type="radio"
                  value="si"
                  checked={horasSueltas === "si"}
                  onChange={handleCambioHorasSueltas}
                />{" "}
                Sí
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="no"
                  checked={horasSueltas === "no"}
                  onChange={handleCambioHorasSueltas}
                />{" "}
                No
              </label>
            </div>
          </div>

          <div className="form-fila">
            <label
              className={`etiqueta-azul ${
                horasSueltas === "no" ? "texto-deshabilitado" : ""
              }`}
            >
              Intervalo de horas:
            </label>
            <div className="contenedor-horas-input">
              <input
                type="time"
                className="input-linea input-time-ancho"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                disabled={horasSueltas === "no"}
                required={horasSueltas === "si"}
              />
              <span>-</span>
              <input
                type="time"
                className="input-linea input-time-ancho"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                disabled={horasSueltas === "no"}
                required={horasSueltas === "si"}
              />
            </div>
          </div>

          <hr className="separador-dashed" />

          {/*turnos*/}
          <div className="form-fila form-fila-top">
            <label className="etiqueta-azul label-form-top">Turnos:</label>
            <div className="caja-turnos-lista">
              {turnosAsignados.length > 0 ? (
                <ul className="lista-turnos-agregados">
                  {turnosAsignados.map((t, id) => (
                    <li key={id}>
                      <span>
                        <strong>{t.tienda}</strong> - {t.dia} ({t.franja})
                      </span>
                      <button
                        type="button"
                        className="btn-eliminar-turno"
                        onClick={() => handleEliminarTurno(id)}
                      >
                        X
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="texto-sin-turnos-form">
                  Aún no se han añadido turnos.
                </p>
              )}
              <button
                type="button"
                className="btn-turno-inline"
                onClick={handleAbrirModalTurno}
              >
                Añadir Turno
              </button>
            </div>
          </div>

          <hr className="separador-dashed" />

          {/*observ*/}
          <div className="form-fila form-fila-top">
            <label htmlFor="textarea-obs" className="etiqueta-azul">
              Observaciones:
            </label>
            <textarea
              id="textarea-obs"
              className="textarea-datos"
              placeholder="Añade notas o preferences de este voluntario..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            ></textarea>
          </div>
        </form>
      </div>

      <div className="acciones-tabla">
        <button
          type="button"
          className="acciones-tabla__btn btn-cancelar"
          onClick={() => manejaContenidoInicial("voluntarios")}
        >
          Cancelar
        </button>
        <button
          type="submit"
          form="form-anadir-voluntario"
          className="acciones-tabla__btn btn-anadir"
        >
          Crear nuevo voluntario
        </button>
      </div>

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
        horasSueltas={horasSueltas}
        horasCompletadas={horasCompletadas}
        horaInicio={horaInicio}
        horaFin={horaFin}
        puedeGuardarTurno={puedeGuardarTurno}
        onGuardarTurno={handleGuardarTurno}
      />
    </section>
  );
}
