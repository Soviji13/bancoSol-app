/* ==========================================================
   API de coordinadores
   ----------------------------------------------------------
   Este módulo centraliza las operaciones HTTP utilizadas por
   la pantalla principal y el formulario de coordinadores.
   ========================================================== */

/* ==============================
   CONFIGURACIÓN
   ============================== */

const API_BASE = "http://localhost:8080/api";

const ENDPOINTS = Object.freeze({
  coordinadores: `${API_BASE}/coordinadores`,
  coordinadorCompleto: `${API_BASE}/coordinadores/completo`,
  contactos: `${API_BASE}/contactos`,
  campanias: `${API_BASE}/campanias`,
  zonas: `${API_BASE}/zonas-geograficas`
});

/* ==============================
   OPERACIONES DE CONSULTA
   ============================== */

export function listarCoordinadores() {
  return getJSON(ENDPOINTS.coordinadores, "No se pudieron cargar los coordinadores");
}

export function obtenerCoordinadorPorId(id) {
  return getJSON(`${ENDPOINTS.coordinadores}/${id}`, "No se pudo cargar el coordinador seleccionado");
}

export function listarCampanias() {
  return getJSON(ENDPOINTS.campanias, "No se pudieron cargar las campañas");
}

export function listarZonas() {
  return getJSON(ENDPOINTS.zonas, "No se pudieron cargar las zonas geográficas");
}

/* ==============================
   OPERACIONES DE PERSISTENCIA
   ============================== */

export function crearCoordinadorCompleto(datos) {
  return enviarJSON(
    ENDPOINTS.coordinadorCompleto,
    "POST",
    datos,
    "Error al crear el coordinador"
  );
}

export function actualizarCoordinador(id, datos) {
  return enviarJSON(
    `${ENDPOINTS.coordinadores}/${id}`,
    "PUT",
    datos,
    "Error al actualizar el coordinador"
  );
}

export function actualizarContacto(id, datos) {
  return enviarJSON(
    `${ENDPOINTS.contactos}/${id}`,
    "PUT",
    datos,
    "Error al actualizar el contacto del coordinador"
  );
}

export function eliminarCoordinadorPorId(id) {
  return deleteJSON(
    `${ENDPOINTS.coordinadores}/${id}`,
    "Error al eliminar el coordinador"
  );
}

/* ==============================
   CLIENTE HTTP
   ============================== */

async function getJSON(url, mensajeError) {
  const respuesta = await fetch(url);
  return validarRespuestaHTTP(respuesta, mensajeError);
}

async function enviarJSON(url, metodo, datos, mensajeError) {
  const respuesta = await fetch(url, {
    method: metodo,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datos)
  });

  return validarRespuestaHTTP(respuesta, mensajeError);
}

async function deleteJSON(url, mensajeError) {
  const respuesta = await fetch(url, {
    method: "DELETE"
  });

  return validarRespuestaHTTP(respuesta, mensajeError);
}

/**
 * Lee y valida una respuesta HTTP.
 * La respuesta se procesa como texto para admitir cuerpos vacíos,
 * JSON válido o mensajes simples devueltos por el servidor.
 *
 * @param {Response} respuesta Respuesta recibida.
 * @param {string} mensajeError Mensaje contextual de error.
 * @returns {Promise<object|string|null>} Cuerpo procesado.
 */
async function validarRespuestaHTTP(respuesta, mensajeError) {
  const texto = await respuesta.text();
  const cuerpo = texto ? intentarParsearJSON(texto) : null;

  if (!respuesta.ok) {
    throw new Error(`${mensajeError}. Código HTTP: ${respuesta.status}. Respuesta: ${texto}`);
  }

  return cuerpo;
}

function intentarParsearJSON(texto) {
  try {
    return JSON.parse(texto);
  } catch {
    return texto;
  }
}