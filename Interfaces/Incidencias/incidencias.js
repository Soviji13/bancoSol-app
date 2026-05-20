/* ==========================================================
   Controlador de incidencias
   ----------------------------------------------------------
   Este módulo coordina la carga de datos, el filtrado, la
   selección de filas, la actualización de estado y la
   comunicación con el menú lateral. La comunicación HTTP, el
   mapeo de datos y el renderizado se delegan en módulos
   especializados.
   ========================================================== */

import {
  listarIncidencias,
  actualizarIncidencia
} from "./incidenciaApi.js";

import {
  mapearIncidenciaDesdeAPI,
  mapearIncidenciaConNuevoEstado
} from "./incidenciaMapper.js";

import {
  obtenerElementos,
  pintarIncidencias,
  marcarFilaSeleccionada,
  limpiarSeleccionFilas,
  actualizarEstadoBotones,
  abrirPanelLateral,
  mostrarMensaje
} from "./incidenciaView.js";

/* ==============================
   CONSTANTES DE COMUNICACIÓN
   ============================== */

const CANAL_BANCOSOL = "bancosol_channel";

const MENSAJES_CANAL = Object.freeze({
  recargarIncidencias: "recargar-tabla-incidencias",
  recargarTabla: "recargar-tabla"
});

const MENSAJES_PARENT = Object.freeze({
  abrirFiltroIncidencias: "ABRIR_FILTRO_INCIDENCIAS",
  aplicarFiltrosIncidencias: "APLICAR_FILTROS_INCIDENCIAS",
  limpiarFiltrosIncidencias: "LIMPIAR_FILTROS_INCIDENCIAS",
  cerrarFiltroIncidencias: "CERRAR_FILTRO_INCIDENCIAS"
});

const ESTADO_INCIDENCIA = Object.freeze({
  LEIDA: "LEIDA",
  RESUELTA: "RESUELTA"
});

const STORAGE_KEYS = Object.freeze({
  incidenciasCache: "incidenciasCache"
});

const RUTAS = Object.freeze({
  formularioCreacion: "formIncidencia.html?modo=crear",
  menuLateral: "../MenuLateral/menu-lateral.html"
});

const SELECTORES_PARENT = Object.freeze({
  iframeMenuLateral: ".menu-lateral-iframe"
});

/* ==============================
   ESTADO DEL CONTROLADOR
   ============================== */

const estadoVista = {
  incidenciasOriginales: [],
  incidenciasFiltradas: [],
  incidenciaSeleccionada: null,
  filtrosActivos: crearFiltrosVacios()
};

let elementos = null;

const canalComunicacion = new BroadcastChannel(CANAL_BANCOSOL);

/* ==============================
   INICIALIZACIÓN
   ============================== */

/**
 * Inicializa la pantalla de incidencias cuando el DOM está disponible.
 * Se obtienen las referencias de la vista, se registran los eventos y
 * se solicita la información inicial al backend.
 */
document.addEventListener("DOMContentLoaded", inicializarVistaIncidencias);

function inicializarVistaIncidencias() {
  elementos = obtenerElementos();

  registrarEventosInterfaz();
  cargarIncidencias();
}

/* ==============================
   REGISTRO DE EVENTOS
   ============================== */

/**
 * Registra los eventos principales de la pantalla y de los canales de
 * comunicación entre iframes.
 */
function registrarEventosInterfaz() {
  elementos.botonFiltro?.addEventListener("click", abrirFiltroEnMenuLateral);
  elementos.botonAyuda?.addEventListener("click", mostrarAyuda);
  elementos.botonAnadir?.addEventListener("click", irAFormularioCreacion);
  elementos.botonConfirmarLectura?.addEventListener("click", confirmarLectura);
  elementos.botonConfirmarResolucion?.addEventListener("click", confirmarResolucion);

  canalComunicacion.addEventListener("message", gestionarMensajeCanal);
  window.addEventListener("message", gestionarMensajeDocumentoPadre);
}

/* ==============================
   COMUNICACIÓN ENTRE VISTAS
   ============================== */

/**
 * Gestiona los mensajes enviados por otras vistas mediante
 * BroadcastChannel. Se utiliza para mantener sincronizada la tabla
 * después de crear o actualizar incidencias.
 *
 * @param {MessageEvent} evento Evento recibido desde el canal.
 */
function gestionarMensajeCanal(evento) {
  const mensaje = evento.data;

  if (
    mensaje === MENSAJES_CANAL.recargarIncidencias ||
    mensaje === MENSAJES_CANAL.recargarTabla
  ) {
    cargarIncidencias();
    resetearSeleccion();
  }
}

/**
 * Gestiona los mensajes procedentes del documento padre o del panel de
 * filtros. Estos mensajes permiten aplicar, limpiar o cerrar filtros.
 *
 * @param {MessageEvent} evento Evento recibido por window.postMessage.
 */
function gestionarMensajeDocumentoPadre(evento) {
  const mensaje = evento.data;

  if (!mensaje || typeof mensaje !== "object") {
    return;
  }

  if (mensaje.tipo === MENSAJES_PARENT.aplicarFiltrosIncidencias) {
    aplicarFiltros(mensaje.filtros);
    return;
  }

  if (mensaje.tipo === MENSAJES_PARENT.limpiarFiltrosIncidencias) {
    limpiarFiltros();
    return;
  }

  if (mensaje.tipo === MENSAJES_PARENT.cerrarFiltroIncidencias) {
    restaurarMenuLateral();
  }
}

function abrirFiltroEnMenuLateral() {
  window.parent.postMessage(
    {
      tipo: MENSAJES_PARENT.abrirFiltroIncidencias
    },
    "*"
  );
}

function restaurarMenuLateral() {
  if (!window.parent || window.parent === window) {
    return;
  }

  const iframeMenu = window.parent.document.querySelector(SELECTORES_PARENT.iframeMenuLateral);

  if (!iframeMenu) {
    return;
  }

  iframeMenu.src = RUTAS.menuLateral;
}

/* ==============================
   CARGA DE DATOS
   ============================== */

/**
 * Solicita las incidencias al backend, las transforma al modelo de vista
 * y refresca la tabla respetando los filtros activos.
 */
async function cargarIncidencias() {
  mostrarMensaje(elementos.mensaje, "Cargando incidencias...");

  try {
    const incidenciasAPI = await listarIncidencias();

    estadoVista.incidenciasOriginales = normalizarColeccion(incidenciasAPI)
      .map(mapearIncidenciaDesdeAPI);

    guardarIncidenciasEnSesion();
    aplicarFiltros(estadoVista.filtrosActivos, false);
    mostrarMensaje(elementos.mensaje, "");
  } catch (error) {
    console.error(error);
    mostrarMensaje(elementos.mensaje, "No se han podido cargar las incidencias.");
  }
}

function normalizarColeccion(datos) {
  return Array.isArray(datos) ? datos : [];
}

function guardarIncidenciasEnSesion() {
  sessionStorage.setItem(
    STORAGE_KEYS.incidenciasCache,
    JSON.stringify(estadoVista.incidenciasOriginales)
  );
}

/* ==============================
   RENDERIZADO Y SELECCIÓN
   ============================== */

function renderizarTabla(incidencias) {
  estadoVista.incidenciasFiltradas = incidencias;

  pintarIncidencias({
    cuerpoTabla: elementos.cuerpoTabla,
    incidencias,
    onSeleccionarFila: seleccionarFila,
    onDobleClickFila: abrirPanelLateral
  });
}

function seleccionarFila(fila, incidencia) {
  marcarFilaSeleccionada(elementos.cuerpoTabla, fila);
  estadoVista.incidenciaSeleccionada = incidencia;
  actualizarBotones();
}

function resetearSeleccion() {
  estadoVista.incidenciaSeleccionada = null;
  limpiarSeleccionFilas(elementos?.cuerpoTabla);
  actualizarBotones();
}

function actualizarBotones() {
  actualizarEstadoBotones({
    botonConfirmarLectura: elementos.botonConfirmarLectura,
    botonConfirmarResolucion: elementos.botonConfirmarResolucion,
    incidenciaSeleccionada: estadoVista.incidenciaSeleccionada
  });
}

/* ==============================
   ACCIONES DE ESTADO
   ============================== */

function confirmarLectura() {
  cambiarEstadoSeleccionada(ESTADO_INCIDENCIA.LEIDA);
}

function confirmarResolucion() {
  cambiarEstadoSeleccionada(ESTADO_INCIDENCIA.RESUELTA);
}

/**
 * Actualiza el estado de la incidencia seleccionada y recarga el listado
 * para conservar la coherencia entre la interfaz y el backend.
 *
 * @param {string} nuevoEstado Estado que debe asignarse.
 */
async function cambiarEstadoSeleccionada(nuevoEstado) {
  const incidencia = estadoVista.incidenciaSeleccionada;

  if (!incidencia) {
    alert("Debes seleccionar primero una incidencia.");
    return;
  }

  try {
    const datosActualizados = mapearIncidenciaConNuevoEstado(incidencia, nuevoEstado);

    await actualizarIncidencia(incidencia.id, datosActualizados);
    await cargarIncidencias();

    canalComunicacion.postMessage(MENSAJES_CANAL.recargarIncidencias);
  } catch (error) {
    console.error(error);
    alert("No se ha podido actualizar el estado de la incidencia.");
  }
}

/* ==============================
   FILTRADO
   ============================== */

/**
 * Aplica los filtros recibidos sobre el conjunto original de incidencias.
 * Los filtros activos se conservan para permitir recargas sin perder el
 * criterio de búsqueda actual.
 *
 * @param {object} filtros Filtros recibidos desde el panel lateral.
 * @param {boolean} actualizarContador Indica si debe actualizarse el contador visual.
 */
function aplicarFiltros(filtros, actualizarContador = true) {
  estadoVista.filtrosActivos = normalizarFiltros(filtros);

  const incidenciasFiltradas = estadoVista.incidenciasOriginales
    .filter(cumpleFiltrosActivos);

  renderizarTabla(incidenciasFiltradas);
  resetearSeleccion();

  if (actualizarContador) {
    actualizarContadorFiltros();
  }
}

function limpiarFiltros() {
  estadoVista.filtrosActivos = crearFiltrosVacios();

  renderizarTabla(estadoVista.incidenciasOriginales);
  resetearSeleccion();
  actualizarContadorFiltros();
}

function crearFiltrosVacios() {
  return {
    reportadoPor: "",
    estado: "",
    cargo: "",
    asunto: ""
  };
}

function normalizarFiltros(filtros = {}) {
  return {
    reportadoPor: filtros.reportadoPor || "",
    estado: filtros.estado || "",
    cargo: filtros.cargo || "",
    asunto: filtros.asunto || ""
  };
}

function cumpleFiltrosActivos(incidencia) {
  const filtros = estadoVista.filtrosActivos;

  return cumpleFiltroReportadoPor(incidencia, filtros.reportadoPor) &&
    cumpleFiltroEstado(incidencia, filtros.estado) &&
    cumpleFiltroCargo(incidencia, filtros.cargo) &&
    cumpleFiltroAsunto(incidencia, filtros.asunto);
}

function cumpleFiltroReportadoPor(incidencia, filtroReportadoPor) {
  if (!filtroReportadoPor) {
    return true;
  }

  return normalizarTexto(incidencia.reportadoPorNombre)
    .includes(normalizarTexto(filtroReportadoPor));
}

function cumpleFiltroEstado(incidencia, filtroEstado) {
  return !filtroEstado || incidencia.estado === filtroEstado;
}

function cumpleFiltroCargo(incidencia, filtroCargo) {
  return !filtroCargo || incidencia.reportadoPorTipo === filtroCargo;
}

function cumpleFiltroAsunto(incidencia, filtroAsunto) {
  if (!filtroAsunto) {
    return true;
  }

  return normalizarTexto(incidencia.asunto)
    .includes(normalizarTexto(filtroAsunto));
}

function actualizarContadorFiltros() {
  const contador = document.querySelector("#contador-filtros");

  if (!contador) {
    return;
  }

  const totalFiltrosActivos = Object.values(estadoVista.filtrosActivos)
    .filter((valor) => valor !== "")
    .length;

  contador.textContent = String(totalFiltrosActivos);
  contador.hidden = totalFiltrosActivos === 0;
}

/* ==============================
   NAVEGACIÓN Y AYUDA
   ============================== */

function irAFormularioCreacion() {
  window.location.href = RUTAS.formularioCreacion;
}

function mostrarAyuda() {
  alert(
    "Pantalla de incidencias.\n\n" +
    "- Doble click sobre una fila: ver detalle.\n" +
    "- Click sobre una fila: seleccionarla.\n" +
    "- Confirmar lectura cambia el estado a LEIDA.\n" +
    "- Confirmar resolución cambia el estado a RESUELTA.\n" +
    "- El botón de filtro sustituye el menú lateral por el panel de filtros."
  );
}

/* ==============================
   UTILIDADES GENERALES
   ============================== */

function normalizarTexto(texto) {
  return String(texto ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
