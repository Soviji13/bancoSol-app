/* ==========================================================
   Panel de filtros de coordinadores
   ----------------------------------------------------------
   Este módulo gestiona la lectura, aplicación y limpieza de los
   filtros asociados a la pantalla de coordinadores.
   ========================================================== */

/* ==============================
   SELECTORES
   ============================== */

const SELECTORES = Object.freeze({
  formFiltro: "#form-filtro",
  btnCerrarFiltro: "#btn-cerrar-filtro",
  btnLimpiarFiltro: "#btn-limpiar-filtro",
  selectCampania: "#filtro-campania",

  filtroNombre: "#filtro-nombre",
  filtroTiendas: "#filtro-tiendas"
});

/* ==============================
   MENSAJES
   ============================== */

const MENSAJES_PARENT = Object.freeze({
  cerrarFiltro: "CERRAR_FILTRO_COORDINADORES",
  aplicarFiltros: "APLICAR_FILTROS_COORDINADORES",
  limpiarFiltros: "LIMPIAR_FILTROS_COORDINADORES",
  pedirCampanias: "PEDIR_CAMPANIAS_COORDINADORES",
  campaniasCargadas: "COORDINADORES_CAMPANIAS_CARGADAS"
});

/* ==============================
   INICIALIZACIÓN
   ============================== */

document.addEventListener("DOMContentLoaded", inicializarPanelFiltros);

function inicializarPanelFiltros() {
  registrarEventos();
  pedirCampanias();
}

/* ==============================
   EVENTOS
   ============================== */

function registrarEventos() {
  document.querySelector(SELECTORES.btnCerrarFiltro)?.addEventListener("click", cerrarPanelFiltros);
  document.querySelector(SELECTORES.formFiltro)?.addEventListener("submit", aplicarFiltros);
  document.querySelector(SELECTORES.btnLimpiarFiltro)?.addEventListener("click", limpiarFiltros);

  window.addEventListener("message", gestionarMensajePadre);
}

function gestionarMensajePadre(evento) {
  const mensaje = evento.data;

  if (!mensaje || typeof mensaje !== "object") {
    return;
  }

  if (mensaje.tipo === MENSAJES_PARENT.campaniasCargadas) {
    pintarCampanias(mensaje.campanias);
  }
}

/* ==============================
   ACCIONES
   ============================== */

function cerrarPanelFiltros() {
  enviarMensajeAlPadre({
    tipo: MENSAJES_PARENT.cerrarFiltro
  });
}

function aplicarFiltros(evento) {
  evento.preventDefault();

  enviarMensajeAlPadre({
    tipo: MENSAJES_PARENT.aplicarFiltros,
    filtros: leerFiltros()
  });
}

function limpiarFiltros() {
  const formFiltro = document.querySelector(SELECTORES.formFiltro);

  formFiltro?.reset();

  enviarMensajeAlPadre({
    tipo: MENSAJES_PARENT.limpiarFiltros
  });
}

function pedirCampanias() {
  enviarMensajeAlPadre({
    tipo: MENSAJES_PARENT.pedirCampanias
  });
}

/* ==============================
   LECTURA Y RENDERIZADO
   ============================== */

function leerFiltros() {
  return {
    nombre: obtenerValorCampo(SELECTORES.filtroNombre),
    campaniaId: obtenerValorCampo(SELECTORES.selectCampania),
    tiendas: obtenerValorCampo(SELECTORES.filtroTiendas)
  };
}

function pintarCampanias(campanias) {
  const selectCampania = document.querySelector(SELECTORES.selectCampania);

  if (!selectCampania) {
    return;
  }

  selectCampania.replaceChildren();
  selectCampania.add(new Option("Todas las campañas", ""));

  if (!Array.isArray(campanias)) {
    return;
  }

  campanias.forEach((campania) => {
    selectCampania.add(
      new Option(
        campania.nombre || `Campaña ${campania.id}`,
        campania.id
      )
    );
  });
}

function obtenerValorCampo(selector) {
  return document.querySelector(selector)?.value.trim() || "";
}

/* ==============================
   COMUNICACIÓN
   ============================== */

function enviarMensajeAlPadre(mensaje) {
  window.parent.postMessage(mensaje, "*");
}