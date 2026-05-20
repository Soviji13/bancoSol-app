/* ==========================================================
   Panel de filtros de incidencias
   ----------------------------------------------------------
   Este módulo gestiona la lectura, aplicación, limpieza y cierre
   del formulario de filtros asociado a la vista de incidencias.
   La comunicación con la vista principal se realiza mediante
   mensajes enviados al documento padre.
   ========================================================== */

/* ==============================
   SELECTORES DE LA INTERFAZ
   ============================== */

const SELECTORS = Object.freeze({
  formFiltro: "#form-filtro",
  btnCerrarFiltro: "#btn-cerrar-filtro",
  btnLimpiarFiltro: "#btn-limpiar-filtro",

  filtroReportadoPor: "#filtro-reportado-por",
  filtroEstado: "#filtro-estado",
  filtroCargo: "#filtro-cargo",
  filtroAsunto: "#filtro-asunto"
});

/* ==============================
   TIPOS DE MENSAJE
   ============================== */

const MENSAJES_PARENT = Object.freeze({
  cerrarFiltroIncidencias: "CERRAR_FILTRO_INCIDENCIAS",
  aplicarFiltrosIncidencias: "APLICAR_FILTROS_INCIDENCIAS",
  limpiarFiltrosIncidencias: "LIMPIAR_FILTROS_INCIDENCIAS"
});

/* ==============================
   INICIALIZACIÓN
   ============================== */

/**
 * Inicializa el panel de filtros cuando el DOM se encuentra disponible.
 * La inicialización se limita al registro de los eventos asociados al
 * formulario y a los botones del panel.
 */
document.addEventListener("DOMContentLoaded", inicializarPanelFiltros);

function inicializarPanelFiltros() {
  registrarEventos();
}

/* ==============================
   REGISTRO DE EVENTOS
   ============================== */

/**
 * Registra los eventos principales del panel de filtros.
 */
function registrarEventos() {
  const formFiltro = document.querySelector(SELECTORS.formFiltro);
  const btnCerrarFiltro = document.querySelector(SELECTORS.btnCerrarFiltro);
  const btnLimpiarFiltro = document.querySelector(SELECTORS.btnLimpiarFiltro);

  btnCerrarFiltro?.addEventListener("click", cerrarPanelFiltros);
  formFiltro?.addEventListener("submit", aplicarFiltros);
  btnLimpiarFiltro?.addEventListener("click", limpiarFiltros);
}

/* ==============================
   ACCIONES DEL PANEL
   ============================== */

/**
 * Solicita al documento padre el cierre del panel de filtros.
 */
function cerrarPanelFiltros() {
  enviarMensajeAlPadre({
    tipo: MENSAJES_PARENT.cerrarFiltroIncidencias
  });
}

/**
 * Lee los valores del formulario y solicita a la vista principal
 * la aplicación de los filtros indicados por el usuario.
 *
 * @param {SubmitEvent} evento Evento de envío del formulario.
 */
function aplicarFiltros(evento) {
  evento.preventDefault();

  enviarMensajeAlPadre({
    tipo: MENSAJES_PARENT.aplicarFiltrosIncidencias,
    filtros: leerFiltros()
  });
}

/**
 * Restablece el formulario y solicita a la vista principal que elimine
 * todos los filtros activos.
 */
function limpiarFiltros() {
  const formFiltro = document.querySelector(SELECTORS.formFiltro);

  formFiltro?.reset();

  enviarMensajeAlPadre({
    tipo: MENSAJES_PARENT.limpiarFiltrosIncidencias
  });
}

/* ==============================
   LECTURA DEL FORMULARIO
   ============================== */

/**
 * Obtiene los valores actuales del formulario de filtros.
 *
 * @returns {object} Filtros introducidos por el usuario.
 */
function leerFiltros() {
  return {
    reportadoPor: obtenerValorCampo(SELECTORS.filtroReportadoPor),
    estado: obtenerValorCampo(SELECTORS.filtroEstado),
    cargo: obtenerValorCampo(SELECTORS.filtroCargo),
    asunto: obtenerValorCampo(SELECTORS.filtroAsunto)
  };
}

function obtenerValorCampo(selector) {
  return document.querySelector(selector)?.value.trim() || "";
}

/* ==============================
   COMUNICACIÓN CON EL DOCUMENTO PADRE
   ============================== */

/**
 * Envía un mensaje al documento padre. Esta función centraliza la
 * comunicación para evitar duplicación de llamadas directas a
 * window.parent.postMessage.
 *
 * @param {object} mensaje Mensaje que será enviado.
 */
function enviarMensajeAlPadre(mensaje) {
  window.parent.postMessage(mensaje, "*");
}
