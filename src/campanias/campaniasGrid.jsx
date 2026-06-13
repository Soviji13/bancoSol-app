import { CampaniaCard } from "./campaniaCard";

export function CampaniasGrid({
  campanias,
  campaniaSeleccionadaId,
  modoSeleccionAccion,
  onClickCampania,
}) {
  if (campanias.length === 0) {
    return (
      <div className="campanias__grid campanias__grid--vacia">
        <p className="campanias__vacio">No hay campañas registradas.</p>
      </div>
    );
  }

  return (
    <div className="campanias__grid">
      {campanias.map((campania) => (
        <CampaniaCard
          key={campania.id}
          campania={campania}
          seleccionada={campania.id === campaniaSeleccionadaId}
          modoSeleccionAccion={modoSeleccionAccion}
          onClickCampania={onClickCampania}
        />
      ))}
    </div>
  );
}
