const datosGuardados = sessionStorage.getItem("incidenciaSeleccionada");
const btnCerrarPanel = document.querySelector("#btn-cerrar-panel");

function formatearFecha(fechaTexto) {
    const [dia, mes, anio] = fechaTexto.split("/");
    const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const mesIndex = Number(mes) - 1;
    return `${Number(dia)} de ${meses[mesIndex]} de ${anio}`;
}

function aplicarClaseEstado(elemento, estado) {
    elemento.classList.remove(
    "panel-incidencia__valor--pendiente",
    "panel-incidencia__valor--leida",
    "panel-incidencia__valor--resuelta",
    "panel-incidencia__valor--ninguno"
    );

    if (estado === "Pendiente") {
    elemento.classList.add("panel-incidencia__valor--pendiente");
    } else if (estado === "Leída") {
    elemento.classList.add("panel-incidencia__valor--leida");
    } else if (estado === "Resuelta") {
    elemento.classList.add("panel-incidencia__valor--resuelta");
    } else {
    elemento.classList.add("panel-incidencia__valor--ninguno");
    }
}

if (datosGuardados) {
    const incidencia = JSON.parse(datosGuardados);

    document.querySelector("#titulo-incidencia").textContent = incidencia.asuntoCompleto || incidencia.asunto;
    document.querySelector("#detalle-reportado-por").textContent = incidencia.reportadoPor;
    document.querySelector("#detalle-id").textContent = incidencia.idInterno;
    document.querySelector("#detalle-estado").textContent = incidencia.estado;
    document.querySelector("#detalle-cargo").textContent = incidencia.cargo;
    document.querySelector("#detalle-telefono").textContent = `Teléfono: ${incidencia.contacto}`;
    document.querySelector("#detalle-email").textContent = `Dirección de correo: ${incidencia.email}`;
    document.querySelector("#detalle-fecha-hora").textContent =
    `${formatearFecha(incidencia.fecha)} a las ${incidencia.hora} horas.`;
    document.querySelector("#detalle-descripcion").textContent = incidencia.descripcion;

    aplicarClaseEstado(document.querySelector("#detalle-estado"), incidencia.estado);
}

btnCerrarPanel.addEventListener("click", () => {
    sessionStorage.removeItem("incidenciaSeleccionada");

    if (window.parent && window.parent !== window) {
    const iframeMenu = window.parent.document.querySelector(".menu-lateral-iframe");
    if (iframeMenu) {
        iframeMenu.src = "../MenuLateral/menu-lateral.html";
    }
    }
})