import { useState, useEffect } from "react";
import { HeaderVoluntarios } from "./contenido/HeaderVoluntarios";
import { TablaVoluntarios } from "./contenido/TablaVoluntarios";
import { FooterVoluntarios } from "./contenido/FooterVoluntarios";
import { ModalCampanias } from "./usosVarios/ModalCampanias";
import "./contenido/voluntarioContenido.css";
import { obtenerVoluntarios } from "../api/voluntariosApi";

export function MainVoluntarios({
  manejaContenidoLateral,
  manejaContenidoInicial,
}) {
  //guardar la campania q el usuario tiene seleccionada
  const [campaniaActiva, setCampaniaActiva] = useState(() => {
    const guardada = localStorage.getItem("campaniaActivaId");
    const nombreGuardado = localStorage.getItem("campaniaActivaNombre");
    return guardada
      ? {
          id: parseInt(guardada),
          nombre: nombreGuardado || "Campaña Seleccionada",
        }
      : { nombre: "SELECCIONE UNA CAMPAÑA" };
  });

  //lista voluntarios para la tabla
  const [voluntarios, setVoluntarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [modalCampaniasAbierto, setModalCampaniasAbierto] = useState(false);

  //funcion para pedir los voluntarios al backend con los filtros
  const cargarVoluntarios = async () => {
    setCargando(true);
    try {
      //leemos de la cache si hay filtros aplicados desde el panel izquierdo
      const filtrosGuardados =
        JSON.parse(localStorage.getItem("filtrosVoluntarios")) || {};

      //los mandamos limpios hacia la API
      const data = await obtenerVoluntarios(
        campaniaActiva.id,
        filtrosGuardados,
      );
      setVoluntarios(data);
    } catch (error) {
      console.error("Error cargando voluntarios:", error);
      setVoluntarios([]);
    } finally {
      setCargando(false);
    }
  };

  //se activa cada vez q cambia el id de la campania activa (y guarda en cache)
  useEffect(() => {
    //guardamos SIEMPRE la campaña activa en localStorage para que el añadir/modificar sepan cual es, incluso si el usuario no la ha tocado
    localStorage.setItem("campaniaActivaId", campaniaActiva.id);
    localStorage.setItem("campaniaActivaNombre", campaniaActiva.nombre);

    cargarVoluntarios();
  }, [campaniaActiva.id]);

  //escucha cuando algun componente pide refrescar la tabla
  useEffect(() => {
    window.addEventListener("refrescarTablaVoluntarios", cargarVoluntarios);

    //escucha tmb si aplican filtros desde el panel lateral
    window.addEventListener("cambioFiltrosVoluntarios", cargarVoluntarios);

    return () => {
      window.removeEventListener(
        "refrescarTablaVoluntarios",
        cargarVoluntarios,
      );
      window.removeEventListener("cambioFiltrosVoluntarios", cargarVoluntarios);
    };
  }, [campaniaActiva.id]);

  //cuando el usuario elige otra campania en el modal cambiamos estado
  const handleCambioCampania = (nuevaCampania) => {
    setCampaniaActiva(nuevaCampania);
  };

  //cuando seleccionamos un voluntario en la tabla llama a detallevoluntario
  const handleSeleccionarFila = (id) => {
    setFilaSeleccionada(id);
    localStorage.setItem("voluntarioSeleccionadoId", id);
    manejaContenidoLateral("detalle-voluntario");
    window.dispatchEvent(new Event("cambioVoluntarioTabla"));
  };

  //limpiar la seleccion de la fila si pinchas X en menulateral a traves de evetno global
  useEffect(() => {
    const handleCierrePanel = () => setFilaSeleccionada(null);
    window.addEventListener("cierrePanelDetalle", handleCierrePanel);
    return () =>
      window.removeEventListener("cierrePanelDetalle", handleCierrePanel);
  }, []);

  return (
    <section className="voluntarios-contenedor">
      <HeaderVoluntarios
        campaniaActiva={campaniaActiva}
        manejaContenidoLateral={manejaContenidoLateral}
        onAbrirModal={() => setModalCampaniasAbierto(true)}
      />

      <div className="voluntarios-tabla-scroll">
        {/*si esta cargando muestra el cargando, sino pinta tabla*/}
        {cargando ? (
          <div className="texto-cargando">
            Cargando voluntarios de la campaña...
          </div>
        ) : (
          <TablaVoluntarios
            voluntarios={voluntarios}
            filaSeleccionada={filaSeleccionada}
            setFilaSeleccionada={handleSeleccionarFila}
          />
        )}
      </div>

      <FooterVoluntarios
        filaSeleccionada={filaSeleccionada}
        manejaContenidoInicial={manejaContenidoInicial}
        manejaContenidoLateral={manejaContenidoLateral}
        voluntarios={voluntarios}
        campaniaActivaNombre={campaniaActiva.nombre}
      />

      <ModalCampanias
        isOpen={modalCampaniasAbierto}
        onClose={() => setModalCampaniasAbierto(false)}
        campaniaActivaId={campaniaActiva.id}
        onSelectCampania={handleCambioCampania}
      />
    </section>
  );
}
