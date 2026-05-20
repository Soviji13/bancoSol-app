/* ==========================================================
   Mapper de incidencias
   ----------------------------------------------------------
   Este módulo transforma los datos de incidencias entre el
   formato recibido desde la API y el formato utilizado por la
   interfaz de usuario.
   ========================================================== */

import {
  formatearFecha,
  formatearHora
} from "../utils/fechaUtils.js";

/* ==============================
   CONSTANTES DE DOMINIO
   ============================== */

const TIPO_ELEMENTO = "Incidencia";

const ESTADO_INCIDENCIA = Object.freeze({
  PENDIENTE: "PENDIENTE",
  LEIDA: "LEIDA",
  RESUELTA: "RESUELTA"
});

const TIPO_RESPONSABLE = Object.freeze({
  TIENDA: "RESPONSABLE_TIENDA",
  ENTIDAD: "RESPONSABLE_ENTIDAD"
});

const TEXTO_ESTADO = Object.freeze({
  [ESTADO_INCIDENCIA.PENDIENTE]: "Pendiente",
  [ESTADO_INCIDENCIA.LEIDA]: "Leída",
  [ESTADO_INCIDENCIA.RESUELTA]: "Resuelta"
});

const CLASE_ESTADO = Object.freeze({
  [ESTADO_INCIDENCIA.PENDIENTE]: "estado--pendiente",
  [ESTADO_INCIDENCIA.LEIDA]: "estado--leida",
  [ESTADO_INCIDENCIA.RESUELTA]: "estado--resuelta"
});

const TEXTO_CARGO = Object.freeze({
  [TIPO_RESPONSABLE.TIENDA]: "Responsable tienda",
  [TIPO_RESPONSABLE.ENTIDAD]: "Responsable entidad"
});

/* ==============================
   MAPEO DESDE LA API
   ============================== */

/**
 * Transforma una incidencia recibida desde la API en un objeto adaptado
 * a las necesidades de representación de la interfaz.
 *
 * Además de conservar los datos principales, incorpora campos derivados
 * como la fecha formateada, la hora formateada, el texto del estado y
 * el cargo del responsable.
 *
 * @param {object} incidenciaAPI Incidencia recibida desde el backend.
 * @returns {object} Incidencia preparada para su uso en la interfaz.
 */
export function mapearIncidenciaDesdeAPI(incidenciaAPI = {}) {
  const fechaHora = incidenciaAPI.fechaHora ?? null;
  const estado = incidenciaAPI.estado ?? ESTADO_INCIDENCIA.PENDIENTE;
  const reportadoPorTipo = incidenciaAPI.reportadoPorTipo ?? "";

  return {
    id: incidenciaAPI.id ?? null,
    tipo: TIPO_ELEMENTO,

    fechaHora,
    fechaTexto: formatearFecha(fechaHora),
    horaTexto: formatearHora(fechaHora),

    asunto: incidenciaAPI.asunto ?? "",
    descripcion: incidenciaAPI.descripcion ?? "",

    estado,
    estadoTexto: formatearEstado(estado),

    reportadoPorTipo,
    reportadoPorNombre: incidenciaAPI.reportadoPorNombre ?? "Sin responsable",

    responsableTiendaId: incidenciaAPI.responsableTiendaId ?? null,
    responsableTiendaNombre: incidenciaAPI.responsableTiendaNombre ?? null,

    responsableEntidadId: incidenciaAPI.responsableEntidadId ?? null,
    responsableEntidadNombre: incidenciaAPI.responsableEntidadNombre ?? null,

    cargoTexto: formatearCargo(reportadoPorTipo),

    /*
     * El DTO actual no proporciona necesariamente datos completos de
     * contacto. Este campo permite mostrar una alternativa controlada
     * hasta que el backend incorpore email o teléfono en la respuesta.
     */
    contactoTexto: incidenciaAPI.contacto ?? "No disponible",
    telefono: incidenciaAPI.telefono ?? null,
    email: incidenciaAPI.email ?? null
  };
}

/* ==============================
   MAPEO HACIA LA API
   ============================== */

/**
 * Transforma una incidencia de la interfaz en el objeto esperado por
 * el backend para operaciones de creación o actualización.
 *
 * @param {object} incidencia Incidencia utilizada por la interfaz.
 * @returns {object} Incidencia preparada para enviarse a la API.
 */
export function mapearIncidenciaParaAPI(incidencia = {}) {
  return construirIncidenciaAPI(incidencia, incidencia.estado);
}

/**
 * Genera una incidencia para la API modificando únicamente su estado.
 * Esta función resulta útil para cambios rápidos de estado sin alterar
 * el resto de datos relevantes de la incidencia.
 *
 * @param {object} incidencia Incidencia base.
 * @param {string} nuevoEstado Nuevo estado que será asignado.
 * @returns {object} Incidencia preparada para enviarse a la API.
 */
export function mapearIncidenciaConNuevoEstado(incidencia = {}, nuevoEstado) {
  return construirIncidenciaAPI(incidencia, nuevoEstado);
}

/**
 * Construye el objeto común que se envía al backend en las operaciones
 * de persistencia.
 *
 * @param {object} incidencia Incidencia de origen.
 * @param {string} estado Estado que debe enviarse a la API.
 * @returns {object} Objeto compatible con el DTO esperado por el backend.
 */
function construirIncidenciaAPI(incidencia, estado) {
  return {
    fechaHora: incidencia.fechaHora,
    asunto: incidencia.asunto,
    descripcion: incidencia.descripcion,
    estado,
    responsableTiendaId: incidencia.responsableTiendaId,
    responsableEntidadId: incidencia.responsableEntidadId
  };
}

/* ==============================
   FORMATEO DE ESTADOS Y CARGOS
   ============================== */

/**
 * Devuelve el texto visible asociado a un estado de incidencia.
 *
 * @param {string} estado Estado interno de la incidencia.
 * @returns {string} Texto legible para la interfaz.
 */
export function formatearEstado(estado) {
  return TEXTO_ESTADO[estado] ?? "-";
}

/**
 * Devuelve la clase CSS asociada a un estado de incidencia.
 *
 * @param {string} estado Estado interno de la incidencia.
 * @returns {string} Clase CSS correspondiente.
 */
export function obtenerClaseEstado(estado) {
  return CLASE_ESTADO[estado] ?? "estado--ninguno";
}

/**
 * Devuelve el texto visible asociado al tipo de responsable.
 *
 * @param {string} tipo Tipo interno de responsable.
 * @returns {string} Texto legible para la interfaz.
 */
export function formatearCargo(tipo) {
  return TEXTO_CARGO[tipo] ?? "-";
}
