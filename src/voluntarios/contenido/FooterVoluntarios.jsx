import { useState, useEffect } from "react";
import { eliminarVoluntario } from "../../api/voluntariosApi";
import { exportarVoluntariosCsv } from "../usosVarios/exportarVoluntariosCsv";

export function FooterVoluntarios({
  filaSeleccionada,
  manejaContenidoInicial,
  manejaContenidoLateral,
  voluntarios, // <-- Lista actual para exportar
  campaniaActivaNombre, // <-- Nombre para el archivo
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

  //logica pra el eliminar
  const handleEliminar = async () => {
    if (!filaSeleccionada) return;

    if (
      window.confirm(
        "¿Seguro que deseas eliminar permanentemente a este voluntario y todos sus turnos?",
      )
    ) {
      try {
        await eliminarVoluntario(filaSeleccionada);
        window.dispatchEvent(new Event("refrescarTablaVoluntarios")); //actualiza la tabla principal
        manejaContenidoLateral("menuLateral"); //cierra el panel de detalle si estaba abierto
      } catch (error) {
        console.error("Error al eliminar el voluntario:", error);
        alert("Hubo un error al eliminar el voluntario en el servidor.");
      }
    }
  };

  //FOOTER DEL MODIFICAR
  if (modoEdicion) {
    return (
      <div className="acciones-tabla">
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
        onClick={handleEliminar}
      >
        Eliminar voluntario
      </button>

      <button
        className="voluntarios-btn-footer"
        disabled={!filaSeleccionada}
        onClick={() => {
          setModoEdicion(true); //cambiamos el footer
          manejaContenidoLateral("modificar-voluntario"); //abrimos el panel
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
        onClick={() =>
          exportarVoluntariosCsv(voluntarios, campaniaActivaNombre)
        }
      >
        <img src="/assets/file_export.svg" className="icono-exportar" />
      </button>
    </div>
  );
}
