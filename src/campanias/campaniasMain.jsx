import { useState } from "react";
import "./campanias.css";

import { CampaniasGrid } from "./campaniasGrid";
import { CampaniasAcciones } from "./campaniasAcciones";
import { CampaniaDetalle } from "./campaniaDetalle";
import { FormularioCampania } from "./formularioCampania";

export function MainCampanias({
  manejaContenidoLateral,
  manejaContenidoInicial,
}) {
  const [campaniaSeleccionadaId, setCampaniaSeleccionadaId] = useState(null);
  const [mostrandoDetalle, setMostrandoDetalle] = useState(false);
  const [modoFormulario, setModoFormulario] = useState(null);
  const [modoSeleccionAccion, setModoSeleccionAccion] = useState(null);

  const [campanias, setCampanias] = useState([
    {
      id: 1,
      nombre: "Gran Recogida 2025",
      fechaInicio: "2025-11-11",
      fechaFin: "2025-11-15",
      activa: false,
      cadenas: [
        { id: 1, nombre: "Alcampo", participa: true },
        { id: 2, nombre: "Aldi", participa: true },
        { id: 3, nombre: "El Jamón", participa: true },
        { id: 4, nombre: "LIDL", participa: false },
        { id: 5, nombre: "Mercadona", participa: false },
        { id: 6, nombre: "El Corte Inglés", participa: false },
      ],
      coordinadores: [
        { id: 1, nombre: "Laura Sánchez Martín", participa: true },
        { id: 2, nombre: "Miguel Torres Ruiz", participa: true },
        { id: 3, nombre: "Carmen López García", participa: false },
        { id: 4, nombre: "Pablo Herrera Cano", participa: false },
      ],
    },
    {
      id: 2,
      nombre: "Operación Kilo Navidad",
      fechaInicio: "2025-12-01",
      fechaFin: "2025-12-20",
      activa: false,
      cadenas: [
        { id: 1, nombre: "Carrefour", participa: true },
        { id: 2, nombre: "DIA", participa: true },
        { id: 3, nombre: "Maskom", participa: true },
        { id: 4, nombre: "Covirán", participa: false },
        { id: 5, nombre: "Alcampo", participa: false },
      ],
      coordinadores: [
        { id: 1, nombre: "Javier Molina Pérez", participa: true },
        { id: 2, nombre: "Ana Romero Díaz", participa: true },
        { id: 3, nombre: "Raúl Benítez León", participa: false },
      ],
    },
    {
      id: 3,
      nombre: "Vuelta al Cole Solidaria",
      fechaInicio: "2026-09-02",
      fechaFin: "2026-09-18",
      activa: true,
      cadenas: [
        { id: 1, nombre: "Alcampo", participa: true },
        { id: 2, nombre: "Mercadona", participa: true },
        { id: 3, nombre: "Eroski", participa: false },
        { id: 4, nombre: "LIDL", participa: false },
      ],
      coordinadores: [
        { id: 1, nombre: "Pablo Herrera Cano", participa: true },
        { id: 2, nombre: "María Fernández Soto", participa: false },
        { id: 3, nombre: "Daniel Vega Ramos", participa: false },
      ],
    },
    {
      id: 4,
      nombre: "Banco de Alimentos Primavera",
      fechaInicio: "2026-03-10",
      fechaFin: "2026-12-25",
      activa: true,
      cadenas: [
        { id: 1, nombre: "LIDL", participa: true },
        { id: 2, nombre: "Carrefour", participa: true },
        { id: 3, nombre: "Mercadona", participa: true },
        { id: 4, nombre: "Aldi", participa: false },
      ],
      coordinadores: [
        { id: 1, nombre: "María Fernández Soto", participa: true },
        { id: 2, nombre: "Daniel Vega Ramos", participa: true },
        { id: 3, nombre: "Lucía Navarro Gil", participa: false },
      ],
    },
    {
      id: 5,
      nombre: "Campaña Empresas Colaboradoras",
      fechaInicio: "2026-04-01",
      fechaFin: "2026-04-30",
      activa: false,
      cadenas: [
        { id: 1, nombre: "Grupo Sol", participa: true },
        { id: 2, nombre: "Distribuciones Costa", participa: true },
        { id: 3, nombre: "Hermanos Ruiz", participa: false },
        { id: 4, nombre: "Central Alimentaria Sur", participa: false },
      ],
      coordinadores: [
        { id: 1, nombre: "Lucía Navarro Gil", participa: true },
        { id: 2, nombre: "Nerea Castillo Mora", participa: true },
        { id: 3, nombre: "Sergio Campos Ruiz", participa: false },
      ],
    },
    {
      id: 6,
      nombre: "Recogida Especial Verano",
      fechaInicio: "2026-07-05",
      fechaFin: "2026-07-19",
      activa: true,
      cadenas: [
        { id: 1, nombre: "DIA", participa: true },
        { id: 2, nombre: "Covirán", participa: true },
        { id: 3, nombre: "Maskom", participa: false },
        { id: 4, nombre: "Carrefour", participa: false },
      ],
      coordinadores: [
        { id: 1, nombre: "Sergio Campos Ruiz", participa: true },
        { id: 2, nombre: "Laura Sánchez Martín", participa: false },
        { id: 3, nombre: "Miguel Torres Ruiz", participa: false },
      ],
    },
  ]);

  const campaniasOrdenadas = [...campanias].sort((campaniaA, campaniaB) => {
    const fechaA = crearFechaLocalDesdeISO(campaniaA.fechaInicio);
    const fechaB = crearFechaLocalDesdeISO(campaniaB.fechaInicio);

    return fechaA - fechaB;
  });

  const campaniaSeleccionada = campanias.find((campania) => {
    return campania.id === campaniaSeleccionadaId;
  });

  const indiceCampaniaSeleccionada = campaniasOrdenadas.findIndex(
    (campania) => {
      return campania.id === campaniaSeleccionadaId;
    }
  );

  const manejarClickCampania = (idCampania) => {
    const campania = campanias.find((campaniaActual) => {
      return campaniaActual.id === idCampania;
    });

    if (!campania) {
      return;
    }

    setCampaniaSeleccionadaId(idCampania);

    if (modoSeleccionAccion === "editar") {
      setModoFormulario("editar");
      setModoSeleccionAccion(null);
      return;
    }

    if (modoSeleccionAccion === "eliminar") {
      eliminarCampaniaSeleccionada(campania);
      setModoSeleccionAccion(null);
      return;
    }

    setMostrandoDetalle(true);
  };

  const volverAlListado = () => {
    setMostrandoDetalle(false);
  };

  const irACampaniaAnterior = () => {
    if (indiceCampaniaSeleccionada <= 0) {
      return;
    }

    setCampaniaSeleccionadaId(
      campaniasOrdenadas[indiceCampaniaSeleccionada - 1].id
    );
  };

  const irACampaniaSiguiente = () => {
    if (indiceCampaniaSeleccionada >= campaniasOrdenadas.length - 1) {
      return;
    }

    setCampaniaSeleccionadaId(
      campaniasOrdenadas[indiceCampaniaSeleccionada + 1].id
    );
  };

  const generarCampania = () => {
    setModoSeleccionAccion(null);
    setMostrandoDetalle(false);
    setModoFormulario("crear");
  };

  const activarSeleccionParaModificar = () => {
    setMostrandoDetalle(false);
    setModoFormulario(null);
    setModoSeleccionAccion("editar");
  };

  const activarSeleccionParaEliminar = () => {
    setMostrandoDetalle(false);
    setModoFormulario(null);
    setModoSeleccionAccion("eliminar");
  };

  const cancelarSeleccionAccion = () => {
    setModoSeleccionAccion(null);
  };

  const eliminarCampaniaSeleccionada = (campania) => {
    const confirmada = confirm(
      `¿Seguro que quieres eliminar la campaña "${campania.nombre}"?`
    );

    if (!confirmada) {
      return;
    }

    setCampanias((campaniasActuales) =>
      campaniasActuales.filter((campaniaActual) => {
        return campaniaActual.id !== campania.id;
      })
    );

    setCampaniaSeleccionadaId(null);
    setMostrandoDetalle(false);
  };

  const cerrarFormularioCampania = () => {
    setModoFormulario(null);
  };

  const guardarCampania = (campaniaFormulario) => {
    if (modoFormulario === "crear") {
      const nuevoId =
        campanias.length === 0
          ? 1
          : Math.max(...campanias.map((campania) => campania.id)) + 1;

      const nuevaCampania = {
        ...campaniaFormulario,
        id: nuevoId,
        cadenas: [],
        coordinadores: [],
      };

      setCampanias((campaniasActuales) => [
        ...campaniasActuales,
        nuevaCampania,
      ]);

      setCampaniaSeleccionadaId(nuevoId);
    }

    if (modoFormulario === "editar") {
      setCampanias((campaniasActuales) =>
        campaniasActuales.map((campania) =>
          campania.id === campaniaFormulario.id
            ? {
                ...campania,
                ...campaniaFormulario,
                cadenas: campania.cadenas || [],
                coordinadores: campania.coordinadores || [],
              }
            : campania
        )
      );

      setCampaniaSeleccionadaId(campaniaFormulario.id);
    }

    setModoFormulario(null);
  };

  const obtenerMensajeSeleccion = () => {
    if (modoSeleccionAccion === "editar") {
      return "Selecciona una campaña para modificarla.";
    }

    if (modoSeleccionAccion === "eliminar") {
      return "Selecciona una campaña para eliminarla.";
    }

    return null;
  };

  if (mostrandoDetalle && campaniaSeleccionada) {
    return (
      <CampaniaDetalle
        campania={campaniaSeleccionada}
        puedeIrAnterior={indiceCampaniaSeleccionada > 0}
        puedeIrSiguiente={
          indiceCampaniaSeleccionada < campaniasOrdenadas.length - 1
        }
        onVolver={volverAlListado}
        onAnterior={irACampaniaAnterior}
        onSiguiente={irACampaniaSiguiente}
      />
    );
  }

  return (
    <main className="campanias">
      {modoSeleccionAccion !== null && (
        <div className="campanias__mensaje-seleccion">
          <span>{obtenerMensajeSeleccion()}</span>

          <button type="button" onClick={cancelarSeleccionAccion}>
            Cancelar
          </button>
        </div>
      )}

      <section className="campanias__contenido">
        <CampaniasGrid
          campanias={campaniasOrdenadas}
          campaniaSeleccionadaId={campaniaSeleccionadaId}
          modoSeleccionAccion={modoSeleccionAccion}
          onClickCampania={manejarClickCampania}
        />
      </section>

      <CampaniasAcciones
        onGenerarCampania={generarCampania}
        onModificarCampania={activarSeleccionParaModificar}
        onEliminarCampania={activarSeleccionParaEliminar}
      />

      {modoFormulario !== null && (
        <FormularioCampania
          modo={modoFormulario}
          campaniaInicial={
            modoFormulario === "editar" ? campaniaSeleccionada : null
          }
          onCerrar={cerrarFormularioCampania}
          onGuardar={guardarCampania}
        />
      )}
    </main>
  );
}

function crearFechaLocalDesdeISO(fechaISO) {
  if (!fechaISO || typeof fechaISO !== "string") {
    return new Date(0);
  }

  const partesFecha = fechaISO.split("-").map(Number);

  if (partesFecha.length !== 3 || partesFecha.some(Number.isNaN)) {
    return new Date(0);
  }

  const [anio, mes, dia] = partesFecha;

  return new Date(anio, mes - 1, dia);
}