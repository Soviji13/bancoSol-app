import { useState, useEffect } from "react";
import { HeaderVoluntarios } from "./contenido/HeaderVoluntarios";
import { TablaVoluntarios } from "./contenido/TablaVoluntarios";
import { FooterVoluntarios } from "./contenido/FooterVoluntarios";
import { ModalCampanias } from "./usosVarios/ModalCampanias";
import { mockVoluntarios } from "./mockDataVoluntarios";
import "./contenido/voluntarioContenido.css";

export function MainVoluntarios({
  manejaContenidoLateral,
  manejaContenidoInicial,
}) {
  //guardar la campania q el usuario tiene seleccionada (empieza con la de por defecto posteriormente con la api habra q coger la activa por deefecto!!!)
  const [campaniaActiva, setCampaniaActiva] = useState({
    id: 3,
    nombre: "Gran Recogida (Mock)",
  });

  //lista voluntarios para la tabla
  const [voluntarios, setVoluntarios] = useState([]);

  //la funcion cargar (de momento solo simula un tiempo)
  const [cargando, setCargando] = useState(true);

  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [modalCampaniasAbierto, setModalCampaniasAbierto] = useState(false);

  // se activa cada vez q cambia el id de la campania activa
  useEffect(() => {
    setCargando(true); //enciende funcion cargar

    //simulamos q los datos tardan x tiempo en llegar
    const temporizador = setTimeout(() => {
      setVoluntarios(mockVoluntarios); //guardamos los datos en la memoria
      setCargando(false); //apagamos el texto de carga
    }, 1000);

    //funcion de limpieza para eliminar el temporizador si cambiamos de pantalla!!!!
    return () => clearTimeout(temporizador);
  }, [campaniaActiva.id]); //el trigger del cambio (cuando cambia la campaña)

  //cuando el usuario elige otra campania en el modal cambiamos estado
  const handleCambioCampania = (nuevaCampania) => {
    setCampaniaActiva(nuevaCampania);
  };

  //cuando seleccionamos un voluntario en la tabla llama a detallevoluntario EN EL MENU LATERAL
  const handleSeleccionarFila = (id) => {
    setFilaSeleccionada(id);
    localStorage.setItem("voluntarioSeleccionadoId", id);
    manejaContenidoLateral("detalle-voluntario");

    window.dispatchEvent(new Event("cambioVoluntarioTabla")); //evento global q escucha el menu para cambiara el vol si se selecciona otra fila
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
          <div name="texto-cargando">Cargando voluntarios de la campaña...</div>
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
