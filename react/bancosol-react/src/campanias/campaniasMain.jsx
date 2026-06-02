import { useState } from "react";
import "./campanias.css";

import { CampaniasGrid } from "./CampaniasGrid";
import { CampaniasAcciones } from "./CampaniasAcciones";

export function MainCampanias({ manejaContenidoLateral, manejaContenidoInicial }) {
  const [campaniaSeleccionadaId, setCampaniaSeleccionadaId] = useState(null);

  const campanias = [
    {
      id: 1,
      nombre: "Gran Recogida 2025",
      fechaInicio: "2025-11-11",
      fechaFin: "2025-11-15",
      activa: true,
    },
    {
      id: 2,
      nombre: "Operación Kilo Navidad",
      fechaInicio: "2025-12-01",
      fechaFin: "2025-12-20",
      activa: true,
    },
    {
      id: 3,
      nombre: "Vuelta al Cole Solidaria",
      fechaInicio: "2025-09-02",
      fechaFin: "2025-09-18",
      activa: false,
    },
    {
      id: 4,
      nombre: "Banco de Alimentos Primavera",
      fechaInicio: "2026-03-10",
      fechaFin: "2026-03-25",
      activa: true,
    },
    {
      id: 5,
      nombre: "Campaña Empresas Colaboradoras",
      fechaInicio: "2026-04-01",
      fechaFin: "2026-04-30",
      activa: true,
    },
    {
      id: 6,
      nombre: "Recogida Especial Verano",
      fechaInicio: "2026-07-05",
      fechaFin: "2026-07-19",
      activa: false,
    },
  ];

  const seleccionarCampania = (idCampania) => {
    setCampaniaSeleccionadaId(idCampania);
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