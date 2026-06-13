import { exportarCSV } from "../utils/csvUtils.js";
import { obtenerFechaHoraActualSinZona } from "../utils/fechaUtils.js";

const SELECTORES = Object.freeze({
    filaCoordinador: ".fila-coordinador",

    btnModificar: "#btn-modificar-coordinador",
    btnEliminar: "#btn-eliminar-coordinador",
    btnExportar: "#btn-exportar-coordinadores",

    formEliminar: "#form-eliminar-coordinador",
    inputIdEliminar: "#input-id-eliminar",
    avisoBorrado: "#aviso-borrado",

    btnSeleccionarCampania: "#btn-seleccionar-campania",
    modalCampanias: "#modal-campanias",
    btnCerrarSelector: "#cerrar-selector",
    tarjetaCampania: ".campania-card"
});

const CLASES = Object.freeze({
    filaSeleccionada: "seleccionada",
    filaSeleccionadaAlternativa: "fila-seleccionada"
});

let coordinadorSeleccionadoId = null;

document.addEventListener("DOMContentLoaded", inicializarListadoCoordinadores);

function inicializarListadoCoordinadores() {
    registrarEventosFilas();
    registrarEventosBotones();
    registrarEventosModalCampanias();
    actualizarEstadoBotones();
}

function registrarEventosFilas() {
    obtenerFilasCoordinadores().forEach((fila) => {
        fila.addEventListener("click", () => seleccionarFila(fila));

        fila.addEventListener("dblclick", () => {
            seleccionarFila(fila);
            irAEditarCoordinador();
        });
    });
}

function obtenerFilasCoordinadores() {
    return Array.from(document.querySelectorAll(SELECTORES.filaCoordinador));
}

function seleccionarFila(filaSeleccionada) {
    limpiarSeleccionFilas();

    filaSeleccionada.classList.add(CLASES.filaSeleccionada);
    filaSeleccionada.classList.add(CLASES.filaSeleccionadaAlternativa);

    coordinadorSeleccionadoId = filaSeleccionada.dataset.id || null;

    actualizarInputBorrado();
    actualizarEstadoBotones();
    ocultarAvisoBorrado();
}

function limpiarSeleccionFilas() {
    obtenerFilasCoordinadores().forEach((fila) => {
        fila.classList.remove(CLASES.filaSeleccionada);
        fila.classList.remove(CLASES.filaSeleccionadaAlternativa);
    });
}

function registrarEventosBotones() {
    const btnModificar = document.querySelector(SELECTORES.btnModificar);
    const btnExportar = document.querySelector(SELECTORES.btnExportar);
    const formEliminar = document.querySelector(SELECTORES.formEliminar);

    btnModificar?.addEventListener("click", irAEditarCoordinador);
    btnExportar?.addEventListener("click", exportarCoordinadoresCSV);
    formEliminar?.addEventListener("submit", confirmarBorrado);
}

function actualizarEstadoBotones() {
    const haySeleccion = coordinadorSeleccionadoId !== null && coordinadorSeleccionadoId !== "";

    const btnModificar = document.querySelector(SELECTORES.btnModificar);
    const btnEliminar = document.querySelector(SELECTORES.btnEliminar);

    if (btnModificar) {
        btnModificar.disabled = !haySeleccion;
    }

    if (btnEliminar) {
        btnEliminar.disabled = !haySeleccion;
    }
}

function actualizarInputBorrado() {
    const inputIdEliminar = document.querySelector(SELECTORES.inputIdEliminar);

    if (inputIdEliminar) {
        inputIdEliminar.value = coordinadorSeleccionadoId || "";
    }
}

function confirmarBorrado(evento) {
    if (!coordinadorSeleccionadoId) {
        evento.preventDefault();
        mostrarAvisoBorrado();
        return;
    }

    const confirmado = confirm("¿Seguro que desea eliminar este coordinador? Esta acción no se puede deshacer.");

    if (!confirmado) {
        evento.preventDefault();
    }
}

function irAEditarCoordinador() {
    if (!coordinadorSeleccionadoId) {
        return;
    }

    window.location.href = construirUrl(`/coordinadores/editar?id=${encodeURIComponent(coordinadorSeleccionadoId)}`);
}

function registrarEventosModalCampanias() {
    const btnSeleccionarCampania = document.querySelector(SELECTORES.btnSeleccionarCampania);
    const modalCampanias = document.querySelector(SELECTORES.modalCampanias);
    const btnCerrarSelector = document.querySelector(SELECTORES.btnCerrarSelector);
    const tarjetasCampania = document.querySelectorAll(SELECTORES.tarjetaCampania);

    btnSeleccionarCampania?.addEventListener("click", () => {
        if (modalCampanias) {
            modalCampanias.style.display = "flex";
        }
    });

    btnCerrarSelector?.addEventListener("click", () => {
        if (modalCampanias) {
            modalCampanias.style.display = "none";
        }
    });

    modalCampanias?.addEventListener("click", (evento) => {
        if (evento.target === modalCampanias) {
            modalCampanias.style.display = "none";
        }
    });

    tarjetasCampania.forEach((tarjeta) => {
        tarjeta.addEventListener("click", () => {
            const campaniaId = tarjeta.dataset.id;

            if (campaniaId) {
                window.location.href = construirUrl(`/coordinadores?campaniaId=${encodeURIComponent(campaniaId)}`);
            } else {
                window.location.href = construirUrl("/coordinadores");
            }
        });
    });
}

function mostrarAvisoBorrado() {
    const avisoBorrado = document.querySelector(SELECTORES.avisoBorrado);

    if (!avisoBorrado) {
        return;
    }

    avisoBorrado.style.display = "block";

    setTimeout(() => {
        ocultarAvisoBorrado();
    }, 3000);
}

function ocultarAvisoBorrado() {
    const avisoBorrado = document.querySelector(SELECTORES.avisoBorrado);

    if (avisoBorrado) {
        avisoBorrado.style.display = "none";
    }
}

function exportarCoordinadoresCSV() {
    const filasVisibles = obtenerFilasCoordinadores()
        .filter((fila) => fila.style.display !== "none");

    const filasCSV = filasVisibles.map((fila) => {
        const celdas = fila.querySelectorAll("td");

        return [
            limpiarTexto(celdas[0]?.textContent),
            limpiarTexto(celdas[1]?.textContent),
            limpiarTexto(celdas[2]?.textContent),
            limpiarTexto(celdas[3]?.textContent),
            limpiarTexto(celdas[4]?.textContent),
            limpiarTexto(celdas[5]?.textContent)
        ];
    });

    exportarCSV({
        cabeceras: [
            "Coordinador",
            "Campañas",
            "Tiendas",
            "Área asignada",
            "Contacto",
            "Permiso"
        ],
        filas: filasCSV,
        nombreArchivo: `coordinadores-${normalizarNombreFechaArchivo(obtenerFechaHoraActualSinZona())}`
    });
}

function limpiarTexto(texto) {
    return (texto || "")
        .toString()
        .replace(/\s+/g, " ")
        .trim();
}

function normalizarNombreFechaArchivo(fechaHora) {
    return String(fechaHora || "")
        .replaceAll(":", "-")
        .replaceAll(".", "-");
}

function construirUrl(ruta) {
    return `${obtenerContextPath()}${ruta}`;
}

function obtenerContextPath() {
    return document.body?.dataset?.contextPath || "";
}