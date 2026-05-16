const API_BASE = "http://localhost:8080/api";
const canalComunicacion = new BroadcastChannel("bancosol_channel");

const endpoints = {
  coordinadores: `${API_BASE}/coordinadores`,
  coordinadorCompleto: `${API_BASE}/coordinadores/completo`,
  contactos: `${API_BASE}/contactos`,
  campanias: `${API_BASE}/campanias`,
  zonas: `${API_BASE}/zonas-geograficas`
};

let campaniasCache = [];
let zonasCache = [];
let coordinadorActual = null;

document.addEventListener("DOMContentLoaded", () => {
  registrarEventos();
  inicializarFormulario();
});

function registrarEventos() {
  document.getElementById("btn-volver")?.addEventListener("click", volverACoordinadores);
  document.getElementById("btn-cancelar")?.addEventListener("click", volverACoordinadores);
  document.getElementById("form-registro-coordinador")?.addEventListener("submit", guardarCoordinador);
}

async function inicializarFormulario() {
  toggleLoader(true);

  try {
    const parametros = new URLSearchParams(window.location.search);
    const modo = parametros.get("modo") || "crear";
    const id = parametros.get("id");

    const [campanias, zonas] = await Promise.all([
      pedirJSON(endpoints.campanias, "No se pudieron cargar las campañas"),
      pedirJSON(endpoints.zonas, "No se pudieron cargar las zonas geográficas")
    ]);

    campaniasCache = Array.isArray(campanias) ? campanias : [];
    zonasCache = Array.isArray(zonas) ? zonas : [];

    pintarOpcionesFormulario();

    if (modo === "editar") {
      if (!id) {
        alert("No se ha indicado el coordinador que se quiere modificar.");
        volverACoordinadores();
        return;
      }

      await cargarCoordinadorParaEditar(id);
    } else {
      prepararModoCreacion();
    }
  } catch (error) {
    console.error(error);
    alert(error.message || "No se pudo preparar el formulario.");
  } finally {
    toggleLoader(false);
  }
}

function prepararModoCreacion() {
  document.getElementById("titulo-formulario").textContent = "Registrar Nuevo Coordinador";
  document.getElementById("btn-guardar-coordinador").textContent = "Guardar Coordinador";
}

async function cargarCoordinadorParaEditar(id) {
  const coordinadorAPI = await pedirJSON(
    `${endpoints.coordinadores}/${id}`,
    "No se pudo cargar el coordinador seleccionado"
  );

  coordinadorActual = mapearCoordinador(coordinadorAPI);
  rellenarFormularioCoordinador(coordinadorActual);

  document.getElementById("titulo-formulario").textContent = "Modificar Coordinador";
  document.getElementById("btn-guardar-coordinador").textContent = "Guardar Cambios";
}

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
    headers: { "Content-Type": "application/json" },
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

function mapearCoordinador(coordinadorAPI) {
  const contacto = coordinadorAPI.contacto || {};
  const campanias = Array.isArray(coordinadorAPI.campanias) ? coordinadorAPI.campanias : [];
  const idsCampanias = obtenerIdsCampanias(coordinadorAPI, campanias);

  return {
    id: coordinadorAPI.id,
    nombre: coordinadorAPI.nombre || contacto.nombre || "Sin nombre",
    contactoId: contacto.id || coordinadorAPI.contactoId || null,
    email: contacto.email || coordinadorAPI.email || "",
    telefono: contacto.telefono || coordinadorAPI.telefono || "",
    area: coordinadorAPI.area || coordinadorAPI.zonaGeografica || coordinadorAPI.nombreZonaGeografica || "",
    tiendas: coordinadorAPI.tiendas ?? coordinadorAPI.numeroTiendas ?? 0,
    permisoModificar: coordinadorAPI.permisoModificar === true,
    campanias,
    idsCampanias,
    raw: coordinadorAPI
  };
}

function obtenerIdsCampanias(coordinadorAPI, campanias) {
  if (Array.isArray(coordinadorAPI.idsCampanias)) {
    return coordinadorAPI.idsCampanias.map(Number).filter(Number.isFinite);
  }

  if (Array.isArray(campanias)) {
    return campanias.map((campania) => Number(campania.id)).filter(Number.isFinite);
  }

  return [];
}

function pintarOpcionesFormulario() {
  pintarSelectZonas();
  pintarChecksCampanias();
}

function pintarSelectZonas() {
  const select = document.getElementById("select-zonas");

  if (!select) return;

  select.innerHTML = '<option value="">Seleccione un área...</option>';

  zonasCache.forEach((zona) => {
    const nombre = zona.nombre || zona.area || zona.nombreZonaGeografica || "";

    if (!nombre) return;

    const option = new Option(nombre, nombre);
    select.add(option);
  });
}

function pintarChecksCampanias() {
  const contenedor = document.getElementById("check-campanias");

  if (!contenedor) return;

  contenedor.innerHTML = "";

  campaniasCache.forEach((campania) => {
    const label = document.createElement("label");
    label.className = "check-item";

    label.innerHTML = `
      <input type="checkbox" value="${Number(campania.id)}" ${campania.activa ? "checked" : ""} />
      <span>${escaparHTML(campania.nombre || `Campaña ${campania.id}`)}</span>
    `;

    contenedor.appendChild(label);
  });
}

function rellenarFormularioCoordinador(coordinador) {
  const form = document.getElementById("form-registro-coordinador");

  if (!form) return;

  form.elements.id.value = coordinador.id || "";
  form.elements.contactoId.value = coordinador.contactoId || "";
  form.elements.nombre.value = coordinador.nombre || "";
  form.elements.email.value = coordinador.email || "";
  form.elements.telefono.value = coordinador.telefono || "";
  form.elements.area.value = coordinador.area || "";
  form.elements.tiendas.value = Number(coordinador.tiendas) || 0;
  form.elements.permisoModificar.checked = coordinador.permisoModificar;

  document.querySelectorAll('#check-campanias input[type="checkbox"]').forEach((check) => {
    check.checked = coordinador.idsCampanias.includes(Number(check.value));
  });
}

async function guardarCoordinador(event) {
  event.preventDefault();

  const datos = leerFormularioCoordinador(event.target);

  if (!datos.nombre || !datos.email || !datos.area) {
    alert("Completa nombre, correo y área asignada.");
    return;
  }

  if (datos.idsCampanias.length === 0) {
    alert("Selecciona al menos una campaña.");
    return;
  }

  try {
    toggleLoader(true);

    if (datos.id) {
      await actualizarCoordinador(datos);
      alert("Coordinador actualizado correctamente.");
    } else {
      await crearCoordinador(datos);
      alert("Coordinador creado correctamente.");
    }

    canalComunicacion.postMessage("recargar-tabla-coordinadores");
    volverACoordinadores();
  } catch (error) {
    console.error(error);
    alert(error.message || "No se pudo guardar el coordinador.");
  } finally {
    toggleLoader(false);
  }
}

function leerFormularioCoordinador(form) {
  return {
    id: form.elements.id.value ? Number(form.elements.id.value) : null,
    contactoId: form.elements.contactoId.value ? Number(form.elements.contactoId.value) : null,
    nombre: form.elements.nombre.value.trim(),
    email: form.elements.email.value.trim() || null,
    telefono: form.elements.telefono.value.trim() || null,
    area: form.elements.area.value.trim(),
    tiendas: Number(form.elements.tiendas.value) || 0,
    permisoModificar: form.elements.permisoModificar.checked,
    idsCampanias: obtenerChecksMarcados("check-campanias")
  };
}

function crearCoordinador(datos) {
  return enviarJSON(
    endpoints.coordinadorCompleto,
    "POST",
    {
      nombre: datos.nombre,
      email: datos.email,
      telefono: datos.telefono,
      area: datos.area,
      tiendas: datos.tiendas,
      permisoModificar: datos.permisoModificar,
      idsCampanias: datos.idsCampanias
    },
    "Error al crear el coordinador"
  );
}

async function actualizarCoordinador(datos) {
  await enviarJSON(
    `${endpoints.coordinadores}/${datos.id}`,
    "PUT",
    {
      area: datos.area,
      tiendas: datos.tiendas,
      permisoModificar: datos.permisoModificar,
      contactoId: datos.contactoId,
      idsCampanias: datos.idsCampanias
    },
    "Error al actualizar el coordinador"
  );

  if (datos.contactoId) {
    await enviarJSON(
      `${endpoints.contactos}/${datos.contactoId}`,
      "PUT",
      {
        nombre: datos.nombre,
        email: datos.email,
        telefono: datos.telefono
      },
      "Error al actualizar el contacto del coordinador"
    );
  }
}

function obtenerChecksMarcados(idContenedor) {
  const contenedor = document.getElementById(idContenedor);

  if (!contenedor) return [];

  return Array.from(contenedor.querySelectorAll('input[type="checkbox"]:checked'))
    .map((check) => Number(check.value))
    .filter(Number.isFinite);
}

function volverACoordinadores() {
  window.location.href = "coordinadores.html";
}

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

function escaparHTML(texto) {
  const span = document.createElement("span");
  span.textContent = texto ?? "";
  return span.innerHTML;
}