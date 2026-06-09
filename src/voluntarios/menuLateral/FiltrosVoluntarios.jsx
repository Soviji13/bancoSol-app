import { useState, useEffect } from "react";
import "./voluntarioLateral.css";
import { apiRequest } from "../../api/apiClient";

export function FiltrosVoluntarios({ manejaContenidoLateral }) {
  //los filtros por defecto
  const [filtroId, setFiltroId] = useState("");
  const [filtroEntidad, setFiltroEntidad] = useState("");
  const [filtroResponsable, setFiltroResponsable] = useState("");
  const [filtroTienda, setFiltroTienda] = useState("");
  const [filtroFranja, setFiltroFranja] = useState("TODAS");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");

  //estados para guardar los datos reales de los desplegables desde la api
  const [entidadesUnicas, setEntidadesUnicas] = useState([]);
  const [responsablesUnicos, setResponsablesUnicos] = useState([]);
  const [tiendasUnicas, setTiendasUnicas] = useState([]);

  //estado para el cargando mientras pide a la api
  const [cargandoFiltros, setCargandoFiltros] = useState(true);

  //se activa al abrir el panel lateral de filtros
  useEffect(() => {
    //ponemos a cargar al iniciar
    setCargandoFiltros(true);

    //1. recuperamos los filtros si ya habias aplicado alguno antes y se quedó en cache
    const filtrosGuardados = JSON.parse(
      localStorage.getItem("filtrosVoluntarios"),
    );
    if (filtrosGuardados) {
      setFiltroId(filtrosGuardados.id || "");
      setFiltroEntidad(filtrosGuardados.entidad || "");
      setFiltroResponsable(filtrosGuardados.responsable || "");
      setFiltroTienda(filtrosGuardados.tienda || "");
      setFiltroFranja(filtrosGuardados.franja || "TODAS");
      setHoraInicio(filtrosGuardados.horaInicio || "");
      setHoraFin(filtrosGuardados.horaFin || "");
    }

    //2. pedimos a la api las entidades y tiendas reales para rellenar los select
    Promise.all([apiRequest("/entidades"), apiRequest("/tiendas")])
      .then(([resEntidades, resTiendas]) => {
        setEntidadesUnicas(resEntidades.map((e) => e.nombre));

        //sacamos los responsables agrupados de todas las entidades sin que se repitan
        const responsables = [];
        resEntidades.forEach((e) => {
          if (e.responsables) {
            e.responsables.forEach((r) => responsables.push(r.nombre));
          }
        });
        setResponsablesUnicos([...new Set(responsables)]);

        setTiendasUnicas(resTiendas.map((t) => t.nombre));
      })
      .catch((error) => {
        console.error("Error al cargar datos dinámicos de filtros:", error);
      })
      .finally(() => {
        //quitamos el cargando cuando ya esten los datos o si da error
        setCargandoFiltros(false);
      });
  }, []);

  const cerrarPanel = () => {
    manejaContenidoLateral("menuLateral");
  }; //volver a mostrar el menu lateral (botones gestionar...)

  const limpiarFiltros = () => {
    //vaciamos los estados
    setFiltroId("");
    setFiltroEntidad("");
    setFiltroResponsable("");
    setFiltroTienda("");
    setFiltroFranja("TODAS");
    setHoraInicio("");
    setHoraFin("");

    //borramos la cache y avisamos a la tabla principal con el evento global para que vuelva a mostrar todo
    localStorage.removeItem("filtrosVoluntarios");
    window.dispatchEvent(new Event("cambioFiltrosVoluntarios"));
  };

  //YA ACTUALIZADO PARA LA API CON EVENTOS GLOBALES
  const aplicarFiltros = () => {
    const filtrosActuales = {
      id: filtroId,
      entidad: filtroEntidad,
      responsable: filtroResponsable,
      tienda: filtroTienda,
      franja: filtroFranja !== "TODAS" ? filtroFranja : "", //si es todas lo mandamos vacio para que no filtre la franja
      horaInicio: horaInicio,
      horaFin: horaFin,
    };

    console.log("Aplicando filtros de voluntarios:", filtrosActuales);

    //lo metemos en cache y tocamos la campana para que la tabla lo escuche
    localStorage.setItem("filtrosVoluntarios", JSON.stringify(filtrosActuales));
    window.dispatchEvent(new Event("cambioFiltrosVoluntarios"));
  };

  return (
    <aside className="panel-filtros-lateral">
      <header className="panel-lateral-header">
        <div className="panel-lateral-info">
          <h2 className="panel-lateral-titulo">Filtros de voluntarios</h2>
          <p className="panel-lateral-subtitulo">Búsqueda avanzada</p>
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

      <div className="panel-filtros__scroll">
        {/*si esta cargando muestra el aviso, si no los campos de filtros*/}
        {cargandoFiltros ? (
          <div className="panel-detalle-cargando">
            Cargando filtros disponibles...
          </div>
        ) : (
          <div className="caja-datos">
            {/*ID*/}
            <div className="fila">
              <div className="col-completa">
                <div className="celda">
                  <span className="etiqueta-azul">ID:</span>
                  <input
                    type="number"
                    className="input-datos"
                    value={filtroId}
                    placeholder="Ej: 67"
                    onChange={(e) => setFiltroId(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/*entidad colab*/}
            <div className="fila">
              <div className="col-completa">
                <div className="celda">
                  <span className="etiqueta-azul">Entidad colaboradora:</span>
                  <select
                    className="select-datos"
                    value={filtroEntidad}
                    onChange={(e) => setFiltroEntidad(e.target.value)}
                  >
                    <option value="">Todas las entidades</option>
                    {entidadesUnicas.map((entidad, index) => (
                      <option key={index} value={entidad}>
                        {entidad}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/*responsable */}
            <div className="fila">
              <div className="col-completa">
                <div className="celda">
                  <span className="etiqueta-azul">Responsable:</span>
                  <select
                    className="select-datos"
                    value={filtroResponsable}
                    onChange={(e) => setFiltroResponsable(e.target.value)}
                  >
                    <option value="">Todos los responsables</option>
                    {responsablesUnicos.map((resp, index) => (
                      <option key={index} value={resp}>
                        {resp}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/*tienda*/}
            <div className="fila">
              <div className="col-completa">
                <div className="celda">
                  <span className="etiqueta-azul">Tienda:</span>
                  <select
                    className="select-datos"
                    value={filtroTienda}
                    onChange={(e) => setFiltroTienda(e.target.value)}
                  >
                    <option value="">Todas las tiendas</option>
                    {tiendasUnicas.map((tienda, index) => (
                      <option key={index} value={tienda}>
                        {tienda}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/*franja */}
            <div className="fila">
              <div className="col-completa">
                <div className="celda">
                  <span className="etiqueta-azul">Franja:</span>
                  <div className="radio-grupo-filtros">
                    <label className="radio-label-filtros">
                      <input
                        type="radio"
                        value="TODAS"
                        checked={filtroFranja === "TODAS"}
                        onChange={(e) => setFiltroFranja(e.target.value)}
                      />{" "}
                      Todas
                    </label>
                    <label className="radio-label-filtros">
                      <input
                        type="radio"
                        value="MAÑANA"
                        checked={filtroFranja === "MAÑANA"}
                        onChange={(e) => setFiltroFranja(e.target.value)}
                      />{" "}
                      Mañana
                    </label>
                    <label className="radio-label-filtros">
                      <input
                        type="radio"
                        value="TARDE"
                        checked={filtroFranja === "TARDE"}
                        onChange={(e) => setFiltroFranja(e.target.value)}
                      />{" "}
                      Tarde
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/*horas sueltas*/}
            <div className="fila">
              <div className="col-completa">
                <div className="celda celda-wrap">
                  <span className="etiqueta-azul">Horas sueltas:</span>
                  <div className="contenedor-intervalo-time">
                    <input
                      type="time"
                      className="input-datos input-time-corto"
                      value={horaInicio}
                      onChange={(e) => setHoraInicio(e.target.value)}
                    />
                    <span className="separador-guion">-</span>
                    <input
                      type="time"
                      className="input-datos input-time-corto"
                      value={horaFin}
                      onChange={(e) => setHoraFin(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/*botones */}
            <div className="fila-campana">
              <button
                className="btn-filtrar-principal"
                onClick={aplicarFiltros}
              >
                Aplicar Filtros
              </button>
              <button className="btn-filtrar-limpiar" onClick={limpiarFiltros}>
                Limpiar filtros
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
