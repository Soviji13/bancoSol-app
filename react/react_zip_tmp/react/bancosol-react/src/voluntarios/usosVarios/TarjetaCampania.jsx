export function TarjetaCampania({ campania, esViendo, onSelect }) {
  const formatFecha = (f) => {
    if (!f) return "--/--/----";
    const date = new Date(f);
    return date.toLocaleDateString("es-ES"); //importante!!! fecha en formato español dd/mm/aaaa
  };

  return (
    <div
      className={`tarjeta-campania ${esViendo ? "seleccionada" : ""}`}
      onClick={() => onSelect(campania)}
    >
      <div className="tarjeta-titulo">{campania.nombre}</div>
      <div className="tarjeta-detalles">
        <span>
          Inicio: {formatFecha(campania.fechaInicio)} | Fin:{" "}
          {formatFecha(campania.fechaFin)}
        </span>
        <span>Año fiscal: {campania.anio || "N/A"}</span>
      </div>
      <div className="badges-container">
        <span className={`badge ${campania.activa ? "activa" : "inactiva"}`}>
          {campania.activa ? "ACTIVA" : "INACTIVA"}
        </span>
        {esViendo && <span className="badge viendo">VIENDO AHORA</span>}
      </div>
    </div>
  );
}
