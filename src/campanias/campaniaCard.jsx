import { CampaniaEstado } from "./campaniaEstado";

export function CampaniaCard({
  campania,
  seleccionada,
  modoSeleccionAccion,
  onClickCampania,
}) {
  const claseTarjeta = [
    "campanias__tarjeta",
    seleccionada ? "campanias__tarjeta--seleccionada" : "",
    campania.activa
      ? "campanias__tarjeta--activa"
      : "campanias__tarjeta--terminada",
    modoSeleccionAccion !== null ? "campanias__tarjeta--seleccionable" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={claseTarjeta}
      onClick={() => onClickCampania(campania.id)}
    >
      <h2 className="campanias__nombre">{campania.nombre}</h2>

      <p className="campanias__fechas">
        {formatearFecha(campania.fechaInicio)} / {formatearFecha(campania.fechaFin)}
      </p>

      <CampaniaEstado activa={campania.activa} />
    </button>
  );
}

function formatearFecha(fechaISO) {
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

function crearFechaLocalDesdeISO(fechaISO) {
  const partesFecha = fechaISO.split("-").map(Number);

  if (partesFecha.length !== 3 || partesFecha.some(Number.isNaN)) {
    return new Date(NaN);
  }

  const [anio, mes, dia] = partesFecha;

  return new Date(anio, mes - 1, dia);
}