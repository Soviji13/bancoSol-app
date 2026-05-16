// ==============================
// MAPPER INCIDENCIAS
// ==============================

export function mapearIncidenciaDesdeAPI(incidenciaAPI) {
  const fechaHora = incidenciaAPI.fechaHora ?? null;

  return {
    id: incidenciaAPI.id,

    tipo: "Incidencia",

    fechaHora,
    fechaTexto: formatearFecha(fechaHora),
    horaTexto: formatearHora(fechaHora),

    asunto: incidenciaAPI.asunto ?? "",
    descripcion: incidenciaAPI.descripcion ?? "",

    estado: incidenciaAPI.estado ?? "PENDIENTE",
    estadoTexto: formatearEstado(incidenciaAPI.estado),

    reportadoPorTipo: incidenciaAPI.reportadoPorTipo ?? "",
    reportadoPorNombre: incidenciaAPI.reportadoPorNombre ?? "Sin responsable",

    responsableTiendaId: incidenciaAPI.responsableTiendaId ?? null,
    responsableTiendaNombre: incidenciaAPI.responsableTiendaNombre ?? null,

    responsableEntidadId: incidenciaAPI.responsableEntidadId ?? null,
    responsableEntidadNombre: incidenciaAPI.responsableEntidadNombre ?? null,

    cargoTexto: formatearCargo(incidenciaAPI.reportadoPorTipo),

    /*
     * Ahora mismo el backend no devuelve email/teléfono del responsable.
     * Lo dejamos preparado como "No disponible".
     * Si luego añadimos contacto al DTO, aquí se conecta.
     */
    contactoTexto: incidenciaAPI.contacto ?? "No disponible"
  };
}

export function mapearIncidenciaParaAPI(incidencia) {
  return {
    fechaHora: incidencia.fechaHora,
    asunto: incidencia.asunto,
    descripcion: incidencia.descripcion,
    estado: incidencia.estado,
    responsableTiendaId: incidencia.responsableTiendaId,
    responsableEntidadId: incidencia.responsableEntidadId
  };
}

export function mapearIncidenciaConNuevoEstado(incidencia, nuevoEstado) {
  return {
    fechaHora: incidencia.fechaHora,
    asunto: incidencia.asunto,
    descripcion: incidencia.descripcion,
    estado: nuevoEstado,
    responsableTiendaId: incidencia.responsableTiendaId,
    responsableEntidadId: incidencia.responsableEntidadId
  };
}

export function formatearEstado(estado) {
  if (estado === "PENDIENTE") {
    return "Pendiente";
  }

  if (estado === "LEIDA") {
    return "Leída";
  }

  if (estado === "RESUELTA") {
    return "Resuelta";
  }

  return "-";
}

export function obtenerClaseEstado(estado) {
  if (estado === "PENDIENTE") {
    return "estado--pendiente";
  }

  if (estado === "LEIDA") {
    return "estado--leida";
  }

  if (estado === "RESUELTA") {
    return "estado--resuelta";
  }

  return "estado--ninguno";
}

export function formatearCargo(tipo) {
  if (tipo === "RESPONSABLE_TIENDA") {
    return "Responsable tienda";
  }

  if (tipo === "RESPONSABLE_ENTIDAD") {
    return "Responsable entidad";
  }

  return "-";
}

function formatearFecha(fechaHora) {
  if (!fechaHora) {
    return "-";
  }

  const fecha = new Date(fechaHora);

  if (Number.isNaN(fecha.getTime())) {
    return "-";
  }

  return fecha.toLocaleDateString("es-ES");
}

function formatearHora(fechaHora) {
  if (!fechaHora) {
    return "-";
  }

  const fecha = new Date(fechaHora);

  if (Number.isNaN(fecha.getTime())) {
    return "-";
  }

  return fecha.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit"
  });
}