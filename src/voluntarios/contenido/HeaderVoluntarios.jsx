export function HeaderVoluntarios({
  campaniaActiva,
  manejaContenidoLateral,
  onAbrirModal,
}) {
  return (
    <div className="voluntarios-topbar">
      <div className="topbar-acciones-izq">
        <button
          className="btn-icono-cuadrado"
          onClick={() => manejaContenidoLateral("filtros-voluntarios")}
        >
          <img
            src="/assets/filter_alt.svg"
            alt="Filtro"
            className="icono-filtro"
          />
        </button>
        <button className="btn-secundario-outline" onClick={onAbrirModal}>
          Seleccionar otra campaña
        </button>
      </div>

      <div className="topbar-titulo-contenedor">
        <h1 className="topbar-titulo">
          Voluntariado en tiendas: "{campaniaActiva.nombre}"
        </h1>
      </div>

      <div className="topbar-info-contenedor">
        <span className="topbar-info-texto">
          Para ver más información, haga
          <br />
          click sobre su fila correspondiente
        </span>
        <div className="icono-info-redondo">?</div>
      </div>
    </div>
  );
}
