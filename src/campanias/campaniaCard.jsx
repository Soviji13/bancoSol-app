import { CampaniaEstado } from "./CampaniaEstado";

export function CampaniaCard({ campania, seleccionada, onSeleccionar }) {
  const claseTarjeta = [
    "campanias__tarjeta",
    seleccionada ? "campanias__tarjeta--seleccionada" : "",
    campania.activa ? "campanias__tarjeta--activa" : "campanias__tarjeta--terminada",
  ]
    .filter(Boolean)
    .join(" ");

  const textoFechas = obtenerTextoFechas(campania.fechaInicio, campania.fechaFin);

  return (
    <button
      type="button"
      className={claseTarjeta}
      onClick={() => onSeleccionar(campania.id)}
    >
      <h2 className="campanias__nombre">{campania.nombre}</h2>

      <p className="campanias__fechas">{textoFechas}</p>

      <CampaniaEstado activa={campania.activa} />
    </button>
  );
}

function obtenerTextoFechas(fechaInicio, fechaFin) {
  if (!fechaInicio || !fechaFin) {
    return "dd/mm/aa - dd/mm/aa";
  }

  return `${formatearFecha(fechaInicio)} / ${formatearFecha(fechaFin)}`;
}

function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);

  if (Number.isNaN(fecha.getTime())) {
    return fechaISO;
  }

  return fecha.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}