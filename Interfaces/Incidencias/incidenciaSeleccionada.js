/* ==========================================================
   Panel de detalle de incidencia
   ----------------------------------------------------------
   Este módulo obtiene la incidencia seleccionada desde
   sessionStorage y representa sus datos en el panel lateral.
   También permite cerrar el panel y restaurar el menú lateral.
   ========================================================== */

import {
  formatearFechaHoraDetalle
} from "../utils/fechaUtils.js";

/* ==============================
   CONFIGURACIÓN GENERAL
   ============================== */

const STORAGE_KEYS = Object.freeze({
  incidenciaSeleccionada: "incidenciaSeleccionada"
});

const SELECTORS = Object.freeze({
  btnCerrarPanel: "#btn-cerrar-panel",

  tituloIncidencia: "#titulo-incidencia",
  reportadoPor: "#detalle-reportado-por",
  id: "#detalle-id",
  estado: "#detalle-estado",
  cargo: "#detalle-cargo",
  telefono: "#detalle-telefono",
  email: "#detalle-email",
  fechaHora: "#detalle-fecha-hora",
  descripcion: "#detalle-descripcion",

  iframeMenuLateral: ".menu-lateral-iframe"
});

const RUTAS = Object.freeze({
  menuLateral: "../MenuLateral/menu-lateral.html"
});

const CLASES_ESTADO = Object.freeze({
  pendiente: "panel-incidencia__valor--pendiente",
  leida: "panel-incidencia__valor--leida",
  resuelta: "panel-incidencia__valor--resuelta",
  ninguno: "panel-incidencia__valor--ninguno"
});

const ESTADO_TEXTO = Object.freeze({
  pendiente: "Pendiente",
  leida: "Leída",
  resuelta: "Resuelta"
});

/* ==============================
   INICIALIZACIÓN
   ============================== */

/**
 * Inicializa el panel cuando el documento se encuentra disponible.
 * La operación principal consiste en recuperar la incidencia seleccionada
 * y enlazar el evento de cierre del panel.
 */
document.addEventListener("DOMContentLoaded", inicializarPanelDetalle);

function inicializarPanelDetalle() {
  const incidencia = obtenerIncidenciaSeleccionada();

  if (incidencia) {
    renderizarDetalleIncidencia(incidencia);
  }

  registrarEventos();
}

/* ==============================
   EVENTOS
   ============================== */

/**
 * Registra los eventos propios del panel lateral.
 */
function registrarEventos() {
  const btnCerrarPanel = document.querySelector(SELECTORS.btnCerrarPanel);

  btnCerrarPanel?.addEventListener("click", cerrarPanelDetalle);
}

/* ==============================
   LECTURA DE DATOS
   ============================== */

/**
 * Obtiene desde sessionStorage la incidencia seleccionada en la tabla.
 * Si no existe información o el JSON almacenado no es válido, se devuelve
 * null para evitar errores de ejecución en la interfaz.
 *
 * @returns {object|null} Incidencia seleccionada o null.
 */
function obtenerIncidenciaSeleccionada() {
  const datosGuardados = sessionStorage.getItem(STORAGE_KEYS.incidenciaSeleccionada);

  if (!datosGuardados) {
    return null;
  }

  try {
    return JSON.parse(datosGuardados);
  } catch (error) {
    console.error("No se pudo interpretar la incidencia seleccionada.", error);
    return null;
  }
}

/* ==============================
   RENDERIZADO DEL DETALLE
   ============================== */

/**
 * Representa en el panel los datos principales de la incidencia.
 * Se utilizan valores por defecto para evitar que la interfaz muestre
 * valores indefinidos cuando algún campo no esté disponible.
 *
 * @param {object} incidencia Incidencia seleccionada.
 */
function renderizarDetalleIncidencia(incidencia) {
  const estadoTexto = incidencia.estadoTexto ?? formatearEstado(incidencia.estado);

  escribirTexto(SELECTORS.tituloIncidencia, obtenerTituloIncidencia(incidencia));
  escribirTexto(SELECTORS.reportadoPor, incidencia.reportadoPorNombre ?? "Sin responsable");
  escribirTexto(SELECTORS.id, incidencia.id ?? "-");
  escribirTexto(SELECTORS.estado, estadoTexto);
  escribirTexto(SELECTORS.cargo, incidencia.cargoTexto ?? "-");
  escribirTexto(SELECTORS.telefono, `Teléfono: ${obtenerTelefono(incidencia)}`);
  escribirTexto(SELECTORS.email, `Dirección de correo: ${incidencia.email ?? "No disponible"}`);
  escribirTexto(SELECTORS.fechaHora, formatearFechaHoraDetalle(incidencia.fechaHora));
  escribirTexto(SELECTORS.descripcion, incidencia.descripcion || "Sin descripción.");

  aplicarClaseEstado(document.querySelector(SELECTORS.estado), estadoTexto);
}

function obtenerTituloIncidencia(incidencia) {
  return incidencia.asuntoCompleto ?? incidencia.asunto ?? "Detalle de incidencia";
}

function obtenerTelefono(incidencia) {
  return incidencia.telefono ?? incidencia.contactoTexto ?? "No disponible";
}

function escribirTexto(selector, texto) {
  const elemento = document.querySelector(selector);

  if (!elemento) {
    return;
  }

  elemento.textContent = texto ?? "";
}

/* ==============================
   FORMATEO DE ESTADO
   ============================== */

function formatearEstado(estado) {
  if (estado === "PENDIENTE") {
    return ESTADO_TEXTO.pendiente;
  }

  if (estado === "LEIDA") {
    return ESTADO_TEXTO.leida;
  }

  if (estado === "RESUELTA") {
    return ESTADO_TEXTO.resuelta;
  }

  return "-";
}

/**
 * Aplica la clase visual correspondiente al estado de la incidencia.
 * Antes de asignar la nueva clase, se eliminan todas las clases posibles
 * para garantizar que no queden estilos residuales.
 *
 * @param {HTMLElement|null} elemento Elemento donde se muestra el estado.
 * @param {string} estadoTexto Estado textual de la incidencia.
 */
function aplicarClaseEstado(elemento, estadoTexto) {
  if (!elemento) {
    return;
  }

  elemento.classList.remove(
    CLASES_ESTADO.pendiente,
    CLASES_ESTADO.leida,
    CLASES_ESTADO.resuelta,
    CLASES_ESTADO.ninguno
  );

  elemento.classList.add(obtenerClaseEstado(estadoTexto));
}

function obtenerClaseEstado(estadoTexto) {
  if (estadoTexto === ESTADO_TEXTO.pendiente) {
    return CLASES_ESTADO.pendiente;
  }

  if (estadoTexto === ESTADO_TEXTO.leida) {
    return CLASES_ESTADO.leida;
  }

  if (estadoTexto === ESTADO_TEXTO.resuelta) {
    return CLASES_ESTADO.resuelta;
  }

  return CLASES_ESTADO.ninguno;
}

/* ==============================
   CIERRE DEL PANEL
   ============================== */

/**
 * Elimina la incidencia seleccionada del almacenamiento de sesión y
 * restaura el contenido original del menú lateral cuando la vista se
 * encuentra dentro de un iframe.
 */
function cerrarPanelDetalle() {
  sessionStorage.removeItem(STORAGE_KEYS.incidenciaSeleccionada);
  restaurarMenuLateral();
}

function restaurarMenuLateral() {
  if (!window.parent || window.parent === window) {
    return;
  }

  const iframeMenu = window.parent.document.querySelector(SELECTORS.iframeMenuLateral);

  if (!iframeMenu) {
    return;
  }

  iframeMenu.src = RUTAS.menuLateral;
}
