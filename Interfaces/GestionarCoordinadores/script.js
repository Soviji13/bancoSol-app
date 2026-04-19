// JOSE

// ==============================
// SELECTORES DEL DOM
// ==============================

// Botones del menú lateral
const botonesMenu = document.querySelectorAll(".menu-lateral__btn");

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

// Variable para guardar qué fila está seleccionada actualmente.
let filaSeleccionada = null;

// Nombre de la pantalla actual.
// Como esta vista es la de coordinadores, empezamos ahí.
let pantallaActual = "Gestionar coordinadores";


// ==============================
// FUNCIONES AUXILIARES
// ==============================

function mostrarAlerta(mensaje) {
  alert(mensaje);
}

function obtenerTextoElemento(elemento) {
  return elemento.textContent.trim();
}

/**
 * Elimina la clase activa de todos los botones del menú
 * y la añade únicamente al botón pulsado.
 *
 * @param {HTMLButtonElement} botonActivo - Botón que pasa a estar activo.
 */
function actualizarBotonActivoMenu(botonActivo) {
  botonesMenu.forEach((boton) => {
    boton.classList.remove("menu-lateral__btn--activo");
  });

  botonActivo.classList.add("menu-lateral__btn--activo");
}

function cambiarPantalla(boton) {
  const nuevaPantalla = obtenerTextoElemento(boton);

  // Si el usuario pulsa la pantalla en la que ya está,
  // igualmente avisamos para dejar claro qué ocurre.
  if (nuevaPantalla === pantallaActual) {
    mostrarAlerta(`Ya estás en la pantalla "${nuevaPantalla}".`);
    return;
  }

  // Actualizamos estado interno y botón activo
  pantallaActual = nuevaPantalla;
  actualizarBotonActivoMenu(boton);

  // Simulación visual / funcional
  mostrarAlerta(`Cambio de pantalla a: ${nuevaPantalla}`);
}

//Quita la selección visual de todas las filas.
function limpiarSeleccionFilas() {
  filasTabla.forEach((fila) => {
    fila.classList.remove("tabla-coordinadores__fila--seleccionada");
  });
}

//Selecciona una fila de la tabla.
function seleccionarFila(fila) {
  limpiarSeleccionFilas();

  fila.classList.add("tabla-coordinadores__fila--seleccionada");
  filaSeleccionada = fila;
}

// Obtiene el nombre del coordinador a partir de la primera celda de la fila.
function obtenerNombreCoordinador(fila) {
  if (!fila) {
    return "coordinador no seleccionado";
  }

  const primeraCelda = fila.querySelector("td");
  return primeraCelda ? primeraCelda.textContent.trim() : "coordinador no seleccionado";
}

//Comprueba si hay una fila seleccionada.
function hayFilaSeleccionada() {
  if (!filaSeleccionada) {
    mostrarAlerta("Debes seleccionar primero un coordinador.");
    return false;
  }

  return true;
}


// ==============================
// EVENTOS DEL MENÚ LATERAL
// ==============================

// Recorremos todos los botones del menú para escuchar clics
botonesMenu.forEach((boton) => {
  boton.addEventListener("click", () => {
    cambiarPantalla(boton);
  });
});


// ==============================
// EVENTOS DE LA ZONA SUPERIOR
// ==============================

// Botón de filtro
if (botonFiltro) {
  botonFiltro.addEventListener("click", () => {
    mostrarAlerta("Se abrirá el panel de filtros de coordinadores.");
  });
}

// Botón para cambiar de campaña
if (botonSeleccionarCampania) {
  botonSeleccionarCampania.addEventListener("click", () => {
    mostrarAlerta("Aquí se abrirá la selección de otra campaña.");
  });
}

// Botón de ayuda
if (botonAyuda) {
  botonAyuda.addEventListener("click", () => {
    const nombreCampania = tituloCampania
      ? tituloCampania.textContent.trim()
      : "la campaña actual";

    mostrarAlerta(
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
    mostrarAlerta(`Has seleccionado a: ${nombre}`);
  });

  fila.addEventListener("dblclick", () => {
    seleccionarFila(fila);

    const nombre = obtenerNombreCoordinador(fila);
    mostrarAlerta(`Se abrirá la ficha de: ${nombre}`);
  });

  // Accesibilidad básica con teclado:
  // si la fila tiene foco y el usuario pulsa Enter, se selecciona
  fila.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
      seleccionarFila(fila);

      const nombre = obtenerNombreCoordinador(fila);
      mostrarAlerta(`Has seleccionado a: ${nombre}`);
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
    mostrarAlerta(`Se eliminará al coordinador: ${nombre}`);
  });
}

// Modificar coordinador
if (botonModificar) {
  botonModificar.addEventListener("click", () => {
    if (!hayFilaSeleccionada()) {
      return;
    }

    const nombre = obtenerNombreCoordinador(filaSeleccionada);
    mostrarAlerta(`Se abrirá la edición del coordinador: ${nombre}`);
  });
}

// Añadir coordinador
if (botonAnadir) {
  botonAnadir.addEventListener("click", () => {
    const nombreCampania = tituloCampania
      ? tituloCampania.textContent.trim()
      : "la campaña actual";

    mostrarAlerta(`Se añadirá un coordinador nuevo a la campaña: ${nombreCampania}`);
  });
}

// Exportar datos
if (botonExportar) {
  botonExportar.addEventListener("click", () => {
    mostrarAlerta("Se exportarán los coordinadores a un archivo.");
  });
}