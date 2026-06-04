export function FormularioCrearCadena({
  nombre,
  acronimo,
  onCambiarNombre,
  onCambiarAcronimo,
  onCerrar,
  onGuardar,
}) {
  return (
    <div className="modal-cadena" role="dialog" aria-modal="true">
      <div className="modal-cadena__fondo" onClick={onCerrar} />

      <form className="modal-cadena__formulario" onSubmit={onGuardar}>
        <header className="modal-cadena__cabecera">
          <h2>Crear cadena</h2>

          <button
            type="button"
            className="modal-cadena__cerrar"
            onClick={onCerrar}
            aria-label="Cerrar formulario"
          >
            ×
          </button>
        </header>

        <div className="modal-cadena__contenido">
          <label className="modal-cadena__campo">
            <span>Nombre completo</span>
            <input
              type="text"
              value={nombre}
              onChange={onCambiarNombre}
              maxLength={80}
              required
              autoFocus
              placeholder="Ejemplo: Mercadona"
            />
          </label>

          <label className="modal-cadena__campo">
            <span>Acrónimo</span>
            <input
              type="text"
              value={acronimo}
              onChange={onCambiarAcronimo}
              maxLength={4}
              required
              placeholder="MERC"
            />
          </label>

          <p className="modal-cadena__ayuda">
            El acrónimo se genera automáticamente con las 4 primeras letras del
            nombre, pero puede modificarse manualmente.
          </p>
        </div>

        <footer className="modal-cadena__acciones">
          <button
            type="button"
            className="modal-cadena__btn modal-cadena__btn--secundario"
            onClick={onCerrar}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="modal-cadena__btn modal-cadena__btn--principal"
          >
            Guardar cadena
          </button>
        </footer>
      </form>
    </div>
  );
}