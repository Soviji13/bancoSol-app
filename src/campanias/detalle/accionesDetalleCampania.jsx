export function AccionesDetalleCampania({
  disabled,
  onCrearCadena,
  onAsignarCadenas,
  onGestionarCoordinadores,
}) {
  return (
    <div className="detalle-campania__acciones-laterales">
      <button
        type="button"
        className="detalle-campania__accion"
        onClick={onCrearCadena}
        disabled={disabled}
      >
        Crear cadena
      </button>

      <button
        type="button"
        className="detalle-campania__accion"
        onClick={onAsignarCadenas}
        disabled={disabled}
      >
        Asignar cadenas
      </button>

      <button
        type="button"
        className="detalle-campania__accion"
        onClick={onGestionarCoordinadores}
        disabled={disabled}
      >
        Gestionar coordinadores
      </button>
    </div>
  );
}
