/* ==========================================================
   API de incidencias
   ----------------------------------------------------------
   Este módulo centraliza las operaciones HTTP relacionadas
   con la gestión de incidencias dentro de la aplicación.
   Proporciona funciones para listar, consultar, crear,
   actualizar y eliminar incidencias.
   ========================================================== */

/* ==============================
   CONFIGURACIÓN DE ENDPOINTS
   ============================== */

const API_BASE = "http://localhost:8080/api";

const ENDPOINTS = Object.freeze({
  incidencias: `${API_BASE}/incidencias`
});

/* ==============================
   LECTURA SEGURA DE RESPUESTAS
   ============================== */

/**
 * Lee el cuerpo de una respuesta HTTP de forma segura.
 * 
 * La respuesta se obtiene inicialmente como texto para permitir
 * gestionar correctamente respuestas vacías, respuestas JSON y
 * mensajes de error en formato plano.
 *
 * @param {Response} respuesta Respuesta devuelta por fetch.
 * @returns {Promise<object|string|null>} Cuerpo procesado de la respuesta.
 */
async function leerCuerpoRespuesta(respuesta) {
  const texto = await respuesta.text();

  if (!texto) {
    return null;
  }

  try {
    return JSON.parse(texto);
  } catch {
    return texto;
  }
}

/**
 * Comprueba si una respuesta HTTP ha finalizado correctamente.
 * 
 * En caso de error, registra información técnica relevante en consola
 * y lanza una excepción con un mensaje descriptivo para facilitar
 * la depuración desde las capas superiores de la aplicación.
 *
 * @param {Response} respuesta Respuesta HTTP recibida.
 * @param {string} mensajeError Mensaje contextual del error.
 * @returns {Promise<object|string|null>} Cuerpo procesado de la respuesta.
 */
async function validarRespuestaHTTP(respuesta, mensajeError) {
  const cuerpo = await leerCuerpoRespuesta(respuesta);

  if (!respuesta.ok) {
    console.error(mensajeError, {
      url: respuesta.url,
      status: respuesta.status,
      body: cuerpo
    });

    throw new Error(crearMensajeErrorHTTP(mensajeError, respuesta.status, cuerpo));
  }

  return cuerpo;
}

/**
 * Construye un mensaje de error uniforme para respuestas HTTP fallidas.
 *
 * @param {string} mensajeError Mensaje contextual del error.
 * @param {number} status Código de estado HTTP.
 * @param {object|string|null} cuerpo Cuerpo recibido en la respuesta.
 * @returns {string} Mensaje de error normalizado.
 */
function crearMensajeErrorHTTP(mensajeError, status, cuerpo) {
  const cuerpoNormalizado =
    typeof cuerpo === "string" ? cuerpo : JSON.stringify(cuerpo);

  return `${mensajeError}. Código HTTP: ${status}. Respuesta: ${cuerpoNormalizado}`;
}

/* ==============================
   CLIENTE HTTP
   ============================== */

/**
 * Ejecuta una petición HTTP genérica y valida su respuesta.
 *
 * @param {string} url Dirección del recurso solicitado.
 * @param {object} opciones Opciones de configuración de fetch.
 * @param {string} mensajeError Mensaje contextual en caso de fallo.
 * @returns {Promise<object|string|null>} Cuerpo procesado de la respuesta.
 */
async function solicitarHTTP(url, opciones = {}, mensajeError) {
  const respuesta = await fetch(url, opciones);
  return validarRespuestaHTTP(respuesta, mensajeError);
}

/**
 * Realiza una petición HTTP GET y devuelve la respuesta procesada.
 *
 * @param {string} url Dirección del recurso solicitado.
 * @param {string} mensajeError Mensaje contextual en caso de fallo.
 * @returns {Promise<object|string|null>} Cuerpo procesado de la respuesta.
 */
function getJSON(url, mensajeError) {
  return solicitarHTTP(url, {}, mensajeError);
}

/**
 * Envía datos en formato JSON mediante el método HTTP indicado.
 *
 * @param {string} url Dirección del recurso solicitado.
 * @param {string} metodo Método HTTP empleado.
 * @param {object} datos Datos que serán serializados como JSON.
 * @param {string} mensajeError Mensaje contextual en caso de fallo.
 * @returns {Promise<object|string|null>} Cuerpo procesado de la respuesta.
 */
function enviarJSON(url, metodo, datos, mensajeError) {
  return solicitarHTTP(
    url,
    {
      method: metodo,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datos)
    },
    mensajeError
  );
}

/**
 * Realiza una petición HTTP DELETE.
 *
 * @param {string} url Dirección del recurso que será eliminado.
 * @param {string} mensajeError Mensaje contextual en caso de fallo.
 * @returns {Promise<object|string|null>} Cuerpo procesado de la respuesta.
 */
function deleteJSON(url, mensajeError) {
  return solicitarHTTP(
    url,
    {
      method: "DELETE"
    },
    mensajeError
  );
}

/* ==============================
   OPERACIONES SOBRE INCIDENCIAS
   ============================== */

/**
 * Obtiene el conjunto completo de incidencias registradas.
 *
 * @returns {Promise<Array|object|string|null>} Lista de incidencias.
 */
export function listarIncidencias() {
  return getJSON(
    ENDPOINTS.incidencias,
    "Error al listar incidencias"
  );
}

/**
 * Obtiene una incidencia concreta a partir de su identificador.
 *
 * @param {number|string} id Identificador de la incidencia.
 * @returns {Promise<object|string|null>} Incidencia solicitada.
 */
export function obtenerIncidenciaPorId(id) {
  return getJSON(
    `${ENDPOINTS.incidencias}/${id}`,
    "Error al obtener incidencia"
  );
}

/**
 * Crea una nueva incidencia en el sistema.
 *
 * @param {object} incidencia Datos de la incidencia que será creada.
 * @returns {Promise<object|string|null>} Incidencia creada o respuesta del servidor.
 */
export function crearIncidencia(incidencia) {
  return enviarJSON(
    ENDPOINTS.incidencias,
    "POST",
    incidencia,
    "Error al crear incidencia"
  );
}

/**
 * Actualiza los datos de una incidencia existente.
 *
 * @param {number|string} id Identificador de la incidencia.
 * @param {object} incidencia Nuevos datos de la incidencia.
 * @returns {Promise<object|string|null>} Incidencia actualizada o respuesta del servidor.
 */
export function actualizarIncidencia(id, incidencia) {
  return enviarJSON(
    `${ENDPOINTS.incidencias}/${id}`,
    "PUT",
    incidencia,
    "Error al actualizar incidencia"
  );
}

/**
 * Elimina una incidencia existente a partir de su identificador.
 *
 * @param {number|string} id Identificador de la incidencia.
 * @returns {Promise<object|string|null>} Respuesta del servidor.
 */
export function eliminarIncidencia(id) {
  return deleteJSON(
    `${ENDPOINTS.incidencias}/${id}`,
    "Error al eliminar incidencia"
  );
}