/* ==========================================================
   Vista de coordinadores
   ----------------------------------------------------------
   Este módulo centraliza la obtención de elementos del DOM,
   el renderizado de tablas, detalles, campañas, modales y
   estados visuales de la pantalla de coordinadores.
   ========================================================== */

/* ==============================
   SELECTORES
   ============================== */

const SELECTORES = Object.freeze({
  tablaBody: "#tabla-body",
  tabla: "table",
  titulo: ".encabezado h1",

  btnAbrirRegistro: "#btn-abrir-registro",
  btnModificar: "#btn-modificar-coordinador",
  btnEliminar: "#btn-eliminar-coordinador",
  btnFiltro: "#filtrar",
  btnSeleccionarCampania: "#btn-seleccionar-campania",
  btnCerrarSelector: "#cerrar-selector",
  btnCerrarDetalle: "#btn-cerrar-detalle",
  btnAyuda: "#btn-ayuda",
  btnCsv: ".csv",

  avisoBorrado: "#aviso-borrado",
  modalCampanias: "#modal-campanias",
  modalDetalle: "#modal-detalle",
  listaCampanias: "#lista-campanias",

  detalleNombre: "#detalle-nombre",
  detalleId: "#detalle-id",
  detalleEmail: "#detalle-email",
  detalleTelefono: "#detalle-telefono",
  detalleArea: "#detalle-area",
  detalleTiendas: "#detalle-tiendas",
  detallePermiso: "#detalle-permiso",
  detalleCampanias: "#detalle-campanias"
});

/* ==============================
   ELEMENTOS
   ============================== */

export function obtenerElementos() {
  return {
    cuerpoTabla: document.querySelector(SELECTORES.tablaBody),
    tabla: document.querySelector(SELECTORES.tabla),
    titulo: document.querySelector(SELECTORES.titulo),

    botonAbrirRegistro: document.querySelector(SELECTORES.btnAbrirRegistro),
    botonModificar: document.querySelector(SELECTORES.btnModificar),
    botonEliminar: document.querySelector(SELECTORES.btnEliminar),
    botonFiltro: document.querySelector(SELECTORES.btnFiltro),
    botonSeleccionarCampania: document.querySelector(SELECTORES.btnSeleccionarCampania),
    botonCerrarSelector: document.querySelector(SELECTORES.btnCerrarSelector),
    botonCerrarDetalle: document.querySelector(SELECTORES.btnCerrarDetalle),
    botonAyuda: document.querySelector(SELECTORES.btnAyuda),
    botonCsv: document.querySelector(SELECTORES.btnCsv),

    avisoBorrado: document.querySelector(SELECTORES.avisoBorrado)
  };
}

/* ==============================
   TABLA
   ============================== */

export function pintarCoordinadores({
  cuerpoTabla,
  coordinadores,
  onSeleccionarFila,
  onDobleClickFila
}) {
  if (!cuerpoTabla) {
    return;
  }

  cuerpoTabla.replaceChildren();

  if (!coordinadores || coordinadores.length === 0) {
    cuerpoTabla.appendChild(crearFilaVacia());
    return;
  }

  const fragmento = document.createDocumentFragment();

  coordinadores.forEach((coordinador) => {
    fragmento.appendChild(
      crearFilaCoordinador({
        coordinador,
        onSeleccionarFila,
        onDobleClickFila
      })
    );
  });

  cuerpoTabla.appendChild(fragmento);
}

function crearFilaVacia() {
  const fila = document.createElement("tr");
  const celda = document.createElement("td");

  celda.colSpan = 6;
  celda.className = "estado-vacio";
  celda.textContent = "No hay coordinadores registrados.";

  fila.appendChild(celda);
  return fila;
}

function crearFilaCoordinador({
  coordinador,
  onSeleccionarFila,
  onDobleClickFila
}) {
  const fila = document.createElement("tr");

  fila.dataset.id = coordinador.id;

  fila.appendChild(crearCelda(coordinador.nombre));
  fila.appendChild(crearCeldaCampanias(coordinador.nombresCampanias));
  fila.appendChild(crearCelda(`${Number(coordinador.tiendas) || 0} tiendas`));
  fila.appendChild(crearCelda(coordinador.area || "---"));
  fila.appendChild(crearCeldaContacto(coordinador));
  fila.appendChild(crearCeldaPermiso(coordinador.permisoModificar));

  fila.addEventListener("click", (evento) => onSeleccionarFila(evento, fila, coordinador));
  fila.addEventListener("dblclick", (evento) => onDobleClickFila(evento, fila, coordinador));

  return fila;
}

function crearCelda(texto) {
  const celda = document.createElement("td");
  celda.textContent = texto ?? "";
  return celda;
}

function crearCeldaCampanias(nombresCampanias) {
  const celda = document.createElement("td");
  const nombres = nombresCampanias?.length ? nombresCampanias : ["Sin campañas"];

  if (nombres.length === 1) {
    celda.textContent = nombres[0];
    return celda;
  }

  const lista = document.createElement("ul");
  lista.className = "lista-entidades";

  nombres.forEach((nombre) => {
    const item = document.createElement("li");
    item.textContent = nombre;
    lista.appendChild(item);
  });

  celda.appendChild(lista);
  return celda;
}

function crearCeldaContacto(coordinador) {
  const celda = document.createElement("td");

  if (!coordinador.email && !coordinador.telefono) {
    celda.textContent = "Sin contacto";
    return celda;
  }

  if (coordinador.email) {
    const email = document.createElement("small");
    email.textContent = coordinador.email;
    celda.appendChild(email);
  }

  if (coordinador.email && coordinador.telefono) {
    celda.appendChild(document.createElement("br"));
  }

  if (coordinador.telefono) {
    const telefono = document.createElement("small");
    telefono.textContent = coordinador.telefono;
    celda.appendChild(telefono);
  }

  return celda;
}

function crearCeldaPermiso(permisoModificar) {
  const celda = document.createElement("td");
  const badge = document.createElement("span");

  badge.className = permisoModificar ? "badge badge-si" : "badge badge-no";
  badge.textContent = permisoModificar ? "SÍ" : "NO";

  celda.appendChild(badge);
  return celda;
}

export function marcarFilaSeleccionada(cuerpoTabla, fila) {
  if (!cuerpoTabla || !fila) {
    return;
  }

  cuerpoTabla.querySelectorAll("tr").forEach((tr) => {
    tr.classList.remove("fila-seleccionada");
  });

  fila.classList.add("fila-seleccionada");
}

/* ==============================
   DETALLE
   ============================== */

export function pintarDetalleCoordinador(coordinador) {
  escribirTexto(SELECTORES.detalleNombre, coordinador.nombre);
  escribirTexto(SELECTORES.detalleId, coordinador.id);
  escribirTexto(SELECTORES.detalleEmail, coordinador.email || "---");
  escribirTexto(SELECTORES.detalleTelefono, coordinador.telefono || "---");
  escribirTexto(SELECTORES.detalleArea, coordinador.area || "---");
  escribirTexto(SELECTORES.detalleTiendas, `${Number(coordinador.tiendas) || 0} tiendas`);
  escribirTexto(SELECTORES.detallePermiso, coordinador.permisoModificar ? "Sí" : "No");

  const contenedor = document.querySelector(SELECTORES.detalleCampanias);

  if (!contenedor) {
    return;
  }

  contenedor.replaceChildren();

  const nombres = coordinador.nombresCampanias.length ? coordinador.nombresCampanias : ["Sin campañas"];

  nombres.forEach((nombre) => {
    const div = document.createElement("div");
    div.className = "check-item";
    div.textContent = nombre;
    contenedor.appendChild(div);
  });
}

/* ==============================
   CAMPAÑAS
   ============================== */

export function pintarSelectorCampanias({
  campanias,
  idCampaniaVisualizada,
  onSeleccionarCampania
}) {
  const grid = document.querySelector(SELECTORES.listaCampanias);

  if (!grid) {
    return;
  }

  grid.replaceChildren();
  mostrarModal("modal-campanias");

  campanias.forEach((campania) => {
    grid.appendChild(
      crearCardCampania({
        campania,
        idCampaniaVisualizada,
        onSeleccionarCampania
      })
    );
  });
}

function crearCardCampania({
  campania,
  idCampaniaVisualizada,
  onSeleccionarCampania
}) {
  const card = document.createElement("div");
  const esSeleccionada = Number(campania.id) === Number(idCampaniaVisualizada);

  card.className = `campania-card ${esSeleccionada ? "seleccionada" : ""}`;

  const cabecera = document.createElement("div");
  cabecera.className = "card-header-flex";

  const titulo = document.createElement("h3");
  titulo.textContent = campania.nombre || `Campaña ${campania.id}`;

  const badges = document.createElement("div");
  badges.className = "badges-container";

  badges.appendChild(
    crearBadge(
      campania.activa ? "ACTIVA" : "INACTIVA",
      campania.activa ? "badge badge-activa" : "badge badge-inactiva"
    )
  );

  if (esSeleccionada) {
    badges.appendChild(crearBadge("VIENDO AHORA", "badge badge-viendo"));
  }

  cabecera.appendChild(titulo);
  cabecera.appendChild(badges);

  const fechas = document.createElement("p");
  const inicio = campania.fechaInicio ? new Date(campania.fechaInicio).toLocaleDateString() : "---";
  const fin = campania.fechaFin ? new Date(campania.fechaFin).toLocaleDateString() : "---";
  fechas.textContent = `Inicio: ${inicio} | Fin: ${fin}`;

  const anio = document.createElement("p");
  anio.textContent = `Año fiscal: ${campania.anio || "---"}`;

  card.appendChild(cabecera);
  card.appendChild(fechas);
  card.appendChild(anio);
  card.addEventListener("click", () => onSeleccionarCampania(campania));

  return card;
}

function crearBadge(texto, clase) {
  const badge = document.createElement("span");
  badge.className = clase;
  badge.textContent = texto;
  return badge;
}

/* ==============================
   BOTONES Y MODOS
   ============================== */

export function activarModoEliminar({ aviso, tabla, botonEliminar }) {
  if (aviso) aviso.style.display = "block";
  if (tabla) tabla.classList.add("modo-borrado-activo");

  if (botonEliminar) {
    botonEliminar.style.backgroundColor = "#e02424";
    botonEliminar.style.color = "white";
  }
}

export function desactivarModoEliminar({ aviso, tabla, botonEliminar }) {
  if (aviso) aviso.style.display = "none";
  if (tabla) tabla.classList.remove("modo-borrado-activo");

  if (botonEliminar) {
    botonEliminar.style.backgroundColor = "";
    botonEliminar.style.color = "";
  }
}

export function activarBotonModificar(botonModificar) {
  if (!botonModificar) {
    return;
  }

  botonModificar.classList.replace("desactivado", "activado");
  botonModificar.title = "Modificar coordinador seleccionado";
}

export function resetearBotonModificar(botonModificar) {
  if (!botonModificar) {
    return;
  }

  botonModificar.classList.replace("activado", "desactivado");
  botonModificar.title = "Debes primero seleccionar un coordinador";
}

/* ==============================
   MODALES, LOADER Y MENSAJES
   ============================== */

export function mostrarModal(idModal) {
  const modal = document.getElementById(idModal);

  if (modal) {
    modal.style.display = "flex";
  }
}

export function cerrarModal(idModal) {
  const modal = document.getElementById(idModal);

  if (modal) {
    modal.style.display = "none";
  }
}

export function mostrarLoader(mostrar) {
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

export function cambiarTitulo(texto) {
  const titulo = document.querySelector(SELECTORES.titulo);

  if (titulo) {
    titulo.textContent = texto;
  }
}

function escribirTexto(selector, texto) {
  const elemento = document.querySelector(selector);

  if (elemento) {
    elemento.textContent = texto ?? "";
  }
}