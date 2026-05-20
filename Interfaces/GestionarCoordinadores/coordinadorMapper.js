/* ==========================================================
   Mapper de coordinadores
   ----------------------------------------------------------
   Este módulo transforma los datos recibidos desde la API al
   formato que necesitan la tabla, el detalle y el formulario.
   ========================================================== */

/* ==============================
   MAPEO DESDE LA API
   ============================== */

/**
 * Transforma un coordinador recibido desde la API en un objeto adaptado
 * a la interfaz de usuario.
 *
 * @param {object} coordinadorAPI Coordinador recibido desde el backend.
 * @param {Array<object>} campaniasDisponibles Catálogo de campañas cargadas.
 * @returns {object} Coordinador preparado para la interfaz.
 */
export function mapearCoordinadorDesdeAPI(coordinadorAPI = {}, campaniasDisponibles = []) {
  const contacto = coordinadorAPI.contacto || {};
  const usuario = coordinadorAPI.usuario || {};
  const campanias = Array.isArray(coordinadorAPI.campanias) ? coordinadorAPI.campanias : [];
  const idsCampanias = obtenerIdsCampanias(coordinadorAPI, campanias);

  return {
    id: coordinadorAPI.id ?? null,
    nombre: coordinadorAPI.nombre || contacto.nombre || "Sin nombre",

    contactoId: contacto.id || coordinadorAPI.contactoId || null,
    usuarioId: usuario.id || coordinadorAPI.usuarioId || null,

    email: contacto.email || coordinadorAPI.email || "",
    telefono: contacto.telefono || coordinadorAPI.telefono || "",
    area: coordinadorAPI.area || coordinadorAPI.zonaGeografica || coordinadorAPI.nombreZonaGeografica || "",
    tiendas: coordinadorAPI.tiendas ?? coordinadorAPI.numeroTiendas ?? 0,
    permisoModificar: coordinadorAPI.permisoModificar === true,

    campanias,
    idsCampanias,
    nombresCampanias: obtenerNombresCampanias(campanias, idsCampanias, campaniasDisponibles),

    raw: coordinadorAPI
  };
}

function obtenerIdsCampanias(coordinadorAPI, campanias) {
  if (Array.isArray(coordinadorAPI.idsCampanias)) {
    return coordinadorAPI.idsCampanias.map(Number).filter(Number.isFinite);
  }

  if (Array.isArray(campanias)) {
    return campanias.map((campania) => Number(campania.id)).filter(Number.isFinite);
  }

  return [];
}

function obtenerNombresCampanias(campanias, idsCampanias, campaniasDisponibles) {
  if (campanias.length > 0) {
    return campanias.map((campania) => campania.nombre || `Campaña ${campania.id}`);
  }

  return idsCampanias.map((id) => {
    const campania = campaniasDisponibles.find((c) => Number(c.id) === Number(id));
    return campania ? campania.nombre : `Campaña ${id}`;
  });
}

/* ==============================
   MAPEO HACIA LA API
   ============================== */

export function mapearCoordinadorParaCrear(datos) {
  return {
    nombre: datos.nombre,
    email: datos.email,
    telefono: datos.telefono,
    area: datos.area,
    tiendas: datos.tiendas,
    permisoModificar: datos.permisoModificar,
    idsCampanias: datos.idsCampanias
  };
}

export function mapearCoordinadorParaActualizar(datos) {
  const coordinador = {
    area: datos.area,
    tiendas: datos.tiendas,
    permisoModificar: datos.permisoModificar,
    contactoId: datos.contactoId,
    usuarioId: datos.usuarioId,
    idsCampanias: datos.idsCampanias
  };

  return coordinador;
}

export function mapearContactoParaActualizar(datos) {
  return {
    nombre: datos.nombre,
    email: datos.email,
    telefono: datos.telefono
  };
}

/* ==============================
   MAPEO PARA CSV
   ============================== */

export function obtenerCabecerasCSVCoordinadores() {
  return [
    "ID",
    "Nombre",
    "Email",
    "Teléfono",
    "Área asignada",
    "Número de tiendas",
    "Campañas",
    "Permiso modificar"
  ];
}

export function mapearCoordinadoresParaCSV(coordinadores) {
  return coordinadores.map((coordinador) => [
    coordinador.id,
    coordinador.nombre,
    coordinador.email,
    coordinador.telefono,
    coordinador.area,
    coordinador.tiendas,
    coordinador.nombresCampanias.join(" | "),
    coordinador.permisoModificar ? "Sí" : "No"
  ]);
}