// ==============================
// VARIABLES GLOBALES
// ==============================

const API_BASE = "http://localhost:8080/api";
const canalComunicacion = new BroadcastChannel("bancosol_channel");

const endpoints = {
  incidencias: `${API_BASE}/incidencias`,
  responsablesTienda: `${API_BASE}/responsables-tiendas`,
  responsablesEntidad: `${API_BASE}/responsables-entidades`
};

let responsablesTiendaCache = [];
let responsablesEntidadCache = [];

// ==============================
// INICIO
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  registrarEventos();
  cargarDatosFormulario();
});

// ==============================
// EVENTOS
// ==============================

function registrarEventos() {
  document.getElementById("btn-volver")?.addEventListener("click", volverAIncidencias);
  document.getElementById("btn-cancelar")?.addEventListener("click", volverAIncidencias);
  document.getElementById("tipo-responsable")?.addEventListener("change", actualizarSelectResponsables);
  document.getElementById("form-incidencia")?.addEventListener("submit", guardarIncidencia);
}

// ==============================
// CARGA INICIAL
// ==============================

async function cargarDatosFormulario() {
  toggleLoader(true);

  try {
    const [responsablesTienda, responsablesEntidad] = await Promise.all([
      pedirJSON(endpoints.responsablesTienda, "No se pudieron cargar los responsables de tienda"),
      pedirJSON(endpoints.responsablesEntidad, "No se pudieron cargar los responsables de entidad")
    ]);

    responsablesTiendaCache = Array.isArray(responsablesTienda) ? responsablesTienda : [];
    responsablesEntidadCache = Array.isArray(responsablesEntidad) ? responsablesEntidad : [];

    actualizarSelectResponsables();
  } catch (error) {
    console.error(error);
    alert(
      "No se pudieron cargar los responsables.\n\n" +
      "Comprueba que existan los endpoints:\n" +
      "/api/responsables-tiendas\n" +
      "/api/responsables-entidades"
    );
  } finally {
    toggleLoader(false);
  }
}

// ==============================
// SELECT DE RESPONSABLES
// ==============================

function actualizarSelectResponsables() {
  const tipo = document.getElementById("tipo-responsable")?.value || "";
  const selectResponsable = document.getElementById("responsable-id");

  if (!selectResponsable) return;

  selectResponsable.innerHTML = "";

  if (!tipo) {
    selectResponsable.disabled = true;
    selectResponsable.add(new Option("Seleccione primero un tipo...", ""));
    return;
  }

  selectResponsable.disabled = false;
  selectResponsable.add(new Option("Seleccione un responsable...", ""));

  const responsables = tipo === "RESPONSABLE_TIENDA"
    ? responsablesTiendaCache
    : responsablesEntidadCache;

  responsables.forEach((responsable) => {
    const option = new Option(
      obtenerNombreResponsable(responsable, tipo),
      responsable.id
    );

    selectResponsable.add(option);
  });
}

function obtenerNombreResponsable(responsable, tipo) {
  if (!responsable) return "Responsable sin datos";

  if (responsable.nombre) {
    return responsable.nombre;
  }

  if (responsable.contactoNombre) {
    return responsable.contactoNombre;
  }

  if (responsable.entidadNombre) {
    return responsable.entidadNombre;
  }

  if (tipo === "RESPONSABLE_TIENDA") {
    return `Responsable tienda #${responsable.id}`;
  }

  return `Responsable entidad #${responsable.id}`;
}

// ==============================
// GUARDADO
// ==============================

async function guardarIncidencia(evento) {
  evento.preventDefault();

  const form = evento.target;
  const datos = leerFormulario(form);

  if (!datos.asunto) {
    alert("El asunto es obligatorio.");
    return;
  }

  if (!datos.responsableTiendaId && !datos.responsableEntidadId) {
    alert("Debes seleccionar un responsable.");
    return;
  }

  try {
    toggleLoader(true);

    await enviarJSON(
      endpoints.incidencias,
      "POST",
      datos,
      "No se pudo crear la incidencia"
    );

    alert("Incidencia creada correctamente.");

    canalComunicacion.postMessage("recargar-tabla-incidencias");
    volverAIncidencias();
  } catch (error) {
    console.error(error);
    alert(error.message || "No se pudo guardar la incidencia.");
  } finally {
    toggleLoader(false);
  }
}

function leerFormulario(form) {
  const tipoResponsable = form.elements.tipoResponsable.value;
  const responsableId = form.elements.responsableId.value
    ? Number(form.elements.responsableId.value)
    : null;

  return {
    fechaHora: new Date().toISOString().slice(0, 19),
    asunto: form.elements.asunto.value.trim(),
    descripcion: form.elements.descripcion.value.trim() || null,
    estado: form.elements.estado.value || "PENDIENTE",
    responsableTiendaId: tipoResponsable === "RESPONSABLE_TIENDA" ? responsableId : null,
    responsableEntidadId: tipoResponsable === "RESPONSABLE_ENTIDAD" ? responsableId : null
  };
}

// ==============================
// FETCH
// ==============================

async function pedirJSON(url, mensajeError) {
  const respuesta = await fetch(url);
  const texto = await respuesta.text();
  const cuerpo = texto ? intentarParsearJSON(texto) : null;

  if (!respuesta.ok) {
    throw new Error(`${mensajeError}. Código HTTP: ${respuesta.status}. Respuesta: ${texto}`);
  }

  return cuerpo;
}

async function enviarJSON(url, method, datos, mensajeError) {
  const respuesta = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datos)
  });

  const texto = await respuesta.text();
  const cuerpo = texto ? intentarParsearJSON(texto) : null;

  if (!respuesta.ok) {
    throw new Error(`${mensajeError}. Código HTTP: ${respuesta.status}. Respuesta: ${texto}`);
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

// ==============================
// NAVEGACIÓN
// ==============================

function volverAIncidencias() {
  window.location.href = "incidencias.html";
}

// ==============================
// LOADER
// ==============================

function toggleLoader(mostrar) {
  let loader = document.getElementById("loading-overlay");

  if (mostrar && !loader) {
    loader = document.createElement("div");
    loader.id = "loading-overlay";
    loader.className = "loading-overlay";

    loader.innerHTML = `
      <div class="spinner"></div>
      <div class="loading-text">Cargando datos... Por favor, espere</div>
    `;

    document.body.appendChild(loader);
  }

  if (loader) {
    loader.style.display = mostrar ? "flex" : "none";
  }
}