export function prepararCampaniaParaApi(campania) {
  return {
    nombre: campania.nombre,
    fechaInicio: campania.fechaInicio,
    fechaFin: campania.fechaFin,
    activa: campania.activa,
    idsCadenas: obtenerIdsParticipantes(campania.cadenas),
    idsCoordinadores: obtenerIdsParticipantes(campania.coordinadores),
  };
}

export function obtenerIdsParticipantes(elementos) {
  if (!Array.isArray(elementos)) {
    return [];
  }

  return elementos
    .filter((elemento) => elemento.participa)
    .map((elemento) => elemento.id);
}

export function normalizarCampanias(
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

export function normalizarCampania(
  campania,
  cadenasDisponibles = [],
  coordinadoresDisponibles = []
) {
  if (!campania) {
    return null;
  }

  const idsCadenas = normalizarIds(
    campania.idsCadenas ?? campania.idsCadenasCampania
  );

  const idsCoordinadores = normalizarIds(
    campania.idsCoordinadores ?? campania.idsCoordinadoresCampania
  );

  return {
    ...campania,
    cadenas: construirCadenasDeCampania(cadenasDisponibles, idsCadenas),
    coordinadores: construirCoordinadoresDeCampania(
      coordinadoresDisponibles,
      idsCoordinadores
    ),
  };
}

export function normalizarCadenas(cadenas) {
  if (!Array.isArray(cadenas)) {
    return [];
  }

  return cadenas.map(normalizarCadena);
}

export function normalizarCadena(cadena) {
  return {
    id: cadena.id,
    nombre: cadena.nombre,
    codigo: cadena.codigo,
  };
}

export function normalizarCoordinadores(coordinadores) {
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

  const idsCadenasSet = crearSetIds(idsCadenasCampania);

  return cadenasDisponibles.map((cadena) => ({
    ...cadena,
    participa: idsCadenasSet.has(String(cadena.id)),
  }));
}

function construirCoordinadoresDeCampania(
  coordinadoresDisponibles,
  idsCoordinadoresCampania
) {
  if (!Array.isArray(coordinadoresDisponibles)) {
    return [];
  }

  const idsCoordinadoresSet = crearSetIds(idsCoordinadoresCampania);

  return coordinadoresDisponibles.map((coordinador) => ({
    ...coordinador,
    participa: idsCoordinadoresSet.has(String(coordinador.id)),
  }));
}

function normalizarIds(ids) {
  if (!Array.isArray(ids)) {
    return [];
  }

  return ids;
}

function crearSetIds(ids) {
  return new Set(ids.map((id) => String(id)));
}
