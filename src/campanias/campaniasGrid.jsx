import { CampaniaCard } from "./campaniaCard";

export function CampaniasGrid({
  campanias,
  campaniaSeleccionadaId,
  modoSeleccionAccion,
  onClickCampania,
}) {
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