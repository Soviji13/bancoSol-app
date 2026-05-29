/* ==========================================================
   Utilidades de exportación CSV
   ----------------------------------------------------------
   Este módulo centraliza la generación y descarga de ficheros
   CSV para que pueda reutilizarse desde distintas pantallas de
   la aplicación.
   ========================================================== */

/* ==============================
   CONFIGURACIÓN
   ============================== */

const MIME_CSV = "text/csv;charset=utf-8;";
const BOM_UTF8 = "\uFEFF";

/* ==============================
   EXPORTACIÓN CSV
   ============================== */

/**
 * Exporta un conjunto de datos a un fichero CSV descargable.
 *
 * @param {object} parametros Parámetros de exportación.
 * @param {Array<string>} parametros.cabeceras Cabeceras del fichero CSV.
 * @param {Array<Array<string|number|boolean|null|undefined>>} parametros.filas Filas del fichero CSV.
 * @param {string} parametros.nombreArchivo Nombre base del archivo sin extensión.
 */
export function exportarCSV({ cabeceras, filas, nombreArchivo }) {
  if (!Array.isArray(cabeceras) || cabeceras.length === 0) {
    throw new Error("La exportación CSV requiere al menos una cabecera.");
  }

  if (!Array.isArray(filas)) {
    throw new Error("La exportación CSV requiere una colección de filas.");
  }

  const contenido = construirContenidoCSV(cabeceras, filas);
  descargarArchivoCSV(contenido, nombreArchivo);
}

/**
 * Construye el contenido textual del CSV.
 *
 * @param {Array<string>} cabeceras Cabeceras del fichero.
 * @param {Array<Array<string|number|boolean|null|undefined>>} filas Filas del fichero.
 * @returns {string} Contenido CSV final.
 */
function construirContenidoCSV(cabeceras, filas) {
  const cabeceraCSV = cabeceras.map(escaparValorCSV).join(",");
  const filasCSV = filas.map((fila) => fila.map(escaparValorCSV).join(","));

  return BOM_UTF8 + [cabeceraCSV, ...filasCSV].join("\n");
}

/**
 * Descarga el contenido CSV generado mediante un enlace temporal.
 *
 * @param {string} contenido Contenido completo del fichero CSV.
 * @param {string} nombreArchivo Nombre base del archivo.
 */
function descargarArchivoCSV(contenido, nombreArchivo) {
  const blob = new Blob([contenido], { type: MIME_CSV });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");

  enlace.href = url;
  enlace.download = `${normalizarNombreArchivo(nombreArchivo)}.csv`;
  enlace.style.visibility = "hidden";

  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);

  URL.revokeObjectURL(url);
}

/**
 * Escapa un valor para que pueda insertarse de forma segura en CSV.
 *
 * @param {string|number|boolean|null|undefined} valor Valor original.
 * @returns {string} Valor escapado.
 */
function escaparValorCSV(valor) {
  return `"${String(valor ?? "").replaceAll('"', '""')}"`;
}

/**
 * Normaliza el nombre del fichero para evitar caracteres problemáticos.
 *
 * @param {string} nombreArchivo Nombre original.
 * @returns {string} Nombre normalizado.
 */
function normalizarNombreArchivo(nombreArchivo) {
  const nombre = String(nombreArchivo || "exportacion")
    .trim()
    .replace(/[\\/:*?"<>|]/g, "-");

  return nombre || "exportacion";
}
