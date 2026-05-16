const formFiltro = document.querySelector("#form-filtro");
const btnCerrarFiltro = document.querySelector("#btn-cerrar-filtro");
const btnLimpiarFiltro = document.querySelector("#btn-limpiar-filtro");
const selectCampania = document.querySelector("#filtro-campania");

document.addEventListener("DOMContentLoaded", () => {
  pedirCampanias();
});

btnCerrarFiltro?.addEventListener("click", () => {
  window.parent.postMessage({
    tipo: "CERRAR_FILTRO_COORDINADORES"
  }, "*");
});

formFiltro?.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const filtros = leerFiltros();

  window.parent.postMessage({
    tipo: "APLICAR_FILTROS_COORDINADORES",
    filtros
  }, "*");
});

btnLimpiarFiltro?.addEventListener("click", () => {
  formFiltro.reset();

  window.parent.postMessage({
    tipo: "LIMPIAR_FILTROS_COORDINADORES"
  }, "*");
});

window.addEventListener("message", (evento) => {
  const mensaje = evento.data;

  if (!mensaje || typeof mensaje !== "object") return;

  if (mensaje.tipo === "COORDINADORES_CAMPANIAS_CARGADAS") {
    pintarCampanias(mensaje.campanias);
  }
});

function pedirCampanias() {
  window.parent.postMessage({
    tipo: "PEDIR_CAMPANIAS_COORDINADORES"
  }, "*");
}

function leerFiltros() {
  return {
    nombre: document.querySelector("#filtro-nombre")?.value || "",
    campaniaId: document.querySelector("#filtro-campania")?.value || "",
    tiendas: document.querySelector("#filtro-tiendas")?.value || ""
  };
}

function pintarCampanias(campanias) {
  if (!selectCampania) return;

  selectCampania.innerHTML = '<option value="">Todas las campañas</option>';

  if (!Array.isArray(campanias)) return;

  campanias.forEach((campania) => {
    const option = document.createElement("option");

    option.value = campania.id;
    option.textContent = campania.nombre || `Campaña ${campania.id}`;

    selectCampania.appendChild(option);
  });
}