// ==============================
// SCRIPT MENÚ LATERAL
// ==============================

// Botones del menú lateral
let botonesMenu = document.querySelectorAll(".menu-lateral__btn");

// Nombre de la pantalla actual
let pantallaActual = "Gestionar coordinadores";

// ==============================
// FUNCIONES AUXILIARES
// ==============================

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

/**
 * Cambia el iframe del contenido según el botón pulsado del menú.
 *
 * @param {HTMLButtonElement} boton - Botón del menú pulsado.
 */
function cambiarPantalla(boton) {
  const nuevaPantalla = obtenerTextoElemento(boton);

  // Si el usuario pulsa la pantalla en la que ya está,
  // igualmente avisamos para dejar claro qué ocurre.
  if (nuevaPantalla === pantallaActual) {
    alert(`Ya estás en la pantalla "${nuevaPantalla}".`);
    return;
  }

  // Actualizamos estado interno y botón activo
  pantallaActual = nuevaPantalla;
  actualizarBotonActivoMenu(boton);

  // Mapa de pantallas a archivos HTML
  const mapaPantallas = {
    "Gestionar campañas": "campañas.html",
    "Gestionar coordinadores": "coordinadores.html",
    "Gestionar tiendas": "tiendas.html",
    "Gestionar colaboradores": "colaboradores.html",
    "Gestionar voluntarios": "voluntarios.html",
    "Incidencias y movimientos": "incidencias.html"
  };

  // Cambiar el src del iframe del contenido
  const iframeContenido = parent.document.querySelector(".contenido-iframe");
  const archivoHTML = mapaPantallas[nuevaPantalla];
  
  if (archivoHTML && iframeContenido) {
    iframeContenido.src = archivoHTML;
  }
}

// ==============================
// EVENTOS DEL MENÚ
// ==============================

// Recorremos todos los botones del menú para escuchar clics
botonesMenu.forEach((boton) => {
  boton.addEventListener("click", () => {
    cambiarPantalla(boton);
  });
});
