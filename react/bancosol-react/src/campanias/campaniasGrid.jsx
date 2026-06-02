import { CampaniaCard } from "./CampaniaCard";

export function CampaniasGrid({
  campanias,
  campaniaSeleccionadaId,
  onSeleccionarCampania,
}) {
  return (
    <div className="campanias__grid">
      {campanias.map((campania) => (
        <CampaniaCard
          key={campania.id}
          campania={campania}
          seleccionada={campania.id === campaniaSeleccionadaId}
          onSeleccionar={onSeleccionarCampania}
        />
      ))}
    </div>
  );
}