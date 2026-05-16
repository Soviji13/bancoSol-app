const formFiltro = document.querySelector("#form-filtro");
const btnCerrarFiltro = document.querySelector("#btn-cerrar-filtro");
const btnLimpiarFiltro = document.querySelector("#btn-limpiar-filtro");

btnCerrarFiltro?.addEventListener("click", () => {
  window.parent.postMessage({
    tipo: "CERRAR_FILTRO_INCIDENCIAS"
  }, "*");
});

formFiltro?.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const filtros = leerFiltros();

  window.parent.postMessage({
    tipo: "APLICAR_FILTROS_INCIDENCIAS",
    filtros
  }, "*");
});

btnLimpiarFiltro?.addEventListener("click", () => {
  formFiltro.reset();

  window.parent.postMessage({
    tipo: "LIMPIAR_FILTROS_INCIDENCIAS"
  }, "*");
});

function leerFiltros() {
  return {
    reportadoPor: document.querySelector("#filtro-reportado-por")?.value || "",
    estado: document.querySelector("#filtro-estado")?.value || "",
    cargo: document.querySelector("#filtro-cargo")?.value || "",
    asunto: document.querySelector("#filtro-asunto")?.value || ""
  };
}