import { useState } from "react";
import { mockVoluntarios } from "../mockDataVoluntarios";
import "./voluntarioLateral.css";

export function FiltrosVoluntarios({ manejaContenidoLateral }) {
  //los filtros por defecto
  const [filtroId, setFiltroId] = useState("");
  const [filtroEntidad, setFiltroEntidad] = useState("");
  const [filtroResponsable, setFiltroResponsable] = useState("");
  const [filtroTienda, setFiltroTienda] = useState("");
  const [filtroFranja, setFiltroFranja] = useState("TODAS");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");

  //RECORDATORIO:... convierte el set a array
  const entidadesUnicas = [
    ...new Set(mockVoluntarios.map((v) => v.perteneceA)),
  ];
  const responsablesUnicos = [
    ...new Set(mockVoluntarios.map((v) => v.responsableEntidad)),
  ];
  const tiendasUnicas = [
    ...new Set(
      mockVoluntarios.flatMap((v) => v.asignaciones.map((a) => a.tiendaNombre)),
    ),
  ];

  const cerrarPanel = () => {
    manejaContenidoLateral("menuLateral");
  }; //volver a mostrar el menu lateral (botones gestionar...)

  const limpiarFiltros = () => {
    setFiltroId("");
    setFiltroEntidad("");
    setFiltroResponsable("");
    setFiltroTienda("");
    setFiltroFranja("TODAS");
    setHoraInicio("");
    setHoraFin("");
  };

  //HAY Q ACTUALIZARLO PARA LA API
  const aplicarFiltros = () => {
    const filtrosActuales = {
      id: filtroId,
      entidad: filtroEntidad,
      responsable: filtroResponsable,
      tienda: filtroTienda,
      franja: filtroFranja,
      horasSueltas: { inicio: horaInicio, fin: horaFin },
    };
    console.log("Aplicando filtros de voluntarios:", filtrosActuales);
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

          {/* Botones de acción */}
          <div className="fila-campana">
            <button className="btn-filtrar-principal" onClick={aplicarFiltros}>
              Aplicar Filtros
            </button>
            <button className="btn-filtrar-limpiar" onClick={limpiarFiltros}>
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
