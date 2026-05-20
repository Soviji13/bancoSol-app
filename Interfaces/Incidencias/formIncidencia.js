/* ==========================================================
   Formulario de incidencias
   ----------------------------------------------------------
   Este módulo gestiona la carga de responsables, la validación
   del formulario, el envío de incidencias al backend y la
   comunicación con otras vistas de la aplicación BancoSol.
   ========================================================== */

import {
  obtenerFechaHoraActualSinZona
} from "../utils/fechaUtils.js";

import {
  crearIncidencia
} from "./incidenciaApi.js";

/* ==============================
   CONFIGURACIÓN GENERAL
   ============================== */

const API_BASE_URL = "http://localhost:8080/api";
const CHANNEL_NAME = "bancosol_channel";
const REFRESH_INCIDENCIAS_MESSAGE = "recargar-tabla-incidencias";

const ENDPOINTS = Object.freeze({
  responsablesTienda: `${API_BASE_URL}/responsables-tiendas`,
  responsablesEntidad: `${API_BASE_URL}/responsables-entidades`
});

const TIPO_RESPONSABLE = Object.freeze({
  TIENDA: "RESPONSABLE_TIENDA",
  ENTIDAD: "RESPONSABLE_ENTIDAD"
});

const SELECTORS = Object.freeze({
  form: "#form-incidencia",
  btnVolver: "#btn-volver",
  btnCancelar: "#btn-cancelar",
  tipoResponsable: "#tipo-responsable",
  responsable: "#responsable-id",
  loader: "#loading-overlay"
});

const MENSAJES = Object.freeze({
  asuntoObligatorio: "El asunto es obligatorio.",
  responsableObligatorio: "Debes seleccionar un responsable.",
  incidenciaCreada: "Incidencia creada correctamente.",
  errorCargaResponsables:
    "No se pudieron cargar los responsables.\n\n" +
    "Comprueba que existan los endpoints:\n" +
    "/api/responsables-tiendas\n" +
    "/api/responsables-entidades",
  errorGuardadoIncidencia: "No se pudo guardar la incidencia.",
  opcionTipoPendiente: "Seleccione primero un tipo...",
  opcionResponsablePendiente: "Seleccione un responsable..."
});

/* ==============================
   ESTADO DEL MÓDULO
   ============================== */

const estado = {
  responsablesTienda: [],
  responsablesEntidad: []
};

const canalComunicacion = new BroadcastChannel(CHANNEL_NAME);

/* ==============================
   INICIALIZACIÓN
   ============================== */

document.addEventListener("DOMContentLoaded", inicializarFormulario);

function inicializarFormulario() {
  registrarEventos();
  cargarDatosFormulario();
}

/* ==============================
   REGISTRO DE EVENTOS
   ============================== */

function registrarEventos() {
  const btnVolver = document.querySelector(SELECTORS.btnVolver);
  const btnCancelar = document.querySelector(SELECTORS.btnCancelar);
  const selectTipoResponsable = document.querySelector(SELECTORS.tipoResponsable);
  const formIncidencia = document.querySelector(SELECTORS.form);

  btnVolver?.addEventListener("click", volverAIncidencias);
  btnCancelar?.addEventListener("click", volverAIncidencias);
  selectTipoResponsable?.addEventListener("change", actualizarSelectResponsables);
  formIncidencia?.addEventListener("submit", guardarIncidencia);
}

/* ==============================
   CARGA DE DATOS INICIALES
   ============================== */

async function cargarDatosFormulario() {
  mostrarLoader(true);

  try {
    const [responsablesTienda, responsablesEntidad] = await Promise.all([
      solicitarJSON(ENDPOINTS.responsablesTienda, "No se pudieron cargar los responsables de tienda"),
      solicitarJSON(ENDPOINTS.responsablesEntidad, "No se pudieron cargar los responsables de entidad")
    ]);

    estado.responsablesTienda = normalizarColeccion(responsablesTienda);
    estado.responsablesEntidad = normalizarColeccion(responsablesEntidad);

    actualizarSelectResponsables();
  } catch (error) {
    gestionarError(error, MENSAJES.errorCargaResponsables);
  } finally {
    mostrarLoader(false);
  }
}

function normalizarColeccion(datos) {
  return Array.isArray(datos) ? datos : [];
}

/* ==============================
   GESTIÓN DEL SELECT DE RESPONSABLES
   ============================== */

function actualizarSelectResponsables() {
  const tipoSeleccionado = obtenerValorCampo(SELECTORS.tipoResponsable);
  const selectResponsable = document.querySelector(SELECTORS.responsable);

  if (!selectResponsable) {
    return;
  }

  limpiarSelect(selectResponsable);

  if (!tipoSeleccionado) {
    prepararSelectSinTipo(selectResponsable);
    return;
  }

  prepararSelectConResponsables(selectResponsable, tipoSeleccionado);
}

function prepararSelectSinTipo(selectResponsable) {
  selectResponsable.disabled = true;
  agregarOpcion(selectResponsable, MENSAJES.opcionTipoPendiente, "");
}

function prepararSelectConResponsables(selectResponsable, tipoResponsable) {
  const responsables = obtenerResponsablesPorTipo(tipoResponsable);

  selectResponsable.disabled = false;
  agregarOpcion(selectResponsable, MENSAJES.opcionResponsablePendiente, "");

  responsables.forEach((responsable) => {
    agregarOpcion(
      selectResponsable,
      obtenerNombreResponsable(responsable, tipoResponsable),
      responsable.id
    );
  });
}

function limpiarSelect(select) {
  select.replaceChildren();
}

function agregarOpcion(select, texto, valor) {
  select.add(new Option(texto, valor));
}

function obtenerResponsablesPorTipo(tipoResponsable) {
  return tipoResponsable === TIPO_RESPONSABLE.TIENDA
    ? estado.responsablesTienda
    : estado.responsablesEntidad;
}

function obtenerNombreResponsable(responsable, tipoResponsable) {
  if (!responsable) {
    return "Responsable sin datos";
  }

  const nombre = responsable.nombre ||
    responsable.contactoNombre ||
    responsable.entidadNombre;

  if (nombre) {
    return nombre;
  }

  return tipoResponsable === TIPO_RESPONSABLE.TIENDA
    ? `Responsable tienda #${responsable.id}`
    : `Responsable entidad #${responsable.id}`;
}

/* ==============================
   ENVÍO DEL FORMULARIO
   ============================== */

async function guardarIncidencia(evento) {
  evento.preventDefault();

  const datosIncidencia = construirIncidenciaDesdeFormulario(evento.target);
  const errorValidacion = validarIncidencia(datosIncidencia);

  if (errorValidacion) {
    alert(errorValidacion);
    return;
  }

  mostrarLoader(true);

  try {
    await crearIncidencia(datosIncidencia);

    alert(MENSAJES.incidenciaCreada);
    notificarActualizacionIncidencias();
    volverAIncidencias();
  } catch (error) {
    gestionarError(error, MENSAJES.errorGuardadoIncidencia);
  } finally {
    mostrarLoader(false);
  }
}

function construirIncidenciaDesdeFormulario(form) {
  const tipoResponsable = form.elements.tipoResponsable.value;
  const responsableId = convertirANumeroONulo(form.elements.responsableId.value);

  return {
    fechaHora: obtenerFechaHoraActualSinZona(),
    asunto: form.elements.asunto.value.trim(),
    descripcion: form.elements.descripcion.value.trim() || null,
    estado: form.elements.estado.value || "PENDIENTE",
    responsableTiendaId: tipoResponsable === TIPO_RESPONSABLE.TIENDA ? responsableId : null,
    responsableEntidadId: tipoResponsable === TIPO_RESPONSABLE.ENTIDAD ? responsableId : null
  };
}

function validarIncidencia(incidencia) {
  if (!incidencia.asunto) {
    return MENSAJES.asuntoObligatorio;
  }

  if (!incidencia.responsableTiendaId && !incidencia.responsableEntidadId) {
    return MENSAJES.responsableObligatorio;
  }

  return null;
}

function convertirANumeroONulo(valor) {
  return valor ? Number(valor) : null;
}

function notificarActualizacionIncidencias() {
  canalComunicacion.postMessage(REFRESH_INCIDENCIAS_MESSAGE);
}

/* ==============================
   COMUNICACIÓN HTTP
   ============================== */

function solicitarJSON(url, mensajeError) {
  return procesarPeticionJSON(url, {}, mensajeError);
}

async function procesarPeticionJSON(url, opciones, mensajeError) {
  const respuesta = await fetch(url, opciones);
  const textoRespuesta = await respuesta.text();
  const cuerpo = textoRespuesta ? intentarParsearJSON(textoRespuesta) : null;

  if (!respuesta.ok) {
    throw new Error(
      `${mensajeError}. Código HTTP: ${respuesta.status}. Respuesta: ${textoRespuesta}`
    );
  }

  return cuerpo;
}

function intentarParsearJSON(texto) {
  try {
    return JSON.parse(texto);
  } catch {
    return texto;
  }
}

/* ==============================
   NAVEGACIÓN
   ============================== */

function volverAIncidencias() {
  window.location.href = "incidencias.html";
}

/* ==============================
   INDICADOR DE CARGA
   ============================== */

function mostrarLoader(mostrar) {
  const loader = obtenerOCrearLoader();
  loader.style.display = mostrar ? "flex" : "none";
}

function obtenerOCrearLoader() {
  const loaderExistente = document.querySelector(SELECTORS.loader);

  if (loaderExistente) {
    return loaderExistente;
  }

  const loader = document.createElement("div");
  loader.id = SELECTORS.loader.replace("#", "");
  loader.className = "loading-overlay";
  loader.innerHTML = `
    <div class="spinner"></div>
    <div class="loading-text">Cargando datos... Por favor, espere</div>
  `;

  document.body.appendChild(loader);
  return loader;
}

/* ==============================
   UTILIDADES GENERALES
   ============================== */

function obtenerValorCampo(selector) {
  return document.querySelector(selector)?.value || "";
}

function gestionarError(error, mensajeUsuario) {
  console.error(error);
  alert(error?.message || mensajeUsuario);
}