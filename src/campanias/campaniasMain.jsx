import { useEffect, useMemo, useState } from "react";
import "./campanias.css";

import { CampaniasGrid } from "./campaniasGrid";
import { CampaniasAcciones } from "./campaniasAcciones";
import { CampaniaDetalle } from "./campaniaDetalle";
import { FormularioCampania } from "./formularioCampania";
import { crearCadena, obtenerCadenas } from "../api/cadenasApi";
import { obtenerCoordinadores } from "../api/coordinadoresApi";
import {
  actualizarCampania,
  actualizarCadenasCampania,
  actualizarCoordinadoresCampania,
  crearCampania,
  eliminarCampania,
  obtenerCampanias,
} from "../api/campaniasApi";
import { compararCampaniasPorFechaInicio } from "./utils/fechas";
import {
  normalizarCadena,
  normalizarCadenas,
  normalizarCampania,
  normalizarCampanias,
  normalizarCoordinadores,
  prepararCampaniaParaApi,
} from "./utils/campaniasMapper";

export function MainCampanias() {
  const [campanias, setCampanias] = useState([]);
  const [cadenasDisponibles, setCadenasDisponibles] = useState([]);
  const [coordinadoresDisponibles, setCoordinadoresDisponibles] = useState([]);

  const [campaniaSeleccionadaId, setCampaniaSeleccionadaId] = useState(null);
  const [campaniaFormulario, setCampaniaFormulario] = useState(null);
  const [mostrandoDetalle, setMostrandoDetalle] = useState(false);
  const [modoFormulario, setModoFormulario] = useState(null);
  const [modoSeleccionAccion, setModoSeleccionAccion] = useState(null);

  const [cargando, setCargando] = useState(true);
  const [guardandoFormulario, setGuardandoFormulario] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let componenteActivo = true;

    const cargarDatosIniciales = async () => {
      try {
        setCargando(true);
        setError("");

        const [datosCampanias, datosCadenas, datosCoordinadores] =
          await Promise.all([
            obtenerCampanias(),
            obtenerCadenas(),
            obtenerCoordinadores(),
          ]);

        if (!componenteActivo) {
          return;
        }

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

        if (componenteActivo) {
          setError("No se han podido cargar las campañas desde la API.");
        }
      } finally {
        if (componenteActivo) {
          setCargando(false);
        }
      }
    };

    cargarDatosIniciales();

    return () => {
      componenteActivo = false;
    };
  }, []);

  const campaniasOrdenadas = useMemo(() => {
    return [...campanias].sort(compararCampaniasPorFechaInicio);
  }, [campanias]);

  const campaniaSeleccionada = useMemo(() => {
    return campanias.find((campania) => {
      return campania.id === campaniaSeleccionadaId;
    });
  }, [campanias, campaniaSeleccionadaId]);

  const indiceCampaniaSeleccionada = useMemo(() => {
    return campaniasOrdenadas.findIndex((campania) => {
      return campania.id === campaniaSeleccionadaId;
    });
  }, [campaniasOrdenadas, campaniaSeleccionadaId]);

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
    if (guardandoFormulario) {
      return;
    }

    setModoFormulario(null);
    setCampaniaFormulario(null);
  };

  const guardarCampania = async (campaniaFormulario) => {
    try {
      setGuardandoFormulario(true);
      setError("");

      const campaniaParaApi = prepararCampaniaParaApi(campaniaFormulario);

      if (modoFormulario === "crear") {
        await crearNuevaCampania(campaniaParaApi);
      }

      if (modoFormulario === "editar") {
        await editarCampaniaExistente(campaniaFormulario.id, campaniaParaApi);
      }

      setModoFormulario(null);
      setCampaniaFormulario(null);
    } catch (errorGuardado) {
      console.error(errorGuardado);
      setError(obtenerMensajeErrorGuardado(errorGuardado));
    } finally {
      setGuardandoFormulario(false);
    }
  };

  const crearNuevaCampania = async (campaniaParaApi) => {
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
  };

  const editarCampaniaExistente = async (idCampania, campaniaParaApi) => {
    const campaniaActualizada = await actualizarCampania(
      idCampania,
      campaniaParaApi
    );

    actualizarCampaniaEnEstado(campaniaActualizada);
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

  const crearNuevaCadena = async (datosCadena) => {
    const cadenaCreada = await crearCadena(datosCadena);
    registrarCadenaCreada(cadenaCreada);

    return cadenaCreada;
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

  const registrarCadenaCreada = (cadenaCreada) => {
    const nuevaCadena = normalizarCadena(cadenaCreada);

    setCadenasDisponibles((cadenasActuales) =>
      insertarCadenaSinDuplicar(cadenasActuales, nuevaCadena)
    );

    setCampanias((campaniasActuales) =>
      campaniasActuales.map((campania) => ({
        ...campania,
        cadenas: insertarCadenaSinDuplicar(campania.cadenas ?? [], {
          ...nuevaCadena,
          participa: false,
        }),
      }))
    );
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
          onCrearCadena={crearNuevaCadena}
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
          guardando={guardandoFormulario}
          onCerrar={cerrarFormularioCampania}
          onGuardar={guardarCampania}
        />
      )}
    </main>
  );
}

function insertarCadenaSinDuplicar(cadenasActuales, cadenaNueva) {
  const yaExiste = cadenasActuales.some(
    (cadenaActual) => String(cadenaActual.id) === String(cadenaNueva.id)
  );

  if (yaExiste) {
    return cadenasActuales;
  }

  return [...cadenasActuales, cadenaNueva];
}

function obtenerMensajeErrorGuardado(errorGuardado) {
  const mensaje = construirTextoError(errorGuardado).toLowerCase();

  if (mensaje.includes("solo_una_campania_activa")) {
    return "No se ha podido guardar la campaña porque ya existe una campaña activa.";
  }

  return "No se ha podido guardar la campaña.";
}

function construirTextoError(error) {
  const partes = [
    error?.message,
    error?.response?.data?.message,
    typeof error?.response?.data === "string"
      ? error.response.data
      : JSON.stringify(error?.response?.data ?? {}),
  ];

  return partes.filter(Boolean).join(" ");
}
