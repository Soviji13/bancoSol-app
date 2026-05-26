/* ==========================================================
   Utilidades de assets globales
   ----------------------------------------------------------
   Este módulo centraliza la construcción de rutas hacia la
   carpeta global de assets.
   ========================================================== */

/* ==============================
   CONTEXTO DE LA APLICACIÓN
   ============================== */

/**
 * Obtiene el context path de la aplicación desde el body.
 *
 * En JSP se está usando:
 * <body data-context-path="${pageContext.request.contextPath}">
 *
 * @returns {string} Context path de la aplicación o cadena vacía.
 */
function obtenerContextPath() {
  const contextPath = document.body?.dataset?.contextPath;

  if (contextPath !== undefined) {
    return contextPath;
  }

  return "";
}

/* ==============================
   RUTAS DE ASSETS
   ============================== */

/**
 * Construye una ruta absoluta hacia un recurso de la carpeta global assets.
 *
 * @param {string} rutaRelativa Ruta del recurso dentro de assets.
 * @returns {string} Ruta completa hacia el asset.
 */
export function obtenerRutaAsset(rutaRelativa) {
  const rutaLimpia = String(rutaRelativa || "").replace(/^\/+/, "");

  return `${obtenerContextPath()}/assets/${rutaLimpia}`;
}