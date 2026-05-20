/* ==========================================================
   Controlador de coordinadores
   ----------------------------------------------------------
   Este módulo coordina la carga, filtrado, selección, detalle,
   eliminación y exportación CSV de coordinadores.
   ========================================================== */

import {
  listarCoordinadores,
  listarCampanias,
  eliminarCoordinadorPorId
} from "./coordinadorApi.js";

import {
  mapearCoordinadorDesdeAPI,
  obtenerCabecerasCSVCoordinadores,
  mapearCoordinadoresParaCSV
} from "./coordinadorMapper.js";

import {
  obtenerElementos,
  pintarCoordinadores,
  marcarFilaSeleccionada,
  pintarDetalleCoordinador,
  pintarSelectorCampanias,
  activarModoEliminar,
  desactivarModoEliminar as desactivarModoEliminarVista,
  activarBotonModificar,
  resetearBotonModificar as resetearBotonModificarVista,
  mostrarModal,
  cerrarModal,
  mostrarLoader,
  cambiarTitulo
} from "./coordinadorView.js";

import {
  exportarCSV
} from "../utils/csvUtils.js";

/*
 * Convención de rutas:
 * - Utilidades globales: ../utils/
 * - Assets globales: ../assets/
 */

/* ==============================
   CONFIGURACIÓN
   ============================== */

const CANAL_BANCOSOL = "bancosol_channel";

const MENSAJES_CANAL = Object.freeze({
  recargarCoordinadores: "recargar-tabla-coordinadores",
  recargarTabla: "recargar-tabla"
});

const MENSAJES_PARENT = Object.freeze({
  abrirFiltro: "ABRIR_FILTRO_COORDINADORES",
  aplicarFiltros: "APLICAR_FILTROS_COORDINADORES",
  limpiarFiltros: "LIMPIAR_FILTROS_COORDINADORES",
  pedirCampanias: "PEDIR_CAMPANIAS_COORDINADORES",
  campaniasCargadas: "COORDINADORES_CAMPANIAS_CARGADAS"
});

/* ==============================
   ESTADO
   ============================== */

const estado = {
  coordinadoresOriginales: [],
  coordinadoresVisibles: [],
  campanias: [],
  modoEliminarActivo: false,
  idCampaniaVisualizada: null,
  coordinadorSeleccionadoId: null
};

const canalComunicacion = new BroadcastChannel(CANAL_BANCOSOL);
let elementos = null;

/* ==============================
   INICIALIZACIÓN
   ============================== */

document.addEventListener("DOMContentLoaded", inicializarVista);

function inicializarVista() {
  elementos = obtenerElementos();
  registrarEventosInterfaz();
  cargarDatosIniciales();
}

/* ==============================
   EVENTOS
   ============================== */

function registrarEventosInterfaz() {
  elementos.botonEliminar?.addEventListener("click", alternarModoEliminar);
  elementos.botonAbrirRegistro?.addEventListener("click", irAFormularioCreacion);
  elementos.botonModificar?.addEventListener("click", irAFormularioEdicion);
  elementos.botonCsv?.addEventListener("click", exportarCoordinadoresVisibles);
  elementos.botonFiltro?.addEventListener("click", abrirFiltroEnMenuLateral);
  elementos.botonSeleccionarCampania?.addEventListener("click", abrirSelectorCampanias);
  elementos.botonCerrarSelector?.addEventListener("click", () => cerrarModal("modal-campanias"));
  elementos.botonCerrarDetalle?.addEventListener("click", () => cerrarModal("modal-detalle"));
  elementos.botonAyuda?.addEventListener("click", mostrarAyuda);

  canalComunicacion.addEventListener("message", gestionarMensajeCanal);
  window.addEventListener("message", gestionarMensajeDocumentoPadre);
}

function gestionarMensajeCanal(evento) {
  if (
    evento.data === MENSAJES_CANAL.recargarCoordinadores ||
    evento.data === MENSAJES_CANAL.recargarTabla
  ) {
    cargarDatosIniciales();
    resetearSeleccion();
  }
}

function gestionarMensajeDocumentoPadre(evento) {
  const mensaje = evento.data;

  if (!mensaje || typeof mensaje !== "object") {
    return;
  }

  if (mensaje.tipo === MENSAJES_PARENT.aplicarFiltros) {
    aplicarFiltros(mensaje.filtros);
    return;
  }

  if (mensaje.tipo === MENSAJES_PARENT.limpiarFiltros) {
    mostrarTodosLosCoordinadores();
    return;
  }

  if (mensaje.tipo === MENSAJES_PARENT.pedirCampanias) {
    notificarCampaniasAlPadre();
  }
}

/* ==============================
   CARGA DE DATOS
   ============================== */

async function cargarDatosIniciales() {
  mostrarLoader(true);

  try {
    const [coordinadoresAPI, campaniasAPI] = await Promise.all([
      listarCoordinadores(),
      listarCampanias()
    ]);

    estado.campanias = normalizarColeccion(campaniasAPI);
    estado.coordinadoresOriginales = normalizarColeccion(coordinadoresAPI)
      .map((coordinador) => mapearCoordinadorDesdeAPI(coordinador, estado.campanias));

    sessionStorage.setItem("coordinadoresCache", JSON.stringify(estado.coordinadoresOriginales));

    notificarCampaniasAlPadre();
    aplicarVistaInicial();
  } catch (error) {
    console.error(error);
    alert(error.message || "No se pudieron cargar los datos de coordinadores.");
  } finally {
    mostrarLoader(false);
  }
}

function normalizarColeccion(datos) {
  return Array.isArray(datos) ? datos : [];
}

function aplicarVistaInicial() {
  cambiarTitulo("Coordinadores");
  mostrarTodosLosCoordinadores();
}

function mostrarTodosLosCoordinadores() {
  renderizarCoordinadores(estado.coordinadoresOriginales);
  resetearSeleccion();
}

/* ==============================
   RENDERIZADO
   ============================== */

function renderizarCoordinadores(coordinadores) {
  estado.coordinadoresVisibles = coordinadores;

  pintarCoordinadores({
    cuerpoTabla: elementos.cuerpoTabla,
    coordinadores,
    onSeleccionarFila: seleccionarFila,
    onDobleClickFila: abrirDetalleDesdeFila
  });
}

/* ==============================
   SELECCIÓN Y DETALLE
   ============================== */

function seleccionarFila(evento, fila, coordinador) {
  if (estado.modoEliminarActivo) {
    eliminarCoordinador(coordinador);
    return;
  }

  marcarFilaSeleccionada(elementos.cuerpoTabla, fila);
  estado.coordinadorSeleccionadoId = Number(coordinador.id);
  activarBotonModificar(elementos.botonModificar);
}

function abrirDetalleDesdeFila(evento, fila, coordinador) {
  if (estado.modoEliminarActivo) {
    return;
  }

  pintarDetalleCoordinador(coordinador);
  mostrarModal("modal-detalle");
}

function resetearSeleccion() {
  estado.coordinadorSeleccionadoId = null;
  resetearBotonModificarVista(elementos.botonModificar);
}

/* ==============================
   NAVEGACIÓN
   ============================== */

function irAFormularioCreacion() {
  window.location.href = "formularioCoordinador.html?modo=crear";
}

function irAFormularioEdicion() {
  if (!estado.coordinadorSeleccionadoId) {
    alert("Debes seleccionar primero un coordinador.");
    return;
  }

  window.location.href = `formularioCoordinador.html?modo=editar&id=${estado.coordinadorSeleccionadoId}`;
}

/* ==============================
   COMUNICACIÓN CON DOCUMENTO PADRE
   ============================== */

function abrirFiltroEnMenuLateral() {
  window.parent.postMessage(
    {
      tipo: MENSAJES_PARENT.abrirFiltro
    },
    "*"
  );
}

function notificarCampaniasAlPadre() {
  window.parent.postMessage(
    {
      tipo: MENSAJES_PARENT.campaniasCargadas,
      campanias: estado.campanias
    },
    "*"
  );
}

/* ==============================
   ELIMINACIÓN
   ============================== */

function alternarModoEliminar() {
  estado.modoEliminarActivo = !estado.modoEliminarActivo;

  if (estado.modoEliminarActivo) {
    activarModoEliminar({
      aviso: elementos.avisoBorrado,
      tabla: elementos.tabla,
      botonEliminar: elementos.botonEliminar
    });
    return;
  }

  desactivarModoEliminar();
}

async function eliminarCoordinador(coordinador) {
  if (!coordinador) {
    return;
  }

  const confirma = confirm(`⚠️ ¿ELIMINAR PERMANENTEMENTE? \nSe borrará "${coordinador.nombre}".`);

  if (!confirma) {
    return;
  }

  try {
    await eliminarCoordinadorPorId(coordinador.id);

    alert("Coordinador eliminado correctamente.");
    await cargarDatosIniciales();
    desactivarModoEliminar();
  } catch (error) {
    console.error(error);
    alert("No se pudo eliminar el coordinador.");
  }
}

function desactivarModoEliminar() {
  estado.modoEliminarActivo = false;

  desactivarModoEliminarVista({
    aviso: elementos.avisoBorrado,
    tabla: elementos.tabla,
    botonEliminar: elementos.botonEliminar
  });
}

/* ==============================
   FILTROS
   ============================== */

function aplicarFiltros(filtros) {
  const filtrosNormalizados = normalizarFiltros(filtros);

  const filtrados = estado.coordinadoresOriginales.filter((coordinador) => {
    return cumpleFiltroNombre(coordinador, filtrosNormalizados.nombre) &&
      cumpleFiltroCampania(coordinador, filtrosNormalizados.campaniaId) &&
      cumpleFiltroTiendas(coordinador, filtrosNormalizados.tiendas);
  });

  renderizarCoordinadores(filtrados);
  resetearSeleccion();
}

function normalizarFiltros(filtros = {}) {
  return {
    nombre: normalizarTexto(filtros.nombre || ""),
    campaniaId: filtros.campaniaId || "",
    tiendas: filtros.tiendas || ""
  };
}

function cumpleFiltroNombre(coordinador, filtroNombre) {
  return !filtroNombre || normalizarTexto(coordinador.nombre).includes(filtroNombre);
}

function cumpleFiltroCampania(coordinador, filtroCampaniaId) {
  if (!filtroCampaniaId) {
    return true;
  }

  return coordinador.idsCampanias.includes(Number(filtroCampaniaId));
}

function cumpleFiltroTiendas(coordinador, filtroTiendas) {
  if (filtroTiendas === "" || filtroTiendas === null || filtroTiendas === undefined) {
    return true;
  }

  return Number(coordinador.tiendas) === Number(filtroTiendas);
}

/* ==============================
   SELECTOR DE CAMPAÑAS
   ============================== */

function abrirSelectorCampanias() {
  pintarSelectorCampanias({
    campanias: estado.campanias,
    idCampaniaVisualizada: estado.idCampaniaVisualizada,
    onSeleccionarCampania: seleccionarCampania
  });
}

function seleccionarCampania(campania) {
  estado.idCampaniaVisualizada = Number(campania.id);

  cambiarTitulo(campania.nombre || `Campaña ${campania.id}`);
  cerrarModal("modal-campanias");
  actualizarTablaPorCampania(campania.id);
}

function actualizarTablaPorCampania(idCampania) {
  const filtrados = estado.coordinadoresOriginales.filter((coordinador) => {
    return coordinador.idsCampanias.includes(Number(idCampania));
  });

  renderizarCoordinadores(filtrados);
  resetearSeleccion();
}

/* ==============================
   CSV
   ============================== */

function exportarCoordinadoresVisibles() {
  if (!estado.coordinadoresVisibles || estado.coordinadoresVisibles.length === 0) {
    alert("No hay datos cargados en la tabla para exportar.");
    return;
  }

  const fecha = new Date().toISOString().slice(0, 10);

  exportarCSV({
    cabeceras: obtenerCabecerasCSVCoordinadores(),
    filas: mapearCoordinadoresParaCSV(estado.coordinadoresVisibles),
    nombreArchivo: `bancosol_coordinadores_${fecha}`
  });
}

/* ==============================
   AYUDA Y UTILIDADES
   ============================== */

function mostrarAyuda() {
  alert(
    "Pantalla de coordinadores.\n\n" +
    "- Doble click sobre una fila: ver detalle.\n" +
    "- Click sobre una fila: seleccionarla para modificar.\n" +
    "- Eliminar coordinador: activa el modo borrado y después se pulsa la fila.\n" +
    "- El botón de filtro sustituye el menú lateral por el panel de filtros."
  );
}

function normalizarTexto(texto) {
  return String(texto ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}