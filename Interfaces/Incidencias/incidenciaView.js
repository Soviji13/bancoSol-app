/* ==========================================================
   Vista de incidencias
   ----------------------------------------------------------
   Este módulo contiene las funciones de representación visual
   de la tabla de incidencias, la gestión de selección de filas,
   el estado de los botones de acción y la apertura del panel
   lateral de detalle.
   ========================================================== */

import {
  obtenerClaseEstado
} from "./incidenciaMapper.js";

/* ==============================
   SELECTORES DE LA INTERFAZ
   ============================== */

const SELECTORES = Object.freeze({
  tablaBody: "#tabla-incidencias-body",
  tituloCampania: "#titulo-campania",
  mensaje: "#mensaje-incidencias",

  btnFiltro: "#btn-filtro",
  btnAyuda: "#btn-ayuda",
  btnAnadir: "#btn-anadir",
  btnConfirmarLectura: "#btn-confirmar-lectura",
  btnConfirmarResolucion: "#btn-confirmar-resolucion",

  iframeMenuLateral: ".menu-lateral-iframe"
});

const RUTAS = Object.freeze({
  panelDetalleIncidencia: "../Incidencias/incidenciaSeleccionada.html"
});

const STORAGE_KEYS = Object.freeze({
  incidenciaSeleccionada: "incidenciaSeleccionada"
});

const ESTADO_INCIDENCIA = Object.freeze({
  LEIDA: "LEIDA",
  RESUELTA: "RESUELTA"
});

/* ==============================
   OBTENCIÓN DE ELEMENTOS
   ============================== */

/**
 * Obtiene las referencias principales de la interfaz de incidencias.
 * Centralizar esta operación permite que el controlador de la vista
 * trabaje con un único objeto de elementos DOM.
 *
 * @returns {object} Elementos principales de la interfaz.
 */
export function obtenerElementos() {
  return {
    cuerpoTabla: document.querySelector(SELECTORES.tablaBody),
    tituloCampania: document.querySelector(SELECTORES.tituloCampania),
    mensaje: document.querySelector(SELECTORES.mensaje),

    botonFiltro: document.querySelector(SELECTORES.btnFiltro),
    botonAyuda: document.querySelector(SELECTORES.btnAyuda),
    botonAnadir: document.querySelector(SELECTORES.btnAnadir),
    botonConfirmarLectura: document.querySelector(SELECTORES.btnConfirmarLectura),
    botonConfirmarResolucion: document.querySelector(SELECTORES.btnConfirmarResolucion)
  };
}

/* ==============================
   RENDERIZADO DE TABLA
   ============================== */

/**
 * Representa en la tabla el conjunto de incidencias recibido.
 * En caso de no existir registros, se muestra una fila informativa.
 *
 * @param {object} parametros Parámetros de renderizado.
 * @param {HTMLTableSectionElement} parametros.cuerpoTabla Cuerpo de la tabla.
 * @param {Array<object>} parametros.incidencias Incidencias que se van a representar.
 * @param {Function} parametros.onSeleccionarFila Función ejecutada al seleccionar una fila.
 * @param {Function} parametros.onDobleClickFila Función ejecutada al abrir el detalle.
 */
export function pintarIncidencias({
  cuerpoTabla,
  incidencias,
  onSeleccionarFila,
  onDobleClickFila
}) {
  if (!cuerpoTabla) {
    return;
  }

  cuerpoTabla.replaceChildren();

  if (!incidencias || incidencias.length === 0) {
    cuerpoTabla.appendChild(crearFilaVacia());
    return;
  }

  const fragmento = document.createDocumentFragment();

  incidencias.forEach((incidencia) => {
    fragmento.appendChild(
      crearFilaIncidencia({
        incidencia,
        onSeleccionarFila,
        onDobleClickFila
      })
    );
  });

  cuerpoTabla.appendChild(fragmento);
}

/**
 * Crea una fila informativa para los casos en los que no existan
 * incidencias disponibles.
 *
 * @returns {HTMLTableRowElement} Fila vacía.
 */
function crearFilaVacia() {
  const fila = document.createElement("tr");
  const celda = document.createElement("td");

  celda.colSpan = 7;
  celda.className = "estado-vacio";
  celda.textContent = "No hay incidencias registradas.";

  fila.appendChild(celda);
  return fila;
}

/**
 * Crea una fila de tabla correspondiente a una incidencia.
 * Los datos dinámicos se insertan mediante textContent para evitar
 * inyección de HTML.
 *
 * @param {object} parametros Parámetros de creación de fila.
 * @param {object} parametros.incidencia Incidencia representada.
 * @param {Function} parametros.onSeleccionarFila Manejador de selección.
 * @param {Function} parametros.onDobleClickFila Manejador de doble click.
 * @returns {HTMLTableRowElement} Fila de incidencia.
 */
function crearFilaIncidencia({
  incidencia,
  onSeleccionarFila,
  onDobleClickFila
}) {
  const fila = document.createElement("tr");

  fila.tabIndex = 0;
  fila.dataset.id = incidencia.id;
  fila.setAttribute("aria-selected", "false");

  fila.appendChild(crearCelda(incidencia.id));
  fila.appendChild(crearCelda(incidencia.reportadoPorNombre));
  fila.appendChild(crearCelda(incidencia.cargoTexto));
  fila.appendChild(crearCelda(incidencia.horaTexto));
  fila.appendChild(crearCelda(incidencia.fechaTexto));
  fila.appendChild(crearCeldaAsunto(incidencia.asunto));
  fila.appendChild(crearCeldaEstado(incidencia));

  registrarEventosFila({
    fila,
    incidencia,
    onSeleccionarFila,
    onDobleClickFila
  });

  return fila;
}

/**
 * Registra los eventos de interacción de una fila.
 * Se admite selección mediante click, doble click y teclado.
 *
 * @param {object} parametros Parámetros de registro.
 */
function registrarEventosFila({
  fila,
  incidencia,
  onSeleccionarFila,
  onDobleClickFila
}) {
  fila.addEventListener("click", () => {
    onSeleccionarFila(fila, incidencia);
  });

  fila.addEventListener("dblclick", () => {
    onSeleccionarFila(fila, incidencia);
    onDobleClickFila(incidencia);
  });

  fila.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      onSeleccionarFila(fila, incidencia);
    }
  });
}

function crearCelda(texto) {
  const celda = document.createElement("td");

  celda.textContent = texto ?? "";

  return celda;
}

function crearCeldaAsunto(asunto) {
  const celda = document.createElement("td");

  celda.className = "celda-asunto";
  celda.title = asunto ?? "";
  celda.textContent = asunto ?? "";

  return celda;
}

function crearCeldaEstado(incidencia) {
  const celda = document.createElement("td");
  const estado = document.createElement("span");

  estado.className = `estado ${obtenerClaseEstado(incidencia.estado)}`;
  estado.textContent = incidencia.estadoTexto ?? "";

  celda.appendChild(estado);

  return celda;
}

/* ==============================
   SELECCIÓN DE FILAS
   ============================== */

/**
 * Marca una fila como seleccionada y elimina previamente cualquier
 * selección activa en el cuerpo de la tabla.
 *
 * @param {HTMLTableSectionElement} cuerpoTabla Cuerpo de la tabla.
 * @param {HTMLTableRowElement} fila Fila que debe quedar seleccionada.
 */
export function marcarFilaSeleccionada(cuerpoTabla, fila) {
  if (!cuerpoTabla || !fila) {
    return;
  }

  limpiarSeleccionFilas(cuerpoTabla);

  fila.classList.add("seleccionada");
  fila.classList.add("tabla-incidencias__fila--seleccionada");
  fila.setAttribute("aria-selected", "true");
}

/**
 * Elimina la selección visual de todas las filas de la tabla.
 *
 * @param {HTMLTableSectionElement} cuerpoTabla Cuerpo de la tabla.
 */
export function limpiarSeleccionFilas(cuerpoTabla) {
  if (!cuerpoTabla) {
    return;
  }

  cuerpoTabla.querySelectorAll("tr").forEach((fila) => {
    fila.classList.remove("seleccionada");
    fila.classList.remove("tabla-incidencias__fila--seleccionada");
    fila.setAttribute("aria-selected", "false");
  });
}

/* ==============================
   ESTADO DE BOTONES
   ============================== */

/**
 * Habilita o deshabilita los botones de cambio de estado según la
 * incidencia seleccionada.
 *
 * @param {object} parametros Parámetros de actualización.
 * @param {HTMLButtonElement} parametros.botonConfirmarLectura Botón de lectura.
 * @param {HTMLButtonElement} parametros.botonConfirmarResolucion Botón de resolución.
 * @param {object|null} parametros.incidenciaSeleccionada Incidencia seleccionada.
 */
export function actualizarEstadoBotones({
  botonConfirmarLectura,
  botonConfirmarResolucion,
  incidenciaSeleccionada
}) {
  if (!botonConfirmarLectura || !botonConfirmarResolucion) {
    return;
  }

  const haySeleccion = Boolean(incidenciaSeleccionada);
  const estado = incidenciaSeleccionada?.estado;

  botonConfirmarLectura.disabled =
    !haySeleccion ||
    estado === ESTADO_INCIDENCIA.LEIDA ||
    estado === ESTADO_INCIDENCIA.RESUELTA;

  botonConfirmarResolucion.disabled =
    !haySeleccion ||
    estado === ESTADO_INCIDENCIA.RESUELTA;
}

/* ==============================
   PANEL LATERAL
   ============================== */

/**
 * Guarda la incidencia seleccionada y solicita la apertura del panel
 * lateral de detalle cuando la vista se ejecuta dentro de un iframe.
 *
 * @param {object} incidencia Incidencia seleccionada.
 */
export function abrirPanelLateral(incidencia) {
  sessionStorage.setItem(
    STORAGE_KEYS.incidenciaSeleccionada,
    JSON.stringify(incidencia)
  );

  if (!window.parent || window.parent === window) {
    return;
  }

  const iframeMenu = window.parent.document.querySelector(SELECTORES.iframeMenuLateral);

  if (!iframeMenu) {
    return;
  }

  iframeMenu.src = RUTAS.panelDetalleIncidencia;
}

/* ==============================
   MENSAJES DE LA INTERFAZ
   ============================== */

/**
 * Muestra un mensaje informativo en la zona correspondiente de la vista.
 *
 * @param {HTMLElement|null} elementoMensaje Elemento de mensaje.
 * @param {string} texto Texto que debe mostrarse.
 */
export function mostrarMensaje(elementoMensaje, texto) {
  if (!elementoMensaje) {
    return;
  }

  elementoMensaje.textContent = texto ?? "";
}
