import { obtenerRutaAsset } from "../utils/assetUtils.js";
import { exportarCSV } from "../utils/csvUtils.js";
import { obtenerFechaHoraActualSinZona } from "../utils/fechaUtils.js";

document.addEventListener("DOMContentLoaded", () => {
    const filas = document.querySelectorAll("#tabla-body tr[data-id]");

    const btnModificar = document.querySelector("#btn-modificar-coordinador");
    const formEliminar = document.querySelector("#form-eliminar-coordinador");
    const btnEliminar = document.querySelector("#btn-eliminar-coordinador");
    const inputIdEliminar = document.querySelector("#input-id-eliminar");
    const avisoBorrado = document.querySelector("#aviso-borrado");

    const btnSeleccionarCampania = document.querySelector("#btn-seleccionar-campania");
    const modalCampanias = document.querySelector("#modal-campanias");
    const btnCerrarSelector = document.querySelector("#cerrar-selector");
    const tarjetasCampania = document.querySelectorAll(".campania-card");

    const btnExportarCSV = document.querySelector(".csv");

    let idCoordinadorSeleccionado = null;

    aplicarIconosDesdeAssets();

    filas.forEach((fila) => {
        fila.addEventListener("click", () => {
            seleccionarFila(fila);
        });

        fila.addEventListener("dblclick", () => {
            const id = fila.dataset.id;

            if (id) {
                window.location.href = obtenerUrlEditarCoordinador(id);
            }
        });
    });

    if (btnEliminar && formEliminar && inputIdEliminar) {
        btnEliminar.addEventListener("click", () => {
            if (!idCoordinadorSeleccionado) {
                mostrarAvisoBorrado();
                return;
            }

            const confirmar = confirm("¿Seguro que desea eliminar este coordinador? Esta acción no se puede deshacer.");

            if (!confirmar) {
                return;
            }

            inputIdEliminar.value = idCoordinadorSeleccionado;
            formEliminar.submit();
        });
    }

    if (btnSeleccionarCampania && modalCampanias) {
        btnSeleccionarCampania.addEventListener("click", () => {
            modalCampanias.style.display = "flex";
        });
    }

    if (btnCerrarSelector && modalCampanias) {
        btnCerrarSelector.addEventListener("click", () => {
            modalCampanias.style.display = "none";
        });
    }

    if (modalCampanias) {
        modalCampanias.addEventListener("click", (event) => {
            if (event.target === modalCampanias) {
                modalCampanias.style.display = "none";
            }
        });
    }

    tarjetasCampania.forEach((tarjeta) => {
        tarjeta.addEventListener("click", () => {
            const campaniaId = tarjeta.dataset.id;

            if (campaniaId) {
                window.location.href = obtenerUrlListadoPorCampania(campaniaId);
            } else {
                window.location.href = obtenerUrlListadoCoordinadores();
            }
        });
    });

    if (btnExportarCSV) {
        btnExportarCSV.addEventListener("click", exportarCoordinadoresCSV);
    }

    function aplicarIconosDesdeAssets() {
        if (btnExportarCSV) {
            btnExportarCSV.style.backgroundImage = `url("${obtenerRutaAsset("file_export.svg")}")`;
            btnExportarCSV.style.backgroundPosition = "center";
            btnExportarCSV.style.backgroundRepeat = "no-repeat";
            btnExportarCSV.style.backgroundSize = "1.6rem 1.6rem";
        }
    }

    function seleccionarFila(filaSeleccionada) {
        filas.forEach((fila) => {
            fila.classList.remove("fila-seleccionada");
        });

        filaSeleccionada.classList.add("fila-seleccionada");

        idCoordinadorSeleccionado = filaSeleccionada.dataset.id;

        if (btnModificar) {
            btnModificar.classList.remove("desactivado");
            btnModificar.classList.add("activado");
            btnModificar.removeAttribute("title");
            btnModificar.href = obtenerUrlEditarCoordinador(idCoordinadorSeleccionado);
        }

        ocultarAvisoBorrado();
    }

    function mostrarAvisoBorrado() {
        if (!avisoBorrado) {
            return;
        }

        avisoBorrado.style.display = "block";

        setTimeout(() => {
            ocultarAvisoBorrado();
        }, 3000);
    }

    function ocultarAvisoBorrado() {
        if (avisoBorrado) {
            avisoBorrado.style.display = "none";
        }
    }

    function exportarCoordinadoresCSV() {
        const filasVisibles = Array.from(document.querySelectorAll("#tabla-body tr[data-id]"))
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
});

function obtenerUrlListadoCoordinadores() {
    return `${getContextPath()}/coordinadores`;
}

function obtenerUrlListadoPorCampania(campaniaId) {
    return `${getContextPath()}/coordinadores?campaniaId=${encodeURIComponent(campaniaId)}`;
}

function obtenerUrlEditarCoordinador(id) {
    return `${getContextPath()}/coordinadores/editar?id=${encodeURIComponent(id)}`;
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

function getContextPath() {
    const contextPath = document.body.dataset.contextPath;

    if (contextPath !== undefined) {
        return contextPath;
    }

    return "";
}