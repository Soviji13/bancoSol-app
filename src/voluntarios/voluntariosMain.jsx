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
  rol
}) {
  //guardar la campania q el usuario tiene seleccionada
  const [campaniaActiva, setCampaniaActiva] = useState(() => {
    const guardada = localStorage.getItem("campaniaActivaId");
    const nombreGuardado = localStorage.getItem("campaniaActivaNombre");

    // Si hay guardada la usamos, si no, la dejamos en nulo para obligar a elegir
    return guardada
      ? {
          id: parseInt(guardada),
          nombre: nombreGuardado || "Campaña Seleccionada",
        }
      : { id: null, nombre: "Seleccione una campaña..." };
  });

  //lista voluntarios para la tabla
  const [voluntarios, setVoluntarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);

  // si no hay campaña activa guardada en cache, el modal se abre obligatoriamente al entrar
  const [modalCampaniasAbierto, setModalCampaniasAbierto] = useState(() => {
    return !localStorage.getItem("campaniaActivaId");
  });

  //funcion para pedir los voluntarios al backend con los filtros
  const cargarVoluntarios = async () => {
    // evitamos pedir datos a la API si todavía no han elegido campaña
    if (!campaniaActiva.id) {
      setCargando(false);
      return;
    }

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
    if (campaniaActiva.id) {
      //fuardamos SIEMPRE campaña activa en localStorage, incluso si el usuario no la ha tocado
      localStorage.setItem("campaniaActivaId", campaniaActiva.id);
      localStorage.setItem("campaniaActivaNombre", campaniaActiva.nombre);
      cargarVoluntarios();
    }
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
    setModalCampaniasAbierto(false);
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
        voluntarios={voluntarios}
      />
      <div className="voluntarios-tabla-scroll">
        {/*si esta cargando muestra el cargando, si no hay campaña pide que seleccione, sino pinta tabla*/}
        {cargando ? (
          <div className="texto-cargando">
            Cargando voluntarios de la campaña...
          </div>
        ) : !campaniaActiva.id ? (
          <div className="texto-cargando">
            Esperando a que seleccione una campaña...
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
        rol={rol}
      />
      <ModalCampanias
        isOpen={modalCampaniasAbierto}
        onClose={() => {
          //OJO:evitamos cierre del modal si no hay ninguna campaña seleccionada todavia
          if (campaniaActiva.id) {
            setModalCampaniasAbierto(false);
          } else {
            alert("Por favor, selecciona una campaña para continuar.");
          }
        }}
        campaniaActivaId={campaniaActiva.id}
        onSelectCampania={handleCambioCampania}
      />
    </section>
  );
}
