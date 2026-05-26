const filasTabla = document.querySelectorAll(".tabla-incidencias tbody tr");
const btnNuevaIncidencia = document.querySelector(".acciones-tabla__btn:nth-child(1)");
const btnConfirmarLectura = document.querySelector(".acciones-tabla__btn:nth-child(2)");
const btnConfirmarResolucion = document.querySelector(".acciones-tabla__btn:nth-child(3)");

let filaSeleccionada = null;

/**
 * Desactiva los botones de acción.
 */
function desactivarBotones() {
  btnConfirmarLectura.disabled = true;
  btnConfirmarResolucion.disabled = true;
}

/**
 * Activa los botones de acción.
 */
function activarBotones() {
  btnConfirmarLectura.disabled = false;
  btnConfirmarResolucion.disabled = false;
}

/**
 * Quita la selección de todas las filas.
 */
function limpiarSeleccionFilas() {
  filasTabla.forEach((fila) => {
    fila.classList.remove("seleccionada");
    fila.setAttribute("aria-selected", "false");
  });
}

/**
 * Devuelve el texto limpio de una celda.
 * @param {HTMLTableCellElement} celda
 * @returns {string}
 */
function obtenerTextoCelda(celda) {
  return celda ? celda.textContent.trim() : "";
}

/**
 * Genera un id interno de ejemplo.
 * @param {number} indice
 * @returns {string}
 */
function generarIdInterno(indice) {
  return String(719 + indice).padStart(6, "0");
}

/**
 * Construye un objeto incidencia a partir de una fila.
 * @param {HTMLTableRowElement} fila
 * @param {number} indice
 * @returns {Object}
 */
function construirIncidenciaDesdeFila(fila, indice) {
  const celdas = fila.querySelectorAll("td");

  const tipo = obtenerTextoCelda(celdas[0]);
  const reportadoPor = obtenerTextoCelda(celdas[1]);
  const cargo = obtenerTextoCelda(celdas[2]);
  const contacto = obtenerTextoCelda(celdas[3]);
  const hora = obtenerTextoCelda(celdas[4]);
  const fecha = obtenerTextoCelda(celdas[5]);
  const asunto = obtenerTextoCelda(celdas[6]);
  const estado = obtenerTextoCelda(celdas[7]);

  let email = "No disponible";
  let descripcion = "No se ha añadido una descripción detallada para esta incidencia.";

  if (reportadoPor === "Mariana Olmo Jiménez") {
    email = "marianaolj41@gmail.com";
    descripcion = "Incidencia pendiente de revisión por la responsable de entidad. Se requiere validar la información recibida y confirmar su resolución.";
  } else if (reportadoPor === "Juan García Sánchez") {
    email = "juangarcia@email.com";
    descripcion = "La incidencia ya ha sido revisada y marcada como resuelta por el responsable de tienda.";
  } else if (reportadoPor === "Pepe Zamora Blanco") {
    email = "pepzam3@gmail.com";
    descripcion = "Movimiento registrado relacionado con la creación o actualización de una nueva tienda.";
  }

  return {
    idInterno: generarIdInterno(indice),
    tipo,
    reportadoPor,
    cargo,
    contacto,
    hora,
    fecha,
    asunto,
    asuntoCompleto: asunto,
    estado,
    email,
    descripcion
  };
}

/**
 * Carga el panel lateral con la incidencia seleccionada.
 * Se asume que existe un iframe con clase .menu-lateral-iframe en la página padre.
 * @param {Object} incidencia
 */
function abrirPanelLateral(incidencia) {
  sessionStorage.setItem("incidenciaSeleccionada", JSON.stringify(incidencia));

  if (window.parent && window.parent !== window) {
    const iframeMenu = window.parent.document.querySelector(".menu-lateral-iframe");

    if (iframeMenu) {
      iframeMenu.src = "../Incidencias/incidenciaSeleccionada.html";
    }
  }
}

/**
 * Selecciona una fila y abre el panel lateral.
 * @param {HTMLTableRowElement} fila
 * @param {number} indice
 */
function seleccionarFila(fila, indice) {
  limpiarSeleccionFilas();

  fila.classList.add("seleccionada");
  fila.setAttribute("aria-selected", "true");

  filaSeleccionada = fila;
  activarBotones();

  const incidencia = construirIncidenciaDesdeFila(fila, indice);
  abrirPanelLateral(incidencia);
}

/**
 * Marca la fila seleccionada como leída.
 */
function confirmarLectura() {
  if (!filaSeleccionada) {
    return;
  }

  const celdaEstado = filaSeleccionada.querySelector("td:last-child");
  if (!celdaEstado) {
    return;
  }

  celdaEstado.innerHTML = '<span class="estado estado--leida">Leída</span>';
}

/**
 * Marca la fila seleccionada como resuelta.
 */
function confirmarResolucion() {
  if (!filaSeleccionada) {
    return;
  }

  const celdaEstado = filaSeleccionada.querySelector("td:last-child");
  if (!celdaEstado) {
    return;
  }

  celdaEstado.innerHTML = '<span class="estado estado--resuelta">Resuelta</span>';
}

filasTabla.forEach((fila, indice) => {
  fila.setAttribute("aria-selected", "false");

  fila.addEventListener("click", () => {
    seleccionarFila(fila, indice);
  });

  fila.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      seleccionarFila(fila, indice);
    }
  });
});

btnNuevaIncidencia.addEventListener("click", () => {
  window.location.href = "formIncidencia.html";
});

btnConfirmarLectura.addEventListener("click", confirmarLectura);
btnConfirmarResolucion.addEventListener("click", confirmarResolucion);

desactivarBotones();