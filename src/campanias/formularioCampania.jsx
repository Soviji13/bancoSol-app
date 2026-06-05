import { useState } from "react";

export function FormularioCampania({
  modo,
  campaniaInicial,
  onCerrar,
  onGuardar,
}) {
  const [nombre, setNombre] = useState(campaniaInicial?.nombre || "");
  const [fechaInicio, setFechaInicio] = useState(
    campaniaInicial?.fechaInicio || ""
  );
  const [fechaFin, setFechaFin] = useState(campaniaInicial?.fechaFin || "");
  const [activa, setActiva] = useState(campaniaInicial?.activa ?? true);

  const esEdicion = modo === "editar";

  const manejarSubmit = (evento) => {
    evento.preventDefault();

    const nombreLimpio = nombre.trim();

    if (!nombreLimpio || !fechaInicio || !fechaFin) {
      alert("Rellena todos los campos obligatorios.");
      return;
    }

    if (fechaFin < fechaInicio) {
      alert("La fecha de fin no puede ser anterior a la fecha de inicio.");
      return;
    }

    onGuardar({
      id: campaniaInicial?.id,
      nombre: nombreLimpio,
      fechaInicio,
      fechaFin,
      activa,
      cadenas: campaniaInicial?.cadenas || [],
      coordinadores: campaniaInicial?.coordinadores || [],
    });
  };

  return (
    <div className="formulario-campania__fondo">
      <section className="formulario-campania">
        <header className="formulario-campania__cabecera">
          <h2>{esEdicion ? "Modificar campaña" : "Generar campaña"}</h2>

          <button
            type="button"
            className="formulario-campania__cerrar"
            onClick={onCerrar}
            aria-label="Cerrar formulario"
          >
            ×
          </button>
        </header>

        <form className="formulario-campania__form" onSubmit={manejarSubmit}>
          <div className="formulario-campania__campo">
            <label htmlFor="nombre-campania">Nombre</label>
            <input
              id="nombre-campania"
              type="text"
              value={nombre}
              onChange={(evento) => setNombre(evento.target.value)}
              required
            />
          </div>

          <div className="formulario-campania__campo">
            <label htmlFor="fecha-inicio-campania">Fecha de inicio</label>
            <input
              id="fecha-inicio-campania"
              type="date"
              value={fechaInicio}
              onChange={(evento) => setFechaInicio(evento.target.value)}
              required
            />
          </div>

          <div className="formulario-campania__campo">
            <label htmlFor="fecha-fin-campania">Fecha de fin</label>
            <input
              id="fecha-fin-campania"
              type="date"
              value={fechaFin}
              onChange={(evento) => setFechaFin(evento.target.value)}
              required
            />
          </div>

          <label className="formulario-campania__checkbox">
            <input
              type="checkbox"
              checked={activa}
              onChange={(evento) => setActiva(evento.target.checked)}
            />
            Campaña activa
          </label>

          <div className="formulario-campania__acciones">
            <button
              type="button"
              className="formulario-campania__cancelar"
              onClick={onCerrar}
            >
              Cancelar
            </button>

            <button type="submit" className="formulario-campania__guardar">
              {esEdicion ? "Guardar cambios" : "Crear campaña"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}