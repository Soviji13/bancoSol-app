export function crearFechaLocalDesdeISO(fechaISO) {
  if (!fechaISO || typeof fechaISO !== "string") {
    return new Date(0);
  }

  const fechaSinHora = fechaISO.split("T")[0];
  const partesFecha = fechaSinHora.split("-").map(Number);

  if (partesFecha.length !== 3 || partesFecha.some(Number.isNaN)) {
    return new Date(0);
  }

  const [anio, mes, dia] = partesFecha;

  return new Date(anio, mes - 1, dia);
}

export function formatearFecha(fechaISO) {
  if (!fechaISO) {
    return "dd/mm/aa";
  }

  const fecha = crearFechaLocalDesdeISO(fechaISO);

  if (Number.isNaN(fecha.getTime())) {
    return fechaISO;
  }

  return fecha.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export function compararCampaniasPorFechaInicio(campaniaA, campaniaB) {
  const fechaA = crearFechaLocalDesdeISO(campaniaA?.fechaInicio);
  const fechaB = crearFechaLocalDesdeISO(campaniaB?.fechaInicio);

  return fechaA - fechaB;
}
