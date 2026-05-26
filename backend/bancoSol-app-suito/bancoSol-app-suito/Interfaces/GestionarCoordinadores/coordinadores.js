// ==============================
// SCRIPT COORDINADORES
// ==============================

// ==============================
// SELECTORES DEL DOM
// ==============================

// Botones de la parte superior
const botonFiltro = document.querySelector(".boton-icono");
const botonSeleccionarCampania = document.querySelector(".boton-secundario");
const botonAyuda = document.querySelector(".boton-ayuda");

// Filas de la tabla
const filasTabla = document.querySelectorAll(".tabla-coordinadores tbody tr");

// Botones del footer
const botonEliminar = document.querySelector(".acciones-tabla__btn:nth-child(1)");
const botonModificar = document.querySelector(".acciones-tabla__btn:nth-child(2)");
const botonAnadir = document.querySelector(".acciones-tabla__btn:nth-child(3)");
const botonExportar = document.querySelector(".boton-exportar");

// Elemento donde aparece el título de la campaña
const tituloCampania = document.querySelector(".contenido__titulo");

// ==============================
// ESTADO DE LA INTERFAZ
// ==============================

// Variable para guardar qué fila está seleccionada actualmente
let filaSeleccionada = null;

// ==============================
// FUNCIONES AUXILIARES
// ==============================

function obtenerTextoElemento(elemento) {
  return elemento.textContent.trim();
}

/**
 * Obtiene el nombre del coordinador a partir de la primera celda de la fila.
 *
 * @param {HTMLTableRowElement} fila - Fila de la tabla.
 * @returns {string} Nombre del coordinador o mensaje por defecto.
 */
function obtenerNombreCoordinador(fila) {
  if (!fila) {
    return "coordinador no seleccionado";
  }

  const primeraCelda = fila.querySelector("td");
  return primeraCelda ? primeraCelda.textContent.trim() : "coordinador no seleccionado";
}

/**
 * Comprueba si hay una fila seleccionada.
 *
 * @returns {boolean} True si hay fila seleccionada, false en caso contrario.
 */
function hayFilaSeleccionada() {
  if (!filaSeleccionada) {
    alert("Debes seleccionar primero un coordinador.");
    return false;
  }

  return true;
}

/**
 * Quita la selección visual de todas las filas.
 */
function limpiarSeleccionFilas() {
  filasTabla.forEach((fila) => {
    fila.classList.remove("tabla-coordinadores__fila--seleccionada");
  });
}

/**
 * Selecciona una fila de la tabla.
 *
 * @param {HTMLTableRowElement} fila - Fila a seleccionar.
 */
function seleccionarFila(fila) {
  limpiarSeleccionFilas();

  fila.classList.add("tabla-coordinadores__fila--seleccionada");
  filaSeleccionada = fila;
}

// ==============================
// EVENTOS DE LA ZONA SUPERIOR
// ==============================

// Botón de filtro
if (botonFiltro) {
  botonFiltro.addEventListener("click", () => {
    alert("Se abrirá el panel de filtros de coordinadores.");
  });
}

// Botón para cambiar de campaña
if (botonSeleccionarCampania) {
  botonSeleccionarCampania.addEventListener("click", () => {
    alert("Aquí se abrirá la selección de otra campaña.");
  });
}

// Botón de ayuda
if (botonAyuda) {
  botonAyuda.addEventListener("click", () => {
    const nombreCampania = tituloCampania
      ? tituloCampania.textContent.trim()
      : "la campaña actual";

    alert(
      `Ayuda de la pantalla de coordinadores.\n\nCampaña actual: ${nombreCampania}\n\nHaz clic en una fila para seleccionarla y doble clic para ver más información.`
    );
  });
}

// ==============================
// EVENTOS DE LA TABLA
// ==============================

filasTabla.forEach((fila) => {
  fila.addEventListener("click", () => {
    seleccionarFila(fila);

    const nombre = obtenerNombreCoordinador(fila);
    alert(`Has seleccionado a: ${nombre}`);
  });

  fila.addEventListener("dblclick", () => {
    seleccionarFila(fila);

    const nombre = obtenerNombreCoordinador(fila);
    alert(`Se abrirá la ficha de: ${nombre}`);
  });

  // Accesibilidad básica con teclado:
  // si la fila tiene foco y el usuario pulsa Enter, se selecciona
  fila.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
      seleccionarFila(fila);

      const nombre = obtenerNombreCoordinador(fila);
      alert(`Has seleccionado a: ${nombre}`);
    }
  });
});

// ==============================
// EVENTOS DEL FOOTER
// ==============================

// Eliminar coordinador
if (botonEliminar) {
  botonEliminar.addEventListener("click", () => {
    if (!hayFilaSeleccionada()) {
      return;
    }

    const nombre = obtenerNombreCoordinador(filaSeleccionada);
    alert(`Se eliminará al coordinador: ${nombre}`);
  });
}

// Modificar coordinador
if (botonModificar) {
  botonModificar.addEventListener("click", () => {
    if (!hayFilaSeleccionada()) {
      return;
    }

    const nombre = obtenerNombreCoordinador(filaSeleccionada);
    alert(`Se abrirá la edición del coordinador: ${nombre}`);
  });
}

// Añadir coordinador
if (botonAnadir) {
  botonAnadir.addEventListener("click", () => {
    const nombreCampania = tituloCampania
      ? tituloCampania.textContent.trim()
      : "la campaña actual";

    alert(`Se añadirá un coordinador nuevo a la campaña: ${nombreCampania}`);
  });
}

// Exportar datos
if (botonExportar) {
  botonExportar.addEventListener("click", () => {
    alert("Se exportarán los coordinadores a un archivo.");
  });
}
