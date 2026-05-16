// ==============================
// VARIABLES GLOBALES Y CACHÉ
// ==============================

let incidenciasCache = [];
let incidenciasOriginales = [];
let incidenciaSeleccionada = null;
let filtrosActivos = {
  reportadoPor: "",
  estado: "",
  cargo: "",
  asunto: ""
};

const API_BASE = "http://localhost:8080/api";
const canalComunicacion = new BroadcastChannel("bancosol_channel");

const endpoints = {
  incidencias: `${API_BASE}/incidencias`
};

// ==============================
// INICIO
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  cargarIncidencias();
  registrarEventosInterfaz();
});

// ==============================
// EVENTOS
// ==============================

function registrarEventosInterfaz() {
  const cuerpoTabla = document.querySelector("#tabla-incidencias-body");

  cuerpoTabla?.addEventListener("click", seleccionarFilaDesdeEvento);
  cuerpoTabla?.addEventListener("dblclick", abrirDetalleDesdeEvento);

  document.getElementById("btn-filtro")?.addEventListener("click", abrirFiltroEnMenuLateral);
  document.getElementById("btn-ayuda")?.addEventListener("click", mostrarAyuda);

  document.getElementById("btn-anadir")?.addEventListener("click", irAFormularioCreacion);
  document.getElementById("btn-confirmar-lectura")?.addEventListener("click", confirmarLectura);
  document.getElementById("btn-confirmar-resolucion")?.addEventListener("click", confirmarResolucion);

  canalComunicacion.onmessage = (event) => {
    if (event.data === "recargar-tabla-incidencias" || event.data === "recargar-tabla") {
      cargarIncidencias();
      resetearSeleccion();
    }
  };
}

// ==============================
// COMUNICACIÓN CON DOCUMENTO PADRE
// ==============================

function abrirFiltroEnMenuLateral() {
  window.parent.postMessage({
    tipo: "ABRIR_FILTRO_INCIDENCIAS"
  }, "*");
}

function abrirDetalleEnMenuLateral(incidencia) {
  sessionStorage.setItem("incidenciaSeleccionada", JSON.stringify(incidencia));

  window.parent.postMessage({
    tipo: "ABRIR_DETALLE_INCIDENCIA"
  }, "*");
}

window.addEventListener("message", (evento) => {
  const mensaje = evento.data;

  if (!mensaje || typeof mensaje !== "object") return;

  if (mensaje.tipo === "APLICAR_FILTROS_INCIDENCIAS") {
    aplicarFiltros(mensaje.filtros);
  }

  if (mensaje.tipo === "LIMPIAR_FILTROS_INCIDENCIAS") {
    limpiarFiltros();
  }
});

// ==============================
// CARGA DE DATOS
// ==============================

async function cargarIncidencias() {
  mostrarMensaje("Cargando incidencias...");

  try {
    const incidencias = await pedirJSON(
      endpoints.incidencias,
      "No se pudieron cargar las incidencias"
    );

    incidenciasOriginales = (Array.isArray(incidencias) ? incidencias : []).map(mapearIncidenciaDesdeAPI);

    sessionStorage.setItem("incidenciasCache", JSON.stringify(incidenciasOriginales));

    aplicarFiltros(filtrosActivos, false);
    mostrarMensaje("");
  } catch (error) {
    console.error(error);
    mostrarMensaje("No se han podido cargar las incidencias.");
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
// MAPEO
// ==============================

function mapearIncidenciaDesdeAPI(incidenciaAPI) {
  const fechaHora = incidenciaAPI.fechaHora ?? null;

  return {
    id: incidenciaAPI.id,
    fechaHora,
    fechaTexto: formatearFecha(fechaHora),
    horaTexto: formatearHora(fechaHora),
    asunto: incidenciaAPI.asunto ?? "",
    descripcion: incidenciaAPI.descripcion ?? "",
    estado: incidenciaAPI.estado ?? "PENDIENTE",
    estadoTexto: formatearEstado(incidenciaAPI.estado),
    reportadoPorTipo: incidenciaAPI.reportadoPorTipo ?? "",
    reportadoPorNombre: incidenciaAPI.reportadoPorNombre ?? "Sin responsable",
    responsableTiendaId: incidenciaAPI.responsableTiendaId ?? null,
    responsableTiendaNombre: incidenciaAPI.responsableTiendaNombre ?? null,
    responsableEntidadId: incidenciaAPI.responsableEntidadId ?? null,
    responsableEntidadNombre: incidenciaAPI.responsableEntidadNombre ?? null,
    cargoTexto: formatearCargo(incidenciaAPI.reportadoPorTipo)
  };
}

function mapearIncidenciaParaActualizar(incidencia, nuevoEstado) {
  return {
    fechaHora: incidencia.fechaHora,
    asunto: incidencia.asunto,
    descripcion: incidencia.descripcion,
    estado: nuevoEstado,
    responsableTiendaId: incidencia.responsableTiendaId,
    responsableEntidadId: incidencia.responsableEntidadId
  };
}

// ==============================
// TABLA
// ==============================

function renderizarFilas(datos) {
  incidenciasCache = datos;

  const tbody = document.querySelector("#tabla-incidencias-body");

  if (!tbody) return;

  tbody.innerHTML = "";

  if (!datos || datos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="estado-vacio">No hay incidencias registradas.</td>
      </tr>
    `;
    resetearSeleccion();
    return;
  }

  datos.forEach((incidencia) => {
    const fila = document.createElement("tr");

    fila.dataset.id = incidencia.id;
    fila.tabIndex = 0;

    fila.innerHTML = `
      <td>${escaparHTML(incidencia.id)}</td>
      <td>${escaparHTML(incidencia.reportadoPorNombre)}</td>
      <td>${escaparHTML(incidencia.cargoTexto)}</td>
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

    tbody.appendChild(fila);
  });
}

function seleccionarFilaDesdeEvento(evento) {
  const fila = evento.target.closest("tr");

  if (!fila || !fila.dataset.id) return;

  seleccionarFila(fila);
}

function abrirDetalleDesdeEvento(evento) {
  const fila = evento.target.closest("tr");

  if (!fila || !fila.dataset.id) return;

  seleccionarFila(fila);

  const incidencia = buscarIncidenciaPorId(fila.dataset.id);

  if (!incidencia) return;

  abrirDetalleEnMenuLateral(incidencia);
}

function seleccionarFila(fila) {
  document.querySelectorAll("#tabla-incidencias-body tr").forEach((tr) => {
    tr.classList.remove("seleccionada");
    tr.classList.remove("tabla-incidencias__fila--seleccionada");
  });

  fila.classList.add("seleccionada");
  fila.classList.add("tabla-incidencias__fila--seleccionada");

  incidenciaSeleccionada = buscarIncidenciaPorId(fila.dataset.id);
  actualizarBotonesEstado();
}

function buscarIncidenciaPorId(id) {
  return incidenciasOriginales.find((incidencia) => Number(incidencia.id) === Number(id));
}

function resetearSeleccion() {
  incidenciaSeleccionada = null;
  actualizarBotonesEstado();
}

// ==============================
// ACCIONES DE ESTADO
// ==============================

async function confirmarLectura() {
  await cambiarEstadoSeleccionada("LEIDA");
}

async function confirmarResolucion() {
  await cambiarEstadoSeleccionada("RESUELTA");
}

async function cambiarEstadoSeleccionada(nuevoEstado) {
  if (!incidenciaSeleccionada) {
    alert("Debes seleccionar primero una incidencia.");
    return;
  }

  try {
    const datosActualizados = mapearIncidenciaParaActualizar(incidenciaSeleccionada, nuevoEstado);

    await enviarJSON(
      `${endpoints.incidencias}/${incidenciaSeleccionada.id}`,
      "PUT",
      datosActualizados,
      "No se pudo actualizar la incidencia"
    );

    await cargarIncidencias();
    canalComunicacion.postMessage("recargar-tabla-incidencias");
  } catch (error) {
    console.error(error);
    alert("No se ha podido actualizar el estado de la incidencia.");
  }
}

function actualizarBotonesEstado() {
  const btnLectura = document.getElementById("btn-confirmar-lectura");
  const btnResolucion = document.getElementById("btn-confirmar-resolucion");

  if (!btnLectura || !btnResolucion) return;

  const haySeleccion = Boolean(incidenciaSeleccionada);

  btnLectura.disabled =
    !haySeleccion ||
    incidenciaSeleccionada?.estado === "LEIDA" ||
    incidenciaSeleccionada?.estado === "RESUELTA";

  btnResolucion.disabled =
    !haySeleccion ||
    incidenciaSeleccionada?.estado === "RESUELTA";
}

// ==============================
// FILTROS
// ==============================

function aplicarFiltros(filtros, actualizarContador = true) {
  filtrosActivos = {
    reportadoPor: filtros?.reportadoPor || "",
    estado: filtros?.estado || "",
    cargo: filtros?.cargo || "",
    asunto: filtros?.asunto || ""
  };

  let filtradas = [...incidenciasOriginales];

  if (filtrosActivos.reportadoPor) {
    filtradas = filtradas.filter((incidencia) => {
      return normalizarTexto(incidencia.reportadoPorNombre)
        .includes(normalizarTexto(filtrosActivos.reportadoPor));
    });
  }

  if (filtrosActivos.estado) {
    filtradas = filtradas.filter((incidencia) => {
      return incidencia.estado === filtrosActivos.estado;
    });
  }

  if (filtrosActivos.cargo) {
    filtradas = filtradas.filter((incidencia) => {
      return incidencia.reportadoPorTipo === filtrosActivos.cargo;
    });
  }

  if (filtrosActivos.asunto) {
    filtradas = filtradas.filter((incidencia) => {
      return normalizarTexto(incidencia.asunto)
        .includes(normalizarTexto(filtrosActivos.asunto));
    });
  }

  renderizarFilas(filtradas);
  resetearSeleccion();

  if (actualizarContador) {
    actualizarContadorFiltros();
  }
}

function limpiarFiltros() {
  filtrosActivos = {
    reportadoPor: "",
    estado: "",
    cargo: "",
    asunto: ""
  };

  renderizarFilas(incidenciasOriginales);
  resetearSeleccion();
  actualizarContadorFiltros();
}

function actualizarContadorFiltros() {
  const contador = document.getElementById("contador-filtros");

  if (!contador) return;

  const total = Object.values(filtrosActivos).filter((valor) => valor !== "").length;

  contador.textContent = String(total);
  contador.hidden = total === 0;
}

// ==============================
// NAVEGACIÓN
// ==============================

function irAFormularioCreacion() {
  window.location.href = "formIncidencia.html?modo=crear";
}

// ==============================
// UTILIDADES VISUALES
// ==============================

function mostrarMensaje(texto) {
  const mensaje = document.getElementById("mensaje-incidencias");

  if (!mensaje) return;

  mensaje.textContent = texto ?? "";
}

function mostrarAyuda() {
  alert(
    "Pantalla de incidencias.\n\n" +
    "- Doble click sobre una fila: ver detalle.\n" +
    "- Click sobre una fila: seleccionarla.\n" +
    "- Confirmar lectura cambia el estado a LEIDA.\n" +
    "- Confirmar resolución cambia el estado a RESUELTA.\n" +
    "- El botón de filtro sustituye el menú lateral por el panel de filtros."
  );
}

function formatearEstado(estado) {
  if (estado === "PENDIENTE") return "Pendiente";
  if (estado === "LEIDA") return "Leída";
  if (estado === "RESUELTA") return "Resuelta";
  return "-";
}

function obtenerClaseEstado(estado) {
  if (estado === "PENDIENTE") return "estado--pendiente";
  if (estado === "LEIDA") return "estado--leida";
  if (estado === "RESUELTA") return "estado--resuelta";
  return "estado--ninguno";
}

function formatearCargo(tipo) {
  if (tipo === "RESPONSABLE_TIENDA") return "Responsable tienda";
  if (tipo === "RESPONSABLE_ENTIDAD") return "Responsable entidad";
  return "-";
}

function formatearFecha(fechaHora) {
  if (!fechaHora) return "-";

  const fecha = new Date(fechaHora);

  if (Number.isNaN(fecha.getTime())) return "-";

  return fecha.toLocaleDateString("es-ES");
}

function formatearHora(fechaHora) {
  if (!fechaHora) return "-";

  const fecha = new Date(fechaHora);

  if (Number.isNaN(fecha.getTime())) return "-";

  return fecha.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

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