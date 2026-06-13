document.addEventListener("DOMContentLoaded", () => {
    const btnCerrar = document.querySelector("#btn-cerrar-filtros");
    const btnLimpiar = document.querySelector("#btn-limpiar-filtros");
    const formFiltros = document.querySelector("#form-filtros-coordinadores");

    if (btnCerrar) {
        btnCerrar.addEventListener("click", () => {
            window.location.href = obtenerUrlCoordinadores();
        });
    }

    if (btnLimpiar) {
        btnLimpiar.addEventListener("click", () => {
            window.location.href = `${obtenerUrlCoordinadores()}?mostrarFiltros=true`;
        });
    }

    if (formFiltros) {
        formFiltros.addEventListener("submit", () => {
            eliminarCamposVacios(formFiltros);
        });
    }
});

function eliminarCamposVacios(formulario) {
    const campos = formulario.querySelectorAll("input, select");

    campos.forEach((campo) => {
        if (!campo.value || campo.value.trim() === "") {
            campo.disabled = true;
        }
    });
}

function obtenerUrlCoordinadores() {
    return `${obtenerContextPath()}/coordinadores`;
}

function obtenerContextPath() {
    return document.body.dataset.contextPath || "";
}