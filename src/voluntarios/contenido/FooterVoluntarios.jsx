import { useState, useEffect } from "react";

export function FooterVoluntarios({
  filaSeleccionada,
  manejaContenidoInicial,
  manejaContenidoLateral,
}) {
  const [modoEdicion, setModoEdicion] = useState(false);

  //escucha si se cierra detalles con la X o si se guarda para salir del modficar
  useEffect(() => {
    const handleSalirEdicion = () => setModoEdicion(false);
    window.addEventListener("salirModoEdicion", handleSalirEdicion);
    window.addEventListener("cierrePanelDetalle", handleSalirEdicion);

    return () => {
      window.removeEventListener("salirModoEdicion", handleSalirEdicion);
      window.removeEventListener("cierrePanelDetalle", handleSalirEdicion);
    };
  }, []);

  //!!!!!!!!!!!!!si cambiamos de fila seleccionada, cortamos la edicion directamente
  useEffect(() => {
    setModoEdicion(false);
  }, [filaSeleccionada]);

  //FOOTER DEL MODIFICAR
  if (modoEdicion) {
    return (
      <div
        className="acciones-tabla"
        style={{
          borderTop: "1px solid #2c398b",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          backgroundColor: "#fff",
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          className="acciones-tabla__btn btn-cancelar"
          onClick={() => {
            setModoEdicion(false);
            manejaContenidoLateral("detalle-voluntario");
          }}
        >
          Cancelar
        </button>
        {/* MAGIA: Vincula este botón con el form del menú lateral */}
        <button
          type="submit"
          form="form-modificar"
          className="acciones-tabla__btn btn-anadir"
        >
          Guardar Cambios
        </button>
      </div>
    );
  }

  //FOOTER NORMAL
  return (
    <div className="voluntarios-footer">
      <button
        className="voluntarios-btn-footer"
        disabled={!filaSeleccionada}
        onClick={() => console.log("Lógica eliminar ID:", filaSeleccionada)}
      >
        Eliminar voluntario
      </button>

      <button
        className="voluntarios-btn-footer"
        disabled={!filaSeleccionada}
        onClick={() => {
          setModoEdicion(true); // Cambiamos el footer
          manejaContenidoLateral("modificar-voluntario"); // Abrimos el panel
        }}
      >
        Modificar voluntario
      </button>

      <button
        className="voluntarios-btn-footer"
        onClick={() => manejaContenidoInicial("aniadir-voluntario")}
      >
        Añadir voluntario
      </button>

      <button
        className="voluntarios-btn-footer btn-exportar"
        onClick={() => console.log("Descargar Excel")}
        title="Exportar tabla actual a CSV"
      >
        <img
          src="/assets/file_export.svg"
          alt="Exportar CSV"
          className="icono-exportar"
        />
      </button>
    </div>
  );
}
