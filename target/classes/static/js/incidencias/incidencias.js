/* ==========================================================
   Incidencias - listado JSP
   ----------------------------------------------------------
   La tabla viene renderizada por JSP.
   Este script solo gestiona selección, navegación y borrado.
   ========================================================== */

const SELECTORES = Object.freeze({
  filaIncidencia: ".fila-incidencia",

  btnVer: "#btn-ver-incidencia",
  btnEditar: "#btn-editar-incidencia",
  btnBorrar: "#btn-borrar-incidencia",

  formBorrar: "#form-borrar-incidencia",
  inputIdBorrar: "#incidencia-id-borrar"
});

const CLASES = Object.freeze({
  filaSeleccionada: "seleccionada",
  filaSeleccionadaAlternativa: "tabla-incidencias__fila--seleccionada"
});

let incidenciaSeleccionadaId = null;

document.addEventListener("DOMContentLoaded", inicializarListadoIncidencias);

function inicializarListadoIncidencias() {
  registrarEventosFilas();
  registrarEventosBotones();
  actualizarEstadoBotones();
}

function registrarEventosFilas() {
  obtenerFilasIncidencias().forEach((fila) => {
    fila.addEventListener("click", () => seleccionarFila(fila));

    fila.addEventListener("dblclick", () => {
      seleccionarFila(fila);
      irADetalleIncidencia();
    });
  });
}

function obtenerFilasIncidencias() {
  return Array.from(document.querySelectorAll(SELECTORES.filaIncidencia));
}

function seleccionarFila(filaSeleccionada) {
  limpiarSeleccionFilas();

  filaSeleccionada.classList.add(CLASES.filaSeleccionada);
  filaSeleccionada.classList.add(CLASES.filaSeleccionadaAlternativa);

  incidenciaSeleccionadaId = filaSeleccionada.dataset.id || null;

  actualizarInputBorrado();
  actualizarEstadoBotones();
}

function limpiarSeleccionFilas() {
  obtenerFilasIncidencias().forEach((fila) => {
    fila.classList.remove(CLASES.filaSeleccionada);
    fila.classList.remove(CLASES.filaSeleccionadaAlternativa);
  });
}

function registrarEventosBotones() {
  const btnVer = document.querySelector(SELECTORES.btnVer);
  const btnEditar = document.querySelector(SELECTORES.btnEditar);
  const formBorrar = document.querySelector(SELECTORES.formBorrar);

  btnVer?.addEventListener("click", irADetalleIncidencia);
  btnEditar?.addEventListener("click", irAEditarIncidencia);
  formBorrar?.addEventListener("submit", confirmarBorrado);
}

function actualizarEstadoBotones() {
  const haySeleccion = incidenciaSeleccionadaId !== null && incidenciaSeleccionadaId !== "";

  const btnVer = document.querySelector(SELECTORES.btnVer);
  const btnEditar = document.querySelector(SELECTORES.btnEditar);
  const btnBorrar = document.querySelector(SELECTORES.btnBorrar);

  if (btnVer) {
    btnVer.disabled = !haySeleccion;
  }

  if (btnEditar) {
    btnEditar.disabled = !haySeleccion;
  }

  if (btnBorrar) {
    btnBorrar.disabled = !haySeleccion;
  }
}

function actualizarInputBorrado() {
  const inputIdBorrar = document.querySelector(SELECTORES.inputIdBorrar);

  if (inputIdBorrar) {
    inputIdBorrar.value = incidenciaSeleccionadaId || "";
  }
}

function irADetalleIncidencia() {
  if (!incidenciaSeleccionadaId) {
    return;
  }

  window.location.href = construirUrl(`/incidencias/detalle?id=${incidenciaSeleccionadaId}`);
}

function irAEditarIncidencia() {
  if (!incidenciaSeleccionadaId) {
    return;
  }

  window.location.href = construirUrl(`/incidencias/editar?id=${incidenciaSeleccionadaId}`);
}

function confirmarBorrado(evento) {
  if (!incidenciaSeleccionadaId) {
    evento.preventDefault();
    return;
  }

  const confirmado = confirm("¿Seguro que quieres eliminar esta incidencia?");

  if (!confirmado) {
    evento.preventDefault();
  }
}

function construirUrl(ruta) {
  return `${obtenerContextPath()}${ruta}`;
}

function obtenerContextPath() {
  return document.body?.dataset?.contextPath || "";
}