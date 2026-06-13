import { CampaniaEstado } from "./campaniaEstado";
import { formatearFecha } from "./utils/fechas";

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
      <span className="campanias__nombre">{campania.nombre}</span>

      <span className="campanias__fechas">
        {formatearFecha(campania.fechaInicio)} / {formatearFecha(campania.fechaFin)}
      </span>

      <CampaniaEstado activa={campania.activa} />
    </button>
  );
}
