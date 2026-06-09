export function FormularioCrearCadena({
  nombre,
  acronimo,
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

      <form className="modal-cadena__formulario" onSubmit={manejarSubmit}>
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
              placeholder="Ejemplo: Mercadona"
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
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="modal-cadena__btn modal-cadena__btn--principal"
          >
            Guardar cadena
          </button>
        </div>
      </form>
    </div>
  );
}