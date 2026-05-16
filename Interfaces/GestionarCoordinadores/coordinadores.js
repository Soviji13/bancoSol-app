// VARIABLES GLOBALES Y CACHÉ
let coordinadoresCache = [];
let coordinadoresOriginales = [];
let campaniasCache = [];
let modoEliminarActivo = false;
let idCampaniaVisualizada = null;
let coordinadorSeleccionadoId = null;

const API_BASE = "http://localhost:8080/api";
const canalComunicacion = new BroadcastChannel("bancosol_channel");

const endpoints = {
  coordinadores: `${API_BASE}/coordinadores`,
  campanias: `${API_BASE}/campanias`
};

document.addEventListener("DOMContentLoaded", () => {
  cargarDatosIniciales();
  registrarEventosInterfaz();
});

function registrarEventosInterfaz() {
  const tbody = document.querySelector("#tabla-body");
  const btnEliminar = document.getElementById("btn-eliminar-coordinador");
  const aviso = document.getElementById("aviso-borrado");
  const tabla = document.querySelector("table");

  tbody?.addEventListener("click", (event) => seleccionarFila(event));
  tbody?.addEventListener("dblclick", (event) => abrirDetalleDesdeFila(event));

  if (btnEliminar) {
    btnEliminar.addEventListener("click", () => {
      modoEliminarActivo = !modoEliminarActivo;

      if (modoEliminarActivo) {
        aviso.style.display = "block";
        tabla.classList.add("modo-borrado-activo");
        btnEliminar.style.backgroundColor = "#e02424";
        btnEliminar.style.color = "white";
      } else {
        desactivarModoEliminar(aviso, tabla, btnEliminar);
      }
    });
  }

  document.getElementById("btn-abrir-registro")?.addEventListener("click", irAFormularioCreacion);
  document.getElementById("btn-modificar-coordinador")?.addEventListener("click", irAFormularioEdicion);
  document.querySelector(".csv")?.addEventListener("click", () => exportarACsv(coordinadoresCache));

  document.getElementById("filtrar")?.addEventListener("click", abrirFiltroEnMenuLateral);

  document.getElementById("btn-seleccionar-campania")?.addEventListener("click", abrirSelectorCampanias);
  document.getElementById("cerrar-selector")?.addEventListener("click", () => cerrarModal("modal-campanias"));
  document.getElementById("btn-cerrar-detalle")?.addEventListener("click", () => cerrarModal("modal-detalle"));
  document.getElementById("btn-ayuda")?.addEventListener("click", mostrarAyuda);

  canalComunicacion.onmessage = (event) => {
    if (event.data === "recargar-tabla-coordinadores" || event.data === "recargar-tabla") {
      cargarDatosIniciales();
      resetearBotonModificar();
    }
  };
}

// ==============================
// NAVEGACIÓN A FORMULARIO
// ==============================

function irAFormularioCreacion() {
  window.location.href = "formularioCoordinador.html?modo=crear";
}

function irAFormularioEdicion() {
  if (!coordinadorSeleccionadoId) {
    alert("Debes seleccionar primero un coordinador.");
    return;
  }

  window.location.href = `formularioCoordinador.html?modo=editar&id=${coordinadorSeleccionadoId}`;
}

// ==============================
// COMUNICACIÓN CON DOCUMENTO PADRE
// ==============================

function abrirFiltroEnMenuLateral() {
  window.parent.postMessage({
    tipo: "ABRIR_FILTRO_COORDINADORES"
  }, "*");
}

function notificarCampaniasAlPadre() {
  window.parent.postMessage({
    tipo: "COORDINADORES_CAMPANIAS_CARGADAS",
    campanias: campaniasCache
  }, "*");
}

window.addEventListener("message", (evento) => {
  const mensaje = evento.data;

  if (!mensaje || typeof mensaje !== "object") return;

  if (mensaje.tipo === "APLICAR_FILTROS_COORDINADORES") {
    aplicarFiltros(mensaje.filtros);
  }

  if (mensaje.tipo === "LIMPIAR_FILTROS_COORDINADORES") {
    renderizarFilas(coordinadoresOriginales);
    resetearBotonModificar();
  }

  if (mensaje.tipo === "PEDIR_CAMPANIAS_COORDINADORES") {
    notificarCampaniasAlPadre();
  }
});

// ==============================
// CARGA DE DATOS
// ==============================

async function cargarDatosIniciales() {
  toggleLoader(true);

  try {
    const [coordinadores, campanias] = await Promise.all([
      pedirJSON(endpoints.coordinadores, "No se pudieron cargar los coordinadores"),
      pedirJSON(endpoints.campanias, "No se pudieron cargar las campañas")
    ]);

    campaniasCache = Array.isArray(campanias) ? campanias : [];
    notificarCampaniasAlPadre();

    coordinadoresOriginales = (Array.isArray(coordinadores) ? coordinadores : []).map(mapearCoordinador);

    sessionStorage.setItem("coordinadoresCache", JSON.stringify(coordinadoresOriginales));

    aplicarCampaniaInicial();
  } catch (error) {
    console.error(error);
    alert(error.message || "No se pudieron cargar los datos de coordinadores.");
  } finally {
    toggleLoader(false);
  }
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

function intentarParsearJSON(texto) {
  try {
    return JSON.parse(texto);
  } catch {
    return texto;
  }
}

// ==============================
// MAPEO DE DATOS
// ==============================

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
    nombresCampanias: obtenerNombresCampanias(campanias, idsCampanias),
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

function obtenerNombresCampanias(campanias, idsCampanias) {
  if (campanias.length > 0) {
    return campanias.map((campania) => campania.nombre || `Campaña ${campania.id}`);
  }

  return idsCampanias.map((id) => {
    const campania = campaniasCache.find((c) => Number(c.id) === Number(id));
    return campania ? campania.nombre : `Campaña ${id}`;
  });
}

// ==============================
// TABLA
// ==============================

function aplicarCampaniaInicial() {
  const titulo = document.querySelector(".encabezado h1");

  if (titulo) {
    titulo.textContent = "Coordinadores";
  }

  renderizarFilas(coordinadoresOriginales);
  resetearBotonModificar();
}

function renderizarFilas(datos) {
  coordinadoresCache = datos;

  const tbody = document.querySelector("#tabla-body");

  if (!tbody) return;

  tbody.innerHTML = "";

  if (!datos || datos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="estado-vacio">No hay coordinadores registrados.</td>
      </tr>
    `;

    resetearBotonModificar();
    return;
  }

  datos.forEach((coordinador) => {
    const fila = document.createElement("tr");
    fila.dataset.id = coordinador.id;

    const campaniasHtml = coordinador.nombresCampanias.length > 1
      ? `<ul class="lista-entidades">${coordinador.nombresCampanias.map((nombre) => `<li>${escaparHTML(nombre)}</li>`).join("")}</ul>`
      : escaparHTML(coordinador.nombresCampanias[0] || "Sin campañas");

    fila.innerHTML = `
      <td>${escaparHTML(coordinador.nombre)}</td>
      <td>${campaniasHtml}</td>
      <td>${Number(coordinador.tiendas) || 0} tiendas</td>
      <td>${escaparHTML(coordinador.area || "---")}</td>
      <td>${crearContactoHTML(coordinador)}</td>
      <td>${coordinador.permisoModificar ? '<span class="badge badge-si">SÍ</span>' : '<span class="badge badge-no">NO</span>'}</td>
    `;

    tbody.appendChild(fila);
  });
}

function crearContactoHTML(coordinador) {
  const partes = [];

  if (coordinador.email) {
    partes.push(`<small>${escaparHTML(coordinador.email)}</small>`);
  }

  if (coordinador.telefono) {
    partes.push(`<small>${escaparHTML(coordinador.telefono)}</small>`);
  }

  return partes.length ? partes.join("<br>") : "Sin contacto";
}

function seleccionarFila(event) {
  const fila = event.target.closest("tr");

  if (!fila || !fila.dataset.id) return;

  if (modoEliminarActivo) {
    eliminarCoordinador(fila);
    return;
  }

  document.querySelectorAll("#tabla-body tr").forEach((tr) => {
    tr.classList.remove("fila-seleccionada");
  });

  fila.classList.add("fila-seleccionada");
  coordinadorSeleccionadoId = Number(fila.dataset.id);
  activarBotonModificar();
}

function abrirDetalleDesdeFila(event) {
  if (modoEliminarActivo) return;

  const fila = event.target.closest("tr");

  if (!fila || !fila.dataset.id) return;

  const coordinador = buscarCoordinadorPorId(fila.dataset.id);

  if (!coordinador) return;

  pintarDetalle(coordinador);
  document.getElementById("modal-detalle").style.display = "flex";
}

function buscarCoordinadorPorId(id) {
  return coordinadoresOriginales.find((coordinador) => Number(coordinador.id) === Number(id));
}

// ==============================
// DETALLE
// ==============================

function pintarDetalle(coordinador) {
  document.getElementById("detalle-nombre").textContent = coordinador.nombre;
  document.getElementById("detalle-id").textContent = coordinador.id;
  document.getElementById("detalle-email").textContent = coordinador.email || "---";
  document.getElementById("detalle-telefono").textContent = coordinador.telefono || "---";
  document.getElementById("detalle-area").textContent = coordinador.area || "---";
  document.getElementById("detalle-tiendas").textContent = `${Number(coordinador.tiendas) || 0} tiendas`;
  document.getElementById("detalle-permiso").textContent = coordinador.permisoModificar ? "Sí" : "No";

  const contenedor = document.getElementById("detalle-campanias");
  contenedor.innerHTML = "";

  const nombres = coordinador.nombresCampanias.length ? coordinador.nombresCampanias : ["Sin campañas"];

  nombres.forEach((nombre) => {
    const div = document.createElement("div");
    div.className = "check-item";
    div.textContent = nombre;
    contenedor.appendChild(div);
  });
}

// ==============================
// ELIMINAR
// ==============================

async function eliminarCoordinador(fila) {
  const coordinador = buscarCoordinadorPorId(fila.dataset.id);

  if (!coordinador) return;

  const confirma = confirm(`⚠️ ¿ELIMINAR PERMANENTEMENTE? \nSe borrará "${coordinador.nombre}".`);

  if (!confirma) return;

  try {
    const respuesta = await fetch(`${endpoints.coordinadores}/${coordinador.id}`, {
      method: "DELETE"
    });

    if (!respuesta.ok) {
      const texto = await respuesta.text();
      throw new Error(texto || `Error HTTP ${respuesta.status}`);
    }

    alert("Coordinador eliminado correctamente.");
    await cargarDatosIniciales();

    desactivarModoEliminar(
      document.getElementById("aviso-borrado"),
      document.querySelector("table"),
      document.getElementById("btn-eliminar-coordinador")
    );
  } catch (error) {
    console.error(error);
    alert("No se pudo eliminar el coordinador.");
  }
}

function desactivarModoEliminar(aviso, tabla, btn) {
  modoEliminarActivo = false;

  if (aviso) aviso.style.display = "none";
  if (tabla) tabla.classList.remove("modo-borrado-activo");

  if (btn) {
    btn.style.backgroundColor = "";
    btn.style.color = "";
  }
}

// ==============================
// BOTÓN MODIFICAR
// ==============================

function activarBotonModificar() {
  const btnModificar = document.getElementById("btn-modificar-coordinador");

  if (!btnModificar) return;

  btnModificar.classList.replace("desactivado", "activado");
  btnModificar.title = "Modificar coordinador seleccionado";
}

function resetearBotonModificar() {
  coordinadorSeleccionadoId = null;

  const btnModificar = document.getElementById("btn-modificar-coordinador");

  if (!btnModificar) return;

  btnModificar.classList.replace("activado", "desactivado");
  btnModificar.title = "Debes primero seleccionar un coordinador";
}

// ==============================
// FILTROS RECIBIDOS DESDE panelFiltro.html
// ==============================

function aplicarFiltros(filtros) {
  const filtrosNormalizados = {
    nombre: normalizarTexto(filtros?.nombre || ""),
    campaniaId: filtros?.campaniaId || "",
    tiendas: filtros?.tiendas || ""
  };

  let filtrados = [...coordinadoresOriginales];

  if (filtrosNormalizados.nombre) {
    filtrados = filtrados.filter((coordinador) => {
      return normalizarTexto(coordinador.nombre).includes(filtrosNormalizados.nombre);
    });
  }

  if (filtrosNormalizados.campaniaId) {
    const idBusqueda = Number(filtrosNormalizados.campaniaId);

    filtrados = filtrados.filter((coordinador) => {
      return coordinador.idsCampanias.includes(idBusqueda);
    });
  }

  if (
    filtrosNormalizados.tiendas !== "" &&
    filtrosNormalizados.tiendas !== null &&
    filtrosNormalizados.tiendas !== undefined
  ) {
    filtrados = filtrados.filter((coordinador) => {
      return Number(coordinador.tiendas) === Number(filtrosNormalizados.tiendas);
    });
  }

  renderizarFilas(filtrados);
  resetearBotonModificar();
}

// ==============================
// SELECTOR DE CAMPAÑAS
// ==============================

function abrirSelectorCampanias() {
  const grid = document.getElementById("lista-campanias");

  if (!grid) return;

  grid.innerHTML = "";

  document.getElementById("modal-campanias").style.display = "flex";

  campaniasCache.forEach((campania) => {
    const card = document.createElement("div");
    const esSeleccionada = Number(campania.id) === Number(idCampaniaVisualizada);

    card.className = `campania-card ${esSeleccionada ? "seleccionada" : ""}`;

    const inicio = campania.fechaInicio ? new Date(campania.fechaInicio).toLocaleDateString() : "---";
    const fin = campania.fechaFin ? new Date(campania.fechaFin).toLocaleDateString() : "---";

    const labelActiva = campania.activa
      ? '<span class="badge badge-activa">ACTIVA</span>'
      : '<span class="badge badge-inactiva">INACTIVA</span>';

    const labelSeleccionada = esSeleccionada
      ? '<span class="badge badge-viendo">VIENDO AHORA</span>'
      : "";

    card.innerHTML = `
      <div class="card-header-flex">
        <h3>${escaparHTML(campania.nombre || `Campaña ${campania.id}`)}</h3>
        <div class="badges-container">${labelActiva} ${labelSeleccionada}</div>
      </div>
      <p><strong>Inicio:</strong> ${inicio} | <strong>Fin:</strong> ${fin}</p>
      <p>Año fiscal: ${campania.anio || "---"}</p>
    `;

    card.addEventListener("click", () => seleccionarCampania(campania));
    grid.appendChild(card);
  });
}

function seleccionarCampania(campania) {
  idCampaniaVisualizada = Number(campania.id);

  const titulo = document.querySelector(".encabezado h1");

  if (titulo) {
    titulo.textContent = campania.nombre || `Campaña ${campania.id}`;
  }

  cerrarModal("modal-campanias");
  actualizarTablaPorCampania(campania.id);
}

function actualizarTablaPorCampania(idCampania) {
  const filtrados = coordinadoresOriginales.filter((coordinador) => {
    return coordinador.idsCampanias.includes(Number(idCampania));
  });

  renderizarFilas(filtrados);
  resetearBotonModificar();
}

// ==============================
// CSV
// ==============================

function exportarACsv(datos) {
  if (!datos || datos.length === 0) {
    alert("No hay datos cargados en la tabla para exportar.");
    return;
  }

  const cabeceras = [
    "ID",
    "Nombre",
    "Email",
    "Teléfono",
    "Área asignada",
    "Número de tiendas",
    "Campañas",
    "Permiso modificar"
  ];

  const filasCsv = datos.map((coordinador) => [
    coordinador.id,
    limpiarCsv(coordinador.nombre),
    limpiarCsv(coordinador.email),
    limpiarCsv(coordinador.telefono),
    limpiarCsv(coordinador.area),
    coordinador.tiendas,
    limpiarCsv(coordinador.nombresCampanias.join(" | ")),
    coordinador.permisoModificar ? "Sí" : "No"
  ].join(","));

  const contenidoFinal = "\uFEFF" + cabeceras.join(",") + "\n" + filasCsv.join("\n");
  const blob = new Blob([contenidoFinal], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const fecha = new Date().toISOString().slice(0, 10);

  link.href = url;
  link.download = `bancosol_coordinadores_${fecha}.csv`;
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

function limpiarCsv(texto) {
  return `"${String(texto ?? "").replaceAll('"', '""')}"`;
}

// ==============================
// MODALES, LOADER Y AYUDA
// ==============================

function cerrarModal(idModal) {
  const modal = document.getElementById(idModal);

  if (modal) {
    modal.style.display = "none";
  }
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

function mostrarAyuda() {
  alert(
    "Pantalla de coordinadores.\n\n" +
    "- Doble click sobre una fila: ver detalle.\n" +
    "- Click sobre una fila: seleccionarla para modificar.\n" +
    "- Eliminar coordinador: activa el modo borrado y después se pulsa la fila.\n" +
    "- El botón de filtro sustituye el menú lateral por el panel de filtros."
  );
}

// ==============================
// UTILIDADES
// ==============================

function escaparHTML(texto) {
  const span = document.createElement("span");
  span.textContent = texto ?? "";
  return span.innerHTML;
}

function normalizarTexto(texto) {
  return String(texto ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}