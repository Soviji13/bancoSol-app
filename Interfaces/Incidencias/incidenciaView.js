// ==============================
// VIEW INCIDENCIAS
// ==============================

import {
  obtenerClaseEstado
} from "./incidenciaMapper.js";

// ==============================
// SELECTORES
// ==============================

const SELECTORES = {
  tablaBody: "#tabla-incidencias-body",
  tituloCampania: "#titulo-campania",
  mensaje: "#mensaje-incidencias",
  btnFiltro: "#btn-filtro",
  btnAyuda: "#btn-ayuda",
  btnAnadir: "#btn-anadir",
  btnConfirmarLectura: "#btn-confirmar-lectura",
  btnConfirmarResolucion: "#btn-confirmar-resolucion"
};

// ==============================
// ELEMENTOS
// ==============================

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

// ==============================
// TABLA
// ==============================

export function pintarIncidencias({
  cuerpoTabla,
  incidencias,
  onSeleccionarFila,
  onDobleClickFila
}) {
  cuerpoTabla.innerHTML = "";

  if (!incidencias || incidencias.length === 0) {
    const filaVacia = document.createElement("tr");

    filaVacia.innerHTML = `
      <td colspan="8">No hay incidencias registradas.</td>
    `;

    cuerpoTabla.appendChild(filaVacia);
    return;
  }

  incidencias.forEach((incidencia) => {
    const fila = document.createElement("tr");

    fila.tabIndex = 0;
    fila.dataset.id = incidencia.id;
    fila.setAttribute("aria-selected", "false");

    fila.innerHTML = crearHTMLFila(incidencia);

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

    cuerpoTabla.appendChild(fila);
  });
}

function crearHTMLFila(incidencia) {
  return `
    <td>${escaparHTML(incidencia.tipo)}</td>
    <td>${escaparHTML(incidencia.reportadoPorNombre)}</td>
    <td>${escaparHTML(incidencia.cargoTexto)}</td>
    <td>${escaparHTML(incidencia.contactoTexto)}</td>
    <td>${escaparHTML(incidencia.horaTexto)}</td>
    <td>${escaparHTML(incidencia.fechaTexto)}</td>
    <td class="celda-asunto" title="${escaparHTML(incidencia.asunto)}">
      ${escaparHTML(incidencia.asunto)}
    </td>
    <td>
      <span class="estado ${obtenerClaseEstado(incidencia.estado)}">
        ${escaparHTML(incidencia.estadoTexto)}
      </span>
    </td>
  `;
}

export function marcarFilaSeleccionada(cuerpoTabla, fila) {
  limpiarSeleccionFilas(cuerpoTabla);

  fila.classList.add("seleccionada");
  fila.classList.add("tabla-incidencias__fila--seleccionada");
  fila.setAttribute("aria-selected", "true");
}

export function limpiarSeleccionFilas(cuerpoTabla) {
  const filas = cuerpoTabla.querySelectorAll("tr");

  filas.forEach((fila) => {
    fila.classList.remove("seleccionada");
    fila.classList.remove("tabla-incidencias__fila--seleccionada");
    fila.setAttribute("aria-selected", "false");
  });
}

// ==============================
// BOTONES
// ==============================

export function actualizarEstadoBotones({
  botonConfirmarLectura,
  botonConfirmarResolucion,
  incidenciaSeleccionada
}) {
  const haySeleccion = Boolean(incidenciaSeleccionada);

  botonConfirmarLectura.disabled = !haySeleccion ||
    incidenciaSeleccionada?.estado === "LEIDA" ||
    incidenciaSeleccionada?.estado === "RESUELTA";

  botonConfirmarResolucion.disabled = !haySeleccion ||
    incidenciaSeleccionada?.estado === "RESUELTA";
}

// ==============================
// PANEL LATERAL
// ==============================

export function abrirPanelLateral(incidencia) {
  sessionStorage.setItem(
    "incidenciaSeleccionada",
    JSON.stringify(incidencia)
  );

  if (window.parent && window.parent !== window) {
    const iframeMenu = window.parent.document.querySelector(".menu-lateral-iframe");

    if (iframeMenu) {
      iframeMenu.src = "../Incidencias/incidenciaSeleccionada.html";
    }
  }
}

// ==============================
// MENSAJES
// ==============================

export function mostrarMensaje(elementoMensaje, texto) {
  if (!elementoMensaje) {
    return;
  }

  elementoMensaje.textContent = texto ?? "";
}

// ==============================
// UTILS
// ==============================

function escaparHTML(texto) {
  const span = document.createElement("span");
  span.textContent = texto ?? "";
  return span.innerHTML;
}