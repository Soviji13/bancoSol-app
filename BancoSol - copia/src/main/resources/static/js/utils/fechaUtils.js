/* ==========================================================
   Utilidades de fecha y hora
   ----------------------------------------------------------
   Este módulo centraliza las operaciones de validación,
   construcción y formateo de fechas utilizadas por las vistas
   de la aplicación.
   ========================================================== */

/* ==============================
   CONSTANTES
   ============================== */

const MESES_ES = Object.freeze([
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre"
]);

/* ==============================
   VALIDACIÓN DE FECHAS
   ============================== */

/**
 * Crea una instancia de Date únicamente cuando el valor recibido
 * representa una fecha válida.
 *
 * @param {string|null|undefined} fechaHora Valor temporal recibido.
 * @returns {Date|null} Fecha válida o null.
 */
export function crearFechaValida(fechaHora) {
  if (!fechaHora) {
    return null;
  }

  const fecha = new Date(fechaHora);

  return Number.isNaN(fecha.getTime()) ? null : fecha;
}

/* ==============================
   FORMATEO BÁSICO
   ============================== */

/**
 * Formatea una fecha en formato local español.
 *
 * @param {string|null|undefined} fechaHora Fecha recibida desde la API.
 * @returns {string} Fecha formateada o guion si no es válida.
 */
export function formatearFecha(fechaHora) {
  const fecha = crearFechaValida(fechaHora);

  if (!fecha) {
    return "-";
  }

  return fecha.toLocaleDateString("es-ES");
}

/**
 * Formatea una hora en formato local español.
 *
 * @param {string|null|undefined} fechaHora Fecha recibida desde la API.
 * @returns {string} Hora formateada o guion si no es válida.
 */
export function formatearHora(fechaHora) {
  const fecha = crearFechaValida(fechaHora);

  if (!fecha) {
    return "-";
  }

  return fecha.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

/* ==============================
   FORMATEO EXTENDIDO
   ============================== */

/**
 * Formatea una fecha completa como texto largo en español.
 *
 * @param {string|null|undefined} fechaHora Fecha recibida desde la API.
 * @returns {string} Fecha larga o guion si no es válida.
 */
export function formatearFechaLarga(fechaHora) {
  const fecha = crearFechaValida(fechaHora);

  if (!fecha) {
    return "-";
  }

  const dia = fecha.getDate();
  const mes = MESES_ES[fecha.getMonth()];
  const anio = fecha.getFullYear();

  return `${dia} de ${mes} de ${anio}`;
}

/**
 * Construye una frase completa con fecha y hora.
 *
 * @param {string|null|undefined} fechaHora Fecha recibida desde la API.
 * @returns {string} Texto completo de fecha y hora.
 */
export function formatearFechaHoraDetalle(fechaHora) {
  const fechaTexto = formatearFechaLarga(fechaHora);
  const horaTexto = formatearHora(fechaHora);

  if (fechaTexto === "-" && horaTexto === "-") {
    return "Fecha y hora no disponibles.";
  }

  return `${fechaTexto} a las ${horaTexto} horas.`;
}

/**
 * Obtiene la fecha y hora actual en formato compatible con el backend,
 * eliminando la zona horaria del valor ISO.
 *
 * @returns {string} Fecha y hora actual en formato yyyy-MM-ddTHH:mm:ss.
 */
export function obtenerFechaHoraActualSinZona() {
  return new Date().toISOString().slice(0, 19);
}