import { useEffect, useMemo, useState } from "react";
import { FormularioCrearCadena } from "./formularioCrearCadena";
import { obtenerIdsParticipantes } from "./utils/campaniasMapper";
import { AccionesDetalleCampania } from "./detalle/accionesDetalleCampania";
import { GrupoCadenas } from "./detalle/grupoCadenas";
import { ListaCoordinadores } from "./detalle/listaCoordinadores";

export function CampaniaDetalle({
  campania,
  puedeIrAnterior,
  puedeIrSiguiente,
  onVolver,
  onAnterior,
  onSiguiente,
  onGuardarCadenas,
  onGuardarCoordinadores,
  onCrearCadena,
}) {
  const [modoAsignarCadenas, setModoAsignarCadenas] = useState(false);
  const [modoGestionarCoordinadores, setModoGestionarCoordinadores] =
    useState(false);
  const [mostrarFormularioCadena, setMostrarFormularioCadena] = useState(false);
  const [guardandoCambios, setGuardandoCambios] = useState(false);
  const [errorFormularioCadena, setErrorFormularioCadena] = useState("");

  const [nombreNuevaCadena, setNombreNuevaCadena] = useState("");
  const [acronimoNuevaCadena, setAcronimoNuevaCadena] = useState("");

  const [cadenasLocales, setCadenasLocales] = useState(
    campania.cadenas ?? []
  );

  const [idsCadenasSeleccionadas, setIdsCadenasSeleccionadas] = useState(
    obtenerIdsParticipantes(campania.cadenas)
  );

  const [idsCoordinadoresSeleccionados, setIdsCoordinadoresSeleccionados] =
    useState(obtenerIdsParticipantes(campania.coordinadores));

  useEffect(() => {
    setCadenasLocales(campania.cadenas ?? []);
    setIdsCadenasSeleccionadas(obtenerIdsParticipantes(campania.cadenas));
    setIdsCoordinadoresSeleccionados(
      obtenerIdsParticipantes(campania.coordinadores)
    );
    setModoAsignarCadenas(false);
    setModoGestionarCoordinadores(false);
    setMostrarFormularioCadena(false);
    setErrorFormularioCadena("");
  }, [campania.id, campania.cadenas, campania.coordinadores]);

  const hayModoEdicion = modoAsignarCadenas || modoGestionarCoordinadores;
  const hayFormularioAbierto = mostrarFormularioCadena;
  const accionesBloqueadas =
    hayModoEdicion || hayFormularioAbierto || guardandoCambios;

  const idsCadenasSeleccionadasSet = useMemo(
    () => crearSetIds(idsCadenasSeleccionadas),
    [idsCadenasSeleccionadas]
  );

  const idsCoordinadoresSeleccionadosSet = useMemo(
    () => crearSetIds(idsCoordinadoresSeleccionados),
    [idsCoordinadoresSeleccionados]
  );

  const cadenasOrdenadas = useMemo(() => {
    return [...cadenasLocales].sort((cadenaA, cadenaB) => {
      const cadenaAParticipa = idsCadenasSeleccionadasSet.has(
        String(cadenaA.id)
      );
      const cadenaBParticipa = idsCadenasSeleccionadasSet.has(
        String(cadenaB.id)
      );

      if (cadenaAParticipa === cadenaBParticipa) {
        return cadenaA.nombre.localeCompare(cadenaB.nombre);
      }

      return cadenaAParticipa ? -1 : 1;
    });
  }, [cadenasLocales, idsCadenasSeleccionadasSet]);

  const cadenasParticipantes = useMemo(() => {
    return cadenasOrdenadas.filter((cadena) =>
      idsCadenasSeleccionadasSet.has(String(cadena.id))
    );
  }, [cadenasOrdenadas, idsCadenasSeleccionadasSet]);

  const cadenasNoParticipantes = useMemo(() => {
    return cadenasOrdenadas.filter(
      (cadena) => !idsCadenasSeleccionadasSet.has(String(cadena.id))
    );
  }, [cadenasOrdenadas, idsCadenasSeleccionadasSet]);

  const coordinadoresOrdenados = useMemo(() => {
    return [...(campania.coordinadores ?? [])].sort(
      (coordinadorA, coordinadorB) => {
        const coordinadorAParticipa = idsCoordinadoresSeleccionadosSet.has(
          String(coordinadorA.id)
        );
        const coordinadorBParticipa = idsCoordinadoresSeleccionadosSet.has(
          String(coordinadorB.id)
        );

        if (coordinadorAParticipa === coordinadorBParticipa) {
          return coordinadorA.nombre.localeCompare(coordinadorB.nombre);
        }

        return coordinadorAParticipa ? -1 : 1;
      }
    );
  }, [campania.coordinadores, idsCoordinadoresSeleccionadosSet]);

  const activarAsignacionCadenas = () => {
    setModoAsignarCadenas(true);
    setModoGestionarCoordinadores(false);
  };

  const activarGestionCoordinadores = () => {
    setModoGestionarCoordinadores(true);
    setModoAsignarCadenas(false);
  };

  const abrirFormularioCadena = () => {
    setNombreNuevaCadena("");
    setAcronimoNuevaCadena("");
    setErrorFormularioCadena("");
    setMostrarFormularioCadena(true);
  };

  const cerrarFormularioCadena = () => {
    if (guardandoCambios) {
      return;
    }

    setNombreNuevaCadena("");
    setAcronimoNuevaCadena("");
    setErrorFormularioCadena("");
    setMostrarFormularioCadena(false);
  };

  const manejarCambioNombreCadena = (evento) => {
    const nuevoNombre = evento.target.value;
    setNombreNuevaCadena(nuevoNombre);
    setAcronimoNuevaCadena(generarAcronimo(nuevoNombre));
    setErrorFormularioCadena("");
  };

  const manejarCambioAcronimoCadena = (evento) => {
    setAcronimoNuevaCadena(generarAcronimo(evento.target.value));
    setErrorFormularioCadena("");
  };

  const guardarNuevaCadena = async () => {
    const nombreLimpio = nombreNuevaCadena.trim();
    const acronimoLimpio = acronimoNuevaCadena.trim().toUpperCase();

    if (!nombreLimpio || !acronimoLimpio) {
      setErrorFormularioCadena("Rellena el nombre y el acrónimo.");
      return;
    }

    try {
      setGuardandoCambios(true);
      setErrorFormularioCadena("");

      const cadenaCreada = await onCrearCadena({
        nombre: nombreLimpio,
        codigo: acronimoLimpio,
      });

      const cadenaParaPantalla = {
        id: cadenaCreada.id,
        nombre: cadenaCreada.nombre,
        codigo: cadenaCreada.codigo,
        participa: false,
      };

      setCadenasLocales((cadenasActuales) =>
        insertarCadenaSinDuplicar(cadenasActuales, cadenaParaPantalla)
      );

      cerrarFormularioCadena();
    } catch (error) {
      console.error("Error creando cadena:", error);
      setErrorFormularioCadena("No se ha podido crear la cadena.");
    } finally {
      setGuardandoCambios(false);
    }
  };

  const alternarCadena = (idCadena) => {
    if (!modoAsignarCadenas) {
      return;
    }

    setIdsCadenasSeleccionadas((idsActuales) =>
      alternarId(idsActuales, idCadena)
    );
  };

  const alternarCoordinador = (idCoordinador) => {
    if (!modoGestionarCoordinadores) {
      return;
    }

    setIdsCoordinadoresSeleccionados((idsActuales) =>
      alternarId(idsActuales, idCoordinador)
    );
  };

  const descartarCambios = () => {
    setCadenasLocales(campania.cadenas ?? []);
    setIdsCadenasSeleccionadas(obtenerIdsParticipantes(campania.cadenas));
    setIdsCoordinadoresSeleccionados(
      obtenerIdsParticipantes(campania.coordinadores)
    );
    setModoAsignarCadenas(false);
    setModoGestionarCoordinadores(false);
  };

  const guardarCambios = async () => {
    try {
      setGuardandoCambios(true);

      if (modoAsignarCadenas) {
        await onGuardarCadenas(campania.id, idsCadenasSeleccionadas);

        setCadenasLocales((cadenasActuales) =>
          cadenasActuales.map((cadena) => ({
            ...cadena,
            participa: idsCadenasSeleccionadasSet.has(String(cadena.id)),
          }))
        );
      }

      if (modoGestionarCoordinadores) {
        await onGuardarCoordinadores(
          campania.id,
          idsCoordinadoresSeleccionados
        );
      }

      setModoAsignarCadenas(false);
      setModoGestionarCoordinadores(false);
    } finally {
      setGuardandoCambios(false);
    }
  };

  return (
    <main className="detalle-campania">
      <header className="detalle-campania__cabecera">
        <button
          type="button"
          className="detalle-campania__boton-volver"
          onClick={onVolver}
          aria-label="Volver al listado de campañas"
          disabled={accionesBloqueadas}
        >
          ←
        </button>

        <h1 className="detalle-campania__titulo">{campania.nombre}</h1>

        <button
          type="button"
          className="detalle-campania__ayuda"
          aria-label="Ayuda"
        >
          ?
        </button>
      </header>

      <section className="detalle-campania__contenido">
        <section className="detalle-campania__panel detalle-campania__panel--cadenas">
          <h2 className="detalle-campania__subtitulo">Cadenas</h2>

          {modoAsignarCadenas && (
            <p className="detalle-campania__aviso-edicion">
              Marca las cadenas que participan en la campaña.
            </p>
          )}

          <div className="detalle-campania__grupos-cadenas">
            <GrupoCadenas
              titulo="En la campaña"
              cadenas={cadenasParticipantes}
              modoAsignarCadenas={modoAsignarCadenas}
              idsSeleccionadosSet={idsCadenasSeleccionadasSet}
              guardando={guardandoCambios}
              onAlternarCadena={alternarCadena}
            />

            <GrupoCadenas
              titulo="Fuera de la campaña"
              cadenas={cadenasNoParticipantes}
              modoAsignarCadenas={modoAsignarCadenas}
              idsSeleccionadosSet={idsCadenasSeleccionadasSet}
              guardando={guardandoCambios}
              onAlternarCadena={alternarCadena}
            />
          </div>
        </section>

        <aside className="detalle-campania__lateral">
          <section className="detalle-campania__panel detalle-campania__panel--coordinadores">
            <h2 className="detalle-campania__subtitulo">Coordinadores</h2>

            {modoGestionarCoordinadores && (
              <p className="detalle-campania__aviso-edicion">
                Pulsa un coordinador para cambiar si participa o no.
              </p>
            )}

            <ListaCoordinadores
              coordinadores={coordinadoresOrdenados}
              idsSeleccionadosSet={idsCoordinadoresSeleccionadosSet}
              modoGestionarCoordinadores={modoGestionarCoordinadores}
              guardando={guardandoCambios}
              onAlternarCoordinador={alternarCoordinador}
            />
          </section>

          <AccionesDetalleCampania
            disabled={accionesBloqueadas}
            onCrearCadena={abrirFormularioCadena}
            onAsignarCadenas={activarAsignacionCadenas}
            onGestionarCoordinadores={activarGestionCoordinadores}
          />
        </aside>
      </section>

      <footer className="detalle-campania__pie">
        <button
          type="button"
          className="detalle-campania__flecha"
          onClick={onAnterior}
          disabled={!puedeIrAnterior || accionesBloqueadas}
          aria-label="Campaña anterior"
        >
          ←
        </button>

        {hayModoEdicion ? (
          <div className="detalle-campania__acciones-edicion">
            <button
              type="button"
              className="detalle-campania__descartar"
              onClick={descartarCambios}
              disabled={guardandoCambios}
            >
              Descartar cambios
            </button>

            <button
              type="button"
              className="detalle-campania__guardar"
              onClick={guardarCambios}
              disabled={guardandoCambios}
            >
              {guardandoCambios ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        ) : (
          <div />
        )}

        <button
          type="button"
          className="detalle-campania__flecha"
          onClick={onSiguiente}
          disabled={!puedeIrSiguiente || accionesBloqueadas}
          aria-label="Campaña siguiente"
        >
          →
        </button>
      </footer>

      {mostrarFormularioCadena && (
        <FormularioCrearCadena
          nombre={nombreNuevaCadena}
          acronimo={acronimoNuevaCadena}
          error={errorFormularioCadena}
          guardando={guardandoCambios}
          onCambiarNombre={manejarCambioNombreCadena}
          onCambiarAcronimo={manejarCambioAcronimoCadena}
          onCerrar={cerrarFormularioCadena}
          onGuardar={guardarNuevaCadena}
        />
      )}
    </main>
  );
}

function crearSetIds(ids) {
  return new Set(ids.map((id) => String(id)));
}

function alternarId(idsActuales, idNuevo) {
  const existe = idsActuales.some((idActual) => String(idActual) === String(idNuevo));

  if (existe) {
    return idsActuales.filter((idActual) => String(idActual) !== String(idNuevo));
  }

  return [...idsActuales, idNuevo];
}

function generarAcronimo(valor) {
  return valor.replace(/\s+/g, "").slice(0, 4).toUpperCase();
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
