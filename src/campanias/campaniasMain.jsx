import { useEffect, useState } from "react";
import "./campanias.css";

import { CampaniasGrid } from "./campaniasGrid";
import { CampaniasAcciones } from "./campaniasAcciones";
import { CampaniaDetalle } from "./campaniaDetalle";
import { FormularioCampania } from "./formularioCampania";
import { obtenerCadenas } from "../api/cadenasApi";
import { obtenerCoordinadores } from "../api/coordinadoresApi";
import {
  actualizarCampania,
  actualizarCadenasCampania,
  actualizarCoordinadoresCampania,
  crearCampania,
  eliminarCampania,
  obtenerCampanias,
} from "../api/campaniasApi";

export function MainCampanias({
  manejaContenidoLateral,
  manejaContenidoInicial,
}) {
  const [campanias, setCampanias] = useState([]);
  const [cadenasDisponibles, setCadenasDisponibles] = useState([]);
  const [coordinadoresDisponibles, setCoordinadoresDisponibles] = useState([]);
  const [campaniaSeleccionadaId, setCampaniaSeleccionadaId] = useState(null);
  const [campaniaFormulario, setCampaniaFormulario] = useState(null);
  const [mostrandoDetalle, setMostrandoDetalle] = useState(false);
  const [modoFormulario, setModoFormulario] = useState(null);
  const [modoSeleccionAccion, setModoSeleccionAccion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarCampanias();
  }, []);

  const cargarCampanias = async () => {
    try {
      setCargando(true);
      setError("");

      const [datosCampanias, datosCadenas, datosCoordinadores] =
        await Promise.all([
          obtenerCampanias(),
          obtenerCadenas(),
          obtenerCoordinadores(),
        ]);

      const cadenasNormalizadas = normalizarCadenas(datosCadenas);
      const coordinadoresNormalizados =
        normalizarCoordinadores(datosCoordinadores);

      setCadenasDisponibles(cadenasNormalizadas);
      setCoordinadoresDisponibles(coordinadoresNormalizados);

      setCampanias(
        normalizarCampanias(
          datosCampanias,
          cadenasNormalizadas,
          coordinadoresNormalizados
        )
      );
    } catch (errorCarga) {
      console.error(errorCarga);
      setError("No se han podido cargar las campañas desde la API.");
    } finally {
      setCargando(false);
    }
  };

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
      setCampaniaFormulario(campania);
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
    setCampaniaFormulario(null);
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

  const eliminarCampaniaSeleccionada = async (campania) => {
    const confirmada = confirm(
      `¿Seguro que quieres eliminar la campaña "${campania.nombre}"?`
    );

    if (!confirmada) {
      return;
    }

    try {
      setError("");

      await eliminarCampania(campania.id);

      setCampanias((campaniasActuales) =>
        campaniasActuales.filter((campaniaActual) => {
          return campaniaActual.id !== campania.id;
        })
      );

      setCampaniaSeleccionadaId(null);
      setMostrandoDetalle(false);
    } catch (errorEliminacion) {
      console.error(errorEliminacion);
      setError("No se ha podido eliminar la campaña.");
    }
  };

  const cerrarFormularioCampania = () => {
    setModoFormulario(null);
    setCampaniaFormulario(null);
  };

  const guardarCampania = async (campaniaFormulario) => {
    try {
      setError("");

      const campaniaParaApi = prepararCampaniaParaApi(campaniaFormulario);

      if (modoFormulario === "crear") {
        const campaniaCreada = await crearCampania(campaniaParaApi);
        const nuevaCampaniaNormalizada = normalizarCampania(
          campaniaCreada,
          cadenasDisponibles,
          coordinadoresDisponibles
        );

        setCampanias((campaniasActuales) => [
          ...campaniasActuales,
          nuevaCampaniaNormalizada,
        ]);

        setCampaniaSeleccionadaId(nuevaCampaniaNormalizada.id);
      }

      if (modoFormulario === "editar") {
        const campaniaActualizada = await actualizarCampania(
          campaniaFormulario.id,
          campaniaParaApi
        );

        const campaniaActualizadaNormalizada = normalizarCampania(
          campaniaActualizada,
          cadenasDisponibles,
          coordinadoresDisponibles
        );

        setCampanias((campaniasActuales) =>
          campaniasActuales.map((campania) =>
            campania.id === campaniaActualizadaNormalizada.id
              ? campaniaActualizadaNormalizada
              : campania
          )
        );

        setCampaniaSeleccionadaId(campaniaActualizadaNormalizada.id);
      }

      setModoFormulario(null);
      setCampaniaFormulario(null);
    } catch (errorGuardado) {
      console.error(errorGuardado);
      setError("No se ha podido guardar la campaña.");
    }
  };

  const actualizarCadenasDeCampania = async (idCampania, idsCadenas) => {
    try {
      setError("");

      const campaniaActualizada = await actualizarCadenasCampania(
        idCampania,
        idsCadenas
      );

      actualizarCampaniaEnEstado(campaniaActualizada);
    } catch (errorGuardado) {
      console.error(errorGuardado);
      setError("No se han podido guardar las cadenas de la campaña.");
      throw errorGuardado;
    }
  };

  const actualizarCoordinadoresDeCampania = async (
    idCampania,
    idsCoordinadores
  ) => {
    try {
      setError("");

      const campaniaActualizada = await actualizarCoordinadoresCampania(
        idCampania,
        idsCoordinadores
      );

      actualizarCampaniaEnEstado(campaniaActualizada);
    } catch (errorGuardado) {
      console.error(errorGuardado);
      setError("No se han podido guardar los coordinadores de la campaña.");
      throw errorGuardado;
    }
  };

  const actualizarCampaniaEnEstado = (campaniaActualizada) => {
    const campaniaNormalizada = normalizarCampania(
      campaniaActualizada,
      cadenasDisponibles,
      coordinadoresDisponibles
    );

    setCampanias((campaniasActuales) =>
      campaniasActuales.map((campania) =>
        campania.id === campaniaNormalizada.id ? campaniaNormalizada : campania
      )
    );

    setCampaniaSeleccionadaId(campaniaNormalizada.id);
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

  if (cargando) {
    return (
      <main className="campanias">
        <p className="campanias__mensaje-seleccion">Cargando campañas...</p>
      </main>
    );
  }

  if (mostrandoDetalle && campaniaSeleccionada) {
    return (
      <>
        {error && <p className="campanias__mensaje-seleccion">{error}</p>}

        <CampaniaDetalle
          campania={campaniaSeleccionada}
          puedeIrAnterior={indiceCampaniaSeleccionada > 0}
          puedeIrSiguiente={
            indiceCampaniaSeleccionada < campaniasOrdenadas.length - 1
          }
          onVolver={volverAlListado}
          onAnterior={irACampaniaAnterior}
          onSiguiente={irACampaniaSiguiente}
          onGuardarCadenas={actualizarCadenasDeCampania}
          onGuardarCoordinadores={actualizarCoordinadoresDeCampania}
        />
      </>
    );
  }

  return (
    <main className="campanias">
      {error && <p className="campanias__mensaje-seleccion">{error}</p>}

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
          campaniaInicial={modoFormulario === "editar" ? campaniaFormulario : null}
          onCerrar={cerrarFormularioCampania}
          onGuardar={guardarCampania}
        />
      )}
    </main>
  );
}

function prepararCampaniaParaApi(campania) {
  return {
    nombre: campania.nombre,
    fechaInicio: campania.fechaInicio,
    fechaFin: campania.fechaFin,
    activa: campania.activa,
    idsCadenas: obtenerIdsParticipantes(campania.cadenas),
    idsCoordinadores: obtenerIdsParticipantes(campania.coordinadores),
  };
}

function obtenerIdsParticipantes(elementos) {
  if (!Array.isArray(elementos)) {
    return [];
  }

  return elementos
    .filter((elemento) => elemento.participa)
    .map((elemento) => elemento.id);
}

function normalizarCampanias(
  campanias,
  cadenasDisponibles,
  coordinadoresDisponibles
) {
  if (!Array.isArray(campanias)) {
    return [];
  }

  return campanias.map((campania) =>
    normalizarCampania(
      campania,
      cadenasDisponibles,
      coordinadoresDisponibles
    )
  );
}

function normalizarCampania(
  campania,
  cadenasDisponibles = [],
  coordinadoresDisponibles = []
) {
  const idsCadenas = Array.isArray(campania?.idsCadenas)
    ? campania.idsCadenas
    : [];

  const idsCoordinadores = Array.isArray(campania?.idsCoordinadores)
    ? campania.idsCoordinadores
    : [];

  return {
    ...campania,
    cadenas: construirCadenasDeCampania(cadenasDisponibles, idsCadenas),
    coordinadores: construirCoordinadoresDeCampania(
      coordinadoresDisponibles,
      idsCoordinadores
    ),
  };
}

function normalizarCadenas(cadenas) {
  if (!Array.isArray(cadenas)) {
    return [];
  }

  return cadenas.map((cadena) => ({
    id: cadena.id,
    nombre: cadena.nombre,
    codigo: cadena.codigo,
  }));
}

function normalizarCoordinadores(coordinadores) {
  if (!Array.isArray(coordinadores)) {
    return [];
  }

  return coordinadores.map((coordinador) => ({
    id: coordinador.id,
    nombre:
      coordinador.nombre ??
      coordinador.nombreContacto ??
      coordinador.emailContacto ??
      `Coordinador ${coordinador.id}`,
  }));
}

function construirCadenasDeCampania(cadenasDisponibles, idsCadenasCampania) {
  if (!Array.isArray(cadenasDisponibles)) {
    return [];
  }

  return cadenasDisponibles.map((cadena) => ({
    ...cadena,
    participa: idsCadenasCampania.includes(cadena.id),
  }));
}

function construirCoordinadoresDeCampania(
  coordinadoresDisponibles,
  idsCoordinadoresCampania
) {
  if (!Array.isArray(coordinadoresDisponibles)) {
    return [];
  }

  return coordinadoresDisponibles.map((coordinador) => ({
    ...coordinador,
    participa: idsCoordinadoresCampania.includes(coordinador.id),
  }));
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