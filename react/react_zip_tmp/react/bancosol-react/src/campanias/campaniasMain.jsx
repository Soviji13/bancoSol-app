import { useState } from "react";
import "./campanias.css";

import { CampaniasGrid } from "./campaniasGrid";
import { CampaniasAcciones } from "./campaniasAcciones";
import { CampaniaDetalle } from "./campaniaDetalle";

export function MainCampanias({ manejaContenidoLateral, manejaContenidoInicial }) {
  const [campaniaSeleccionadaId, setCampaniaSeleccionadaId] = useState(null);
  const [mostrandoDetalle, setMostrandoDetalle] = useState(false);

  const campanias = [
    {
      id: 1,
      nombre: "Gran Recogida 2025",
      fechaInicio: "2025-11-11",
      fechaFin: "2025-11-15",
      activa: true,
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
      activa: true,
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
      fechaInicio: "2025-09-02",
      fechaFin: "2025-09-18",
      activa: false,
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
      fechaFin: "2026-03-25",
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
      activa: true,
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
      activa: false,
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
  ];

  const campaniaSeleccionada = campanias.find(
    (campania) => campania.id === campaniaSeleccionadaId
  );

  const indiceCampaniaSeleccionada = campanias.findIndex(
    (campania) => campania.id === campaniaSeleccionadaId
  );

  const seleccionarCampania = (idCampania) => {
    setCampaniaSeleccionadaId(idCampania);
    setMostrandoDetalle(true);
  };

  const volverAlListado = () => {
    setMostrandoDetalle(false);
  };

  const irACampaniaAnterior = () => {
    if (indiceCampaniaSeleccionada <= 0) {
      return;
    }

    setCampaniaSeleccionadaId(campanias[indiceCampaniaSeleccionada - 1].id);
  };

  const irACampaniaSiguiente = () => {
    if (indiceCampaniaSeleccionada >= campanias.length - 1) {
      return;
    }

    setCampaniaSeleccionadaId(campanias[indiceCampaniaSeleccionada + 1].id);
  };

  const generarCampania = () => {
    console.log("Generar campaña");
  };

  const modificarCampania = () => {
    if (campaniaSeleccionadaId === null) {
      console.log("No hay ninguna campaña seleccionada");
      return;
    }

    console.log("Modificar campaña:", campaniaSeleccionadaId);
  };

  const eliminarCampania = () => {
    if (campaniaSeleccionadaId === null) {
      console.log("No hay ninguna campaña seleccionada");
      return;
    }

    console.log("Eliminar campaña:", campaniaSeleccionadaId);
  };

  if (mostrandoDetalle && campaniaSeleccionada) {
    return (
      <CampaniaDetalle
      campania={campaniaSeleccionada}
      puedeIrAnterior={indiceCampaniaSeleccionada > 0}
      puedeIrSiguiente={indiceCampaniaSeleccionada < campanias.length - 1}
      onVolver={volverAlListado}
      onAnterior={irACampaniaAnterior}
      onSiguiente={irACampaniaSiguiente}
    />
    );
  }

  return (
    <main className="campanias">
      <section className="campanias__contenido">
        <CampaniasGrid
          campanias={campanias}
          campaniaSeleccionadaId={campaniaSeleccionadaId}
          onSeleccionarCampania={seleccionarCampania}
        />
      </section>

      <CampaniasAcciones
        onGenerarCampania={generarCampania}
        onModificarCampania={modificarCampania}
        onEliminarCampania={eliminarCampania}
      />
    </main>
  );
}