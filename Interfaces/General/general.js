// ==============================
// SCRIPT GENERAL
// ==============================

const botonLogout = document.querySelector(".panel-coordinadores__logout");
const iframeMenuLateral = document.querySelector("#iframe-menu-lateral");
const iframeContenido = document.querySelector(".contenido-iframe");

const SRC_MENU_LATERAL = "../MenuLateral/menu-lateral.html";

const SRC_FILTRO_COORDINADORES = "../GestionarCoordinadores/panelFiltro.html";
const SRC_FILTRO_INCIDENCIAS = "../Incidencias/panelFiltro.html";

if (botonLogout) {
  botonLogout.addEventListener("click", (evento) => {
    evento.preventDefault();
    alert("¿Estás seguro de que deseas cerrar sesión?");
  });
}

// ==============================
// COMUNICACIÓN ENTRE IFRAMES
// ==============================

window.addEventListener("message", (evento) => {
  const mensaje = evento.data;

  if (!mensaje || typeof mensaje !== "object") return;

  gestionarMensajesCoordinadores(mensaje);
  gestionarMensajesIncidencias(mensaje);
});

// ==============================
// COORDINADORES
// ==============================

function gestionarMensajesCoordinadores(mensaje) {
  if (mensaje.tipo === "ABRIR_FILTRO_COORDINADORES") {
    abrirFiltroCoordinadores();
  }

  if (mensaje.tipo === "CERRAR_FILTRO_COORDINADORES") {
    cerrarPanelLateral();
  }

  if (mensaje.tipo === "APLICAR_FILTROS_COORDINADORES") {
    enviarMensajeAContenido(mensaje);
  }

  if (mensaje.tipo === "LIMPIAR_FILTROS_COORDINADORES") {
    enviarMensajeAContenido(mensaje);
  }

  if (mensaje.tipo === "PEDIR_CAMPANIAS_COORDINADORES") {
    enviarMensajeAContenido(mensaje);
  }

  if (mensaje.tipo === "COORDINADORES_CAMPANIAS_CARGADAS") {
    enviarMensajeALateral(mensaje);
  }
}

function abrirFiltroCoordinadores() {
  cambiarPanelLateral(
    SRC_FILTRO_COORDINADORES,
    "Filtro de coordinadores"
  );
}

// ==============================
// INCIDENCIAS
// ==============================

function gestionarMensajesIncidencias(mensaje) {
  if (mensaje.tipo === "ABRIR_FILTRO_INCIDENCIAS") {
    abrirFiltroIncidencias();
  }

  if (mensaje.tipo === "CERRAR_FILTRO_INCIDENCIAS") {
    cerrarPanelLateral();
  }

  if (mensaje.tipo === "APLICAR_FILTROS_INCIDENCIAS") {
    enviarMensajeAContenido(mensaje);
  }

  if (mensaje.tipo === "LIMPIAR_FILTROS_INCIDENCIAS") {
    enviarMensajeAContenido(mensaje);
  }
}

function abrirFiltroIncidencias() {
  cambiarPanelLateral(
    SRC_FILTRO_INCIDENCIAS,
    "Filtro de incidencias"
  );
}

// ==============================
// UTILIDADES IFRAME
// ==============================

function cambiarPanelLateral(src, title) {
  if (!iframeMenuLateral) return;

  iframeMenuLateral.src = src;
  iframeMenuLateral.title = title;
}

function cerrarPanelLateral() {
  if (!iframeMenuLateral) return;

  iframeMenuLateral.src = SRC_MENU_LATERAL;
  iframeMenuLateral.title = "Menú lateral de administración";
}

function enviarMensajeAContenido(mensaje) {
  if (!iframeContenido || !iframeContenido.contentWindow) return;

  iframeContenido.contentWindow.postMessage(mensaje, "*");
}

function enviarMensajeALateral(mensaje) {
  if (!iframeMenuLateral || !iframeMenuLateral.contentWindow) return;

  iframeMenuLateral.contentWindow.postMessage(mensaje, "*");
}