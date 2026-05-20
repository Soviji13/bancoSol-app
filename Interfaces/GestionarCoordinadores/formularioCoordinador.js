/* ==========================================================
   Formulario de coordinador
   ----------------------------------------------------------
   Este módulo gestiona el alta y modificación de coordinadores,
   incluyendo la carga de campañas, zonas geográficas y el envío
   de datos al backend.
   ========================================================== */

import {
  listarCampanias,
  listarZonas,
  obtenerCoordinadorPorId,
  crearCoordinadorCompleto,
  actualizarCoordinador,
  actualizarContacto
} from "./coordinadorApi.js";

import {
  mapearCoordinadorDesdeAPI,
  mapearCoordinadorParaCrear,
  mapearCoordinadorParaActualizar,
  mapearContactoParaActualizar
} from "./coordinadorMapper.js";

/*
 * Convención de rutas:
 * - Utilidades globales: ../utils/
 * - Assets globales: ../assets/
 */

/* ==============================
   CONFIGURACIÓN
   ============================== */

const CANAL_BANCOSOL = "bancosol_channel";
const MENSAJE_RECARGAR_COORDINADORES = "recargar-tabla-coordinadores";

const SELECTORES = Object.freeze({
  formulario: "#form-registro-coordinador",
  btnVolver: "#btn-volver",
  btnCancelar: "#btn-cancelar",
  tituloFormulario: "#titulo-formulario",
  btnGuardar: "#btn-guardar-coordinador",
  selectZonas: "#select-zonas",
  checkCampanias: "#check-campanias"
});

/* ==============================
   ESTADO
   ============================== */

const estado = {
  campanias: [],
  zonas: [],
  coordinadorActual: null
};

const canalComunicacion = new BroadcastChannel(CANAL_BANCOSOL);

/* ==============================
   INICIALIZACIÓN
   ============================== */

document.addEventListener("DOMContentLoaded", inicializar);

function inicializar() {
  registrarEventos();
  inicializarFormulario();
}

/* ==============================
   EVENTOS
   ============================== */

function registrarEventos() {
  document.querySelector(SELECTORES.btnVolver)?.addEventListener("click", volverACoordinadores);
  document.querySelector(SELECTORES.btnCancelar)?.addEventListener("click", volverACoordinadores);
  document.querySelector(SELECTORES.formulario)?.addEventListener("submit", guardarCoordinador);
}

/* ==============================
   CARGA INICIAL
   ============================== */

async function inicializarFormulario() {
  mostrarLoader(true);

  try {
    const parametros = new URLSearchParams(window.location.search);
    const modo = parametros.get("modo") || "crear";
    const id = parametros.get("id");

    const [campanias, zonas] = await Promise.all([
      listarCampanias(),
      listarZonas()
    ]);

    estado.campanias = normalizarColeccion(campanias);
    estado.zonas = normalizarColeccion(zonas);

    pintarOpcionesFormulario();

    if (modo === "editar") {
      await prepararModoEdicion(id);
      return;
    }

    prepararModoCreacion();
  } catch (error) {
    console.error(error);
    alert(error.message || "No se pudo preparar el formulario.");
  } finally {
    mostrarLoader(false);
  }
}

async function prepararModoEdicion(id) {
  if (!id) {
    alert("No se ha indicado el coordinador que se quiere modificar.");
    volverACoordinadores();
    return;
  }

  const coordinadorAPI = await obtenerCoordinadorPorId(id);

  estado.coordinadorActual = mapearCoordinadorDesdeAPI(coordinadorAPI, estado.campanias);
  rellenarFormularioCoordinador(estado.coordinadorActual);

  escribirTexto(SELECTORES.tituloFormulario, "Modificar Coordinador");
  escribirTexto(SELECTORES.btnGuardar, "Guardar Cambios");
}

function prepararModoCreacion() {
  estado.coordinadorActual = null;

  escribirTexto(SELECTORES.tituloFormulario, "Registrar Nuevo Coordinador");
  escribirTexto(SELECTORES.btnGuardar, "Guardar Coordinador");
}

function normalizarColeccion(datos) {
  return Array.isArray(datos) ? datos : [];
}

/* ==============================
   OPCIONES DEL FORMULARIO
   ============================== */

function pintarOpcionesFormulario() {
  pintarSelectZonas();
  pintarChecksCampanias();
}

function pintarSelectZonas() {
  const select = document.querySelector(SELECTORES.selectZonas);

  if (!select) {
    return;
  }

  select.replaceChildren();
  select.add(new Option("Seleccione un área...", ""));

  estado.zonas.forEach((zona) => {
    const nombre = zona.nombre || zona.area || zona.nombreZonaGeografica || "";

    if (nombre) {
      select.add(new Option(nombre, nombre));
    }
  });
}

function pintarChecksCampanias() {
  const contenedor = document.querySelector(SELECTORES.checkCampanias);

  if (!contenedor) {
    return;
  }

  contenedor.replaceChildren();

  estado.campanias.forEach((campania) => {
    contenedor.appendChild(crearCheckCampania(campania));
  });
}

function crearCheckCampania(campania) {
  const label = document.createElement("label");
  const input = document.createElement("input");
  const span = document.createElement("span");

  label.className = "check-item";

  input.type = "checkbox";
  input.value = Number(campania.id);
  input.checked = Boolean(campania.activa);

  span.textContent = campania.nombre || `Campaña ${campania.id}`;

  label.appendChild(input);
  label.appendChild(span);

  return label;
}

/* ==============================
   RELLENO Y LECTURA
   ============================== */

function rellenarFormularioCoordinador(coordinador) {
  const form = document.querySelector(SELECTORES.formulario);

  if (!form) {
    return;
  }

  form.elements.id.value = coordinador.id || "";
  form.elements.contactoId.value = coordinador.contactoId || "";
  form.elements.usuarioId.value = coordinador.usuarioId || "";
  form.elements.nombre.value = coordinador.nombre || "";
  form.elements.email.value = coordinador.email || "";
  form.elements.telefono.value = coordinador.telefono || "";
  form.elements.area.value = coordinador.area || "";
  form.elements.permisoModificar.checked = coordinador.permisoModificar;

  document.querySelectorAll(`${SELECTORES.checkCampanias} input[type="checkbox"]`).forEach((check) => {
    check.checked = coordinador.idsCampanias.includes(Number(check.value));
  });
}

function leerFormularioCoordinador(form) {
  const esEdicion = Boolean(form.elements.id.value);

  return {
    id: form.elements.id.value ? Number(form.elements.id.value) : null,
    contactoId: form.elements.contactoId.value ? Number(form.elements.contactoId.value) : null,
    usuarioId: form.elements.usuarioId.value ? Number(form.elements.usuarioId.value) : null,
    nombre: form.elements.nombre.value.trim(),
    email: form.elements.email.value.trim() || null,
    telefono: form.elements.telefono.value.trim() || null,
    area: form.elements.area.value.trim(),

    /*
     * El número de tiendas deja de ser un campo editable en el formulario.
     * En creación se inicializa siempre a 0.
     * En edición se conserva el valor actual para no sobrescribirlo.
     */
    tiendas: esEdicion ? obtenerTiendasActuales() : 0,

    permisoModificar: form.elements.permisoModificar.checked,
    idsCampanias: obtenerChecksMarcados(SELECTORES.checkCampanias)
  };
}

function obtenerTiendasActuales() {
  return Number(estado.coordinadorActual?.tiendas) || 0;
}

function obtenerChecksMarcados(selectorContenedor) {
  const contenedor = document.querySelector(selectorContenedor);

  if (!contenedor) {
    return [];
  }

  return Array.from(contenedor.querySelectorAll('input[type="checkbox"]:checked'))
    .map((check) => Number(check.value))
    .filter(Number.isFinite);
}

/* ==============================
   GUARDADO
   ============================== */

async function guardarCoordinador(evento) {
  evento.preventDefault();

  const datos = leerFormularioCoordinador(evento.target);
  const errorValidacion = validarCoordinador(datos);

  if (errorValidacion) {
    alert(errorValidacion);
    return;
  }

  mostrarLoader(true);

  try {
    if (datos.id) {
      await guardarActualizacionCoordinador(datos);
      alert("Coordinador actualizado correctamente.");
    } else {
      await crearCoordinadorCompleto(mapearCoordinadorParaCrear(datos));
      alert("Coordinador creado correctamente.");
    }

    canalComunicacion.postMessage(MENSAJE_RECARGAR_COORDINADORES);
    volverACoordinadores();
  } catch (error) {
    console.error(error);
    alert(error.message || "No se pudo guardar el coordinador.");
  } finally {
    mostrarLoader(false);
  }
}

function validarCoordinador(datos) {
  if (!datos.nombre || !datos.email || !datos.area) {
    return "Completa nombre, correo y área asignada.";
  }

  if (datos.id && !datos.usuarioId) {
    return "No se ha podido conservar el usuario asociado al coordinador.";
  }

  if (datos.idsCampanias.length === 0) {
    return "Selecciona al menos una campaña.";
  }

  return null;
}

async function guardarActualizacionCoordinador(datos) {
  await actualizarCoordinador(
    datos.id,
    mapearCoordinadorParaActualizar(datos)
  );

  if (datos.contactoId) {
    await actualizarContacto(
      datos.contactoId,
      mapearContactoParaActualizar(datos)
    );
  }
}

/* ==============================
   NAVEGACIÓN Y UTILIDADES VISUALES
   ============================== */

function volverACoordinadores() {
  window.location.href = "coordinadores.html";
}

function mostrarLoader(mostrar) {
  const loader = obtenerOCrearLoader();
  loader.style.display = mostrar ? "flex" : "none";
}

function obtenerOCrearLoader() {
  let loader = document.getElementById("loading-overlay");

  if (loader) {
    return loader;
  }

  loader = document.createElement("div");
  loader.id = "loading-overlay";
  loader.className = "loading-overlay";
  loader.innerHTML = `
    <div class="spinner"></div>
    <div class="loading-text">Cargando datos... Por favor, espere</div>
  `;

  document.body.appendChild(loader);
  return loader;
}

function escribirTexto(selector, texto) {
  const elemento = document.querySelector(selector);

  if (elemento) {
    elemento.textContent = texto ?? "";
  }
}