import { useEffect, useState } from "react";
import { FormularioCrearCadena } from "./formularioCrearCadena";
import { crearCadena } from "../api/cadenasApi";

export function CampaniaDetalle({
  campania,
  puedeIrAnterior,
  puedeIrSiguiente,
  onVolver,
  onAnterior,
  onSiguiente,
  onGuardarCadenas,
  onGuardarCoordinadores,
}) {
  const [modoAsignarCadenas, setModoAsignarCadenas] = useState(false);
  const [modoGestionarCoordinadores, setModoGestionarCoordinadores] =
    useState(false);
  const [mostrarFormularioCadena, setMostrarFormularioCadena] = useState(false);
  const [guardandoCambios, setGuardandoCambios] = useState(false);

  const [nombreNuevaCadena, setNombreNuevaCadena] = useState("");
  const [acronimoNuevaCadena, setAcronimoNuevaCadena] = useState("");

  const [cadenasLocales, setCadenasLocales] = useState(
    campania.cadenas ?? []
  );

  const [idsCadenasSeleccionadas, setIdsCadenasSeleccionadas] = useState(
    (campania.cadenas ?? [])
      .filter((cadena) => cadena.participa)
      .map((cadena) => cadena.id)
  );

  const [idsCoordinadoresSeleccionados, setIdsCoordinadoresSeleccionados] =
    useState(
      (campania.coordinadores ?? [])
        .filter((coordinador) => coordinador.participa)
        .map((coordinador) => coordinador.id)
    );

  useEffect(() => {
    setCadenasLocales(campania.cadenas ?? []);

    setIdsCadenasSeleccionadas(
      (campania.cadenas ?? [])
        .filter((cadena) => cadena.participa)
        .map((cadena) => cadena.id)
    );

    setIdsCoordinadoresSeleccionados(
      (campania.coordinadores ?? [])
        .filter((coordinador) => coordinador.participa)
        .map((coordinador) => coordinador.id)
    );

    setModoAsignarCadenas(false);
    setModoGestionarCoordinadores(false);
  }, [campania.id, campania.cadenas, campania.coordinadores]);

  const hayModoEdicion = modoAsignarCadenas || modoGestionarCoordinadores;
  const hayFormularioAbierto = mostrarFormularioCadena;

  const cadenasOrdenadas = [...cadenasLocales].sort((a, b) => {
    const aParticipa = idsCadenasSeleccionadas.includes(a.id);
    const bParticipa = idsCadenasSeleccionadas.includes(b.id);

    if (aParticipa === bParticipa) {
      return a.nombre.localeCompare(b.nombre);
    }

    return aParticipa ? -1 : 1;
  });

  const cadenasParticipantes = cadenasOrdenadas.filter((cadena) =>
    idsCadenasSeleccionadas.includes(cadena.id)
  );

  const cadenasNoParticipantes = cadenasOrdenadas.filter(
    (cadena) => !idsCadenasSeleccionadas.includes(cadena.id)
  );

  const coordinadoresOrdenados = [...(campania.coordinadores ?? [])].sort(
    (a, b) => {
      const aParticipa = idsCoordinadoresSeleccionados.includes(a.id);
      const bParticipa = idsCoordinadoresSeleccionados.includes(b.id);

      if (aParticipa === bParticipa) {
        return a.nombre.localeCompare(b.nombre);
      }

      return aParticipa ? -1 : 1;
    }
  );

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
    setMostrarFormularioCadena(true);
  };

  const cerrarFormularioCadena = () => {
    setNombreNuevaCadena("");
    setAcronimoNuevaCadena("");
    setMostrarFormularioCadena(false);
  };

  const manejarCambioNombreCadena = (evento) => {
    const nuevoNombre = evento.target.value;
    setNombreNuevaCadena(nuevoNombre);

    const acronimoAutomatico = nuevoNombre
      .replace(/\s+/g, "")
      .slice(0, 4)
      .toUpperCase();

    setAcronimoNuevaCadena(acronimoAutomatico);
  };

  const manejarCambioAcronimoCadena = (evento) => {
    const nuevoAcronimo = evento.target.value
      .replace(/\s+/g, "")
      .slice(0, 4)
      .toUpperCase();

    setAcronimoNuevaCadena(nuevoAcronimo);
  };

  const guardarNuevaCadena = async () => {
  const nombreLimpio = nombreNuevaCadena.trim();
  const acronimoLimpio = acronimoNuevaCadena.trim().toUpperCase();

  if (!nombreLimpio || !acronimoLimpio) {
    return;
  }

  try {
    setGuardandoCambios(true);

    const cadenaCreada = await crearCadena({
      nombre: nombreLimpio,
      codigo: acronimoLimpio,
    });

    const cadenaParaPantalla = {
      id: cadenaCreada.id,
      nombre: cadenaCreada.nombre,
      codigo: cadenaCreada.codigo,
      participa: false,
    };

    setCadenasLocales((cadenasActuales) => [
      ...cadenasActuales,
      cadenaParaPantalla,
    ]);

    cerrarFormularioCadena();
  } catch (error) {
    console.error("Error creando cadena:", error);
  } finally {
    setGuardandoCambios(false);
  }
};

  const alternarCadena = (idCadena) => {
    if (!modoAsignarCadenas) {
      return;
    }

    setIdsCadenasSeleccionadas((idsActuales) => {
      if (idsActuales.includes(idCadena)) {
        return idsActuales.filter((id) => id !== idCadena);
      }

      return [...idsActuales, idCadena];
    });
  };

  const alternarCoordinador = (idCoordinador) => {
    if (!modoGestionarCoordinadores) {
      return;
    }

    setIdsCoordinadoresSeleccionados((idsActuales) => {
      if (idsActuales.includes(idCoordinador)) {
        return idsActuales.filter((id) => id !== idCoordinador);
      }

      return [...idsActuales, idCoordinador];
    });
  };

  const descartarCambios = () => {
    setCadenasLocales(campania.cadenas ?? []);

    setIdsCadenasSeleccionadas(
      (campania.cadenas ?? [])
        .filter((cadena) => cadena.participa)
        .map((cadena) => cadena.id)
    );

    setIdsCoordinadoresSeleccionados(
      (campania.coordinadores ?? [])
        .filter((coordinador) => coordinador.participa)
        .map((coordinador) => coordinador.id)
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
            participa: idsCadenasSeleccionadas.includes(cadena.id),
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
          disabled={hayModoEdicion || hayFormularioAbierto || guardandoCambios}
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
              idsCadenasSeleccionadas={idsCadenasSeleccionadas}
              onAlternarCadena={alternarCadena}
            />

            <GrupoCadenas
              titulo="Fuera de la campaña"
              cadenas={cadenasNoParticipantes}
              modoAsignarCadenas={modoAsignarCadenas}
              idsCadenasSeleccionadas={idsCadenasSeleccionadas}
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

            <div className="detalle-campania__lista-coordinadores">
              {coordinadoresOrdenados.map((coordinador) => {
                const participa =
                  idsCoordinadoresSeleccionados.includes(coordinador.id);

                return (
                  <button
                    key={coordinador.id}
                    type="button"
                    className={
                      participa
                        ? "detalle-campania__coordinador detalle-campania__coordinador--participa"
                        : "detalle-campania__coordinador detalle-campania__coordinador--no-participa"
                    }
                    onClick={() => alternarCoordinador(coordinador.id)}
                    disabled={!modoGestionarCoordinadores || guardandoCambios}
                  >
                    <span>{coordinador.nombre}</span>
                    <small>{participa ? "Participa" : "No participa"}</small>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="detalle-campania__acciones-laterales">
            <button
              type="button"
              className="detalle-campania__accion"
              onClick={abrirFormularioCadena}
              disabled={
                hayModoEdicion || hayFormularioAbierto || guardandoCambios
              }
            >
              Crear cadena
            </button>

            <button
              type="button"
              className="detalle-campania__accion"
              onClick={activarAsignacionCadenas}
              disabled={
                hayModoEdicion || hayFormularioAbierto || guardandoCambios
              }
            >
              Asignar cadenas
            </button>

            <button
              type="button"
              className="detalle-campania__accion"
              onClick={activarGestionCoordinadores}
              disabled={
                hayModoEdicion || hayFormularioAbierto || guardandoCambios
              }
            >
              Gestionar coordinadores
            </button>
          </div>
        </aside>
      </section>

      <footer className="detalle-campania__pie">
        <button
          type="button"
          className="detalle-campania__flecha"
          onClick={onAnterior}
          disabled={
            !puedeIrAnterior ||
            hayModoEdicion ||
            hayFormularioAbierto ||
            guardandoCambios
          }
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
          disabled={
            !puedeIrSiguiente ||
            hayModoEdicion ||
            hayFormularioAbierto ||
            guardandoCambios
          }
          aria-label="Campaña siguiente"
        >
          →
        </button>
      </footer>

      {mostrarFormularioCadena && (
        <FormularioCrearCadena
          nombre={nombreNuevaCadena}
          acronimo={acronimoNuevaCadena}
          onCambiarNombre={manejarCambioNombreCadena}
          onCambiarAcronimo={manejarCambioAcronimoCadena}
          onCerrar={cerrarFormularioCadena}
          onGuardar={guardarNuevaCadena}
        />
      )}
    </main>
  );
}

function GrupoCadenas({
  titulo,
  cadenas,
  modoAsignarCadenas,
  idsCadenasSeleccionadas,
  onAlternarCadena,
}) {
  return (
    <section className="detalle-campania__grupo-cadenas">
      <h3 className="detalle-campania__grupo-titulo">{titulo}</h3>

      <div className="detalle-campania__lista-cadenas">
        {cadenas.length === 0 ? (
          <p className="detalle-campania__grupo-vacio">
            No hay cadenas en este grupo.
          </p>
        ) : (
          cadenas.map((cadena) => {
            const seleccionada = idsCadenasSeleccionadas.includes(cadena.id);

            return (
              <label
                key={cadena.id}
                className={
                  seleccionada
                    ? "detalle-campania__cadena detalle-campania__cadena--participa"
                    : "detalle-campania__cadena detalle-campania__cadena--no-participa"
                }
              >
                {modoAsignarCadenas && (
                  <input
                    type="checkbox"
                    checked={seleccionada}
                    onChange={() => onAlternarCadena(cadena.id)}
                  />
                )}

                <span>{cadena.nombre}</span>
              </label>
            );
          })
        )}
      </div>
    </section>
  );
}