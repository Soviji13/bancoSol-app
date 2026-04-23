// ==============================
// SCRIPT GENERAL - GESTIÓN COORDINADORES
// ==============================

// Botón de cerrar sesión
const botonLogout = document.querySelector(".panel-coordinadores__logout");

// ==============================
// EVENTOS
// ==============================

if (botonLogout) {
  botonLogout.addEventListener("click", (evento) => {
    evento.preventDefault();
    alert("¿Estás seguro de que deseas cerrar sesión?");
  });
}
