export function FormularioCrearCadena({
  nombre,
  acronimo,
  error = "",
  guardando = false,
  onCambiarNombre,
  onCambiarAcronimo,
  onCerrar,
  onGuardar,
}) {
  const manejarSubmit = (evento) => {
    evento.preventDefault();
    onGuardar();
  };

  return (
    <div className="modal-cadena">
      <div className="modal-cadena__fondo" onClick={onCerrar}></div>

      <form
        className="modal-cadena__formulario"
        onSubmit={manejarSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-cadena-titulo"
      >
        <header className="modal-cadena__cabecera">
          <h2 id="modal-cadena-titulo">Crear cadena</h2>

          <button
            type="button"
            className="modal-cadena__cerrar"
            onClick={onCerrar}
            aria-label="Cerrar formulario"
            disabled={guardando}
          >
            ×
          </button>
        </header>

        <div className="modal-cadena__contenido">
          {error && <p className="modal-cadena__error">{error}</p>}

          <label className="modal-cadena__campo">
            <span>Nombre completo</span>
            <input
              type="text"
              value={nombre}
              onChange={onCambiarNombre}
              placeholder="Ejemplo: Mercadona"
              disabled={guardando}
              required
            />
          </label>

          <label className="modal-cadena__campo">
            <span>Acrónimo</span>
            <input
              type="text"
              value={acronimo}
              onChange={onCambiarAcronimo}
              placeholder="MERC"
              maxLength={4}
              disabled={guardando}
              required
            />
          </label>

          <p className="modal-cadena__ayuda">
            El acrónimo se genera automáticamente con las primeras letras del
            nombre, pero puedes modificarlo manualmente.
          </p>
        </div>

        <div className="modal-cadena__acciones">
          <button
            type="button"
            className="modal-cadena__btn modal-cadena__btn--secundario"
            onClick={onCerrar}
            disabled={guardando}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="modal-cadena__btn modal-cadena__btn--principal"
            disabled={guardando}
          >
            {guardando ? "Guardando..." : "Guardar cadena"}
          </button>
        </div>
      </form>
    </div>
  );
}
