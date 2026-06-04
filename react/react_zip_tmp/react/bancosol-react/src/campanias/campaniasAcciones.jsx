export function CampaniasAcciones({
  onGenerarCampania,
  onModificarCampania,
  onEliminarCampania,
}) {
  return (
    <section className="campanias__acciones">
      <button
        type="button"
        className="campanias__accion"
        onClick={onGenerarCampania}
      >
        Generar campaña
      </button>

      <button
        type="button"
        className="campanias__accion"
        onClick={onModificarCampania}
      >
        Modificar campaña
      </button>

      <button
        type="button"
        className="campanias__accion"
        onClick={onEliminarCampania}
      >
        Eliminar campaña
      </button>
    </section>
  );
}