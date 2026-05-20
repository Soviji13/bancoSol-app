/* ==========================================================
   Utilidades de assets globales
   ----------------------------------------------------------
   Este módulo centraliza la construcción de rutas hacia la
   carpeta global de assets, situada al mismo nivel que utils.
   ========================================================== */

/* ==============================
   CONFIGURACIÓN
   ============================== */

/**
 * Ruta relativa hacia la carpeta global de assets desde los módulos
 * ubicados dentro de una carpeta funcional, como Coordinadores.
 */
const ASSETS_BASE = "../assets/";

/* ==============================
   RUTAS DE ASSETS
   ============================== */

/**
 * Construye una ruta relativa hacia un recurso de la carpeta global
 * de assets.
 *
 * @param {string} rutaRelativa Ruta del recurso dentro de assets.
 * @returns {string} Ruta completa hacia el asset.
 */
export function obtenerRutaAsset(rutaRelativa) {
  return `${ASSETS_BASE}${String(rutaRelativa || "").replace(/^\/+/, "")}`;
}