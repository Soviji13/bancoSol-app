import { obtenerRutaAsset } from "../utils/assetUtils.js";
import { exportarCSV } from "../utils/csvUtils.js";
import { obtenerFechaHoraActualSinZona } from "../utils/fechaUtils.js";

document.addEventListener("DOMContentLoaded", () => {
    const filas = document.querySelectorAll("#tabla-body tr[data-id]");

    const btnModificar = document.querySelector("#btn-modificar-coordinador");
    const formEliminar = document.querySelector("#form-eliminar-coordinador");
    const avisoBorrado = document.querySelector("#aviso-borrado");

    const btnFiltrar = document.querySelector("#filtrar");
    const panelFiltros = document.querySelector("#panel-filtros");
    const btnCerrarFiltros = document.querySelector("#btn-cerrar-filtros");
    const btnAplicarFiltros = document.querySelector("#btn-aplicar-filtros");
    const btnLimpiarFiltros = document.querySelector("#btn-limpiar-filtros");

    const filtroNombre = document.querySelector("#filtro-nombre");
    const filtroCampania = document.querySelector("#filtro-campania");
    const filtroTiendas = document.querySelector("#filtro-tiendas");

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

    if (formEliminar) {
        formEliminar.addEventListener("submit", (event) => {
            if (!idCoordinadorSeleccionado) {
                event.preventDefault();
                mostrarAvisoBorrado();
                return;
            }

            const confirmar = confirm("¿Seguro que desea eliminar este coordinador? Esta acción no se puede deshacer.");

            if (!confirmar) {
                event.preventDefault();
            }
        });
    }

    if (btnFiltrar && panelFiltros) {
        btnFiltrar.addEventListener("click", () => {
            panelFiltros.hidden = false;
        });
    }

    if (btnCerrarFiltros && panelFiltros) {
        btnCerrarFiltros.addEventListener("click", () => {
            panelFiltros.hidden = true;
        });
    }

    if (btnAplicarFiltros) {
        btnAplicarFiltros.addEventListener("click", aplicarFiltrosCombinados);
    }

    if (btnLimpiarFiltros) {
        btnLimpiarFiltros.addEventListener("click", limpiarFiltros);
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
        if (btnFiltrar) {
            btnFiltrar.style.backgroundImage = `url("${obtenerRutaAsset("filter_alt.svg")}")`;
            btnFiltrar.style.backgroundPosition = "center";
            btnFiltrar.style.backgroundRepeat = "no-repeat";
            btnFiltrar.style.backgroundSize = "48%";
        }

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

        if (formEliminar) {
            formEliminar.action = obtenerUrlBorrarCoordinador(idCoordinadorSeleccionado);
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

    function aplicarFiltrosCombinados() {
        const campaniaId = filtroCampania?.value;

        if (campaniaId && !estaEnCampania(campaniaId)) {
            window.location.href = obtenerUrlListadoPorCampania(campaniaId);
            return;
        }

        if (!campaniaId && hayFiltroCampaniaEnUrl()) {
            window.location.href = obtenerUrlListadoCoordinadores();
            return;
        }

        aplicarFiltrosLocales();
    }

    function aplicarFiltrosLocales() {
        const nombreBuscado = normalizar(filtroNombre?.value);
        const tiendasBuscadas = filtroTiendas?.value.trim();

        filas.forEach((fila) => {
            const celdas = fila.querySelectorAll("td");

            const nombreFila = normalizar(celdas[0]?.textContent);
            const tiendasFila = celdas[2]?.textContent.trim();

            const coincideNombre = !nombreBuscado || nombreFila.includes(nombreBuscado);
            const coincideTiendas = !tiendasBuscadas || tiendasFila === tiendasBuscadas;

            fila.style.display = coincideNombre && coincideTiendas
                ? ""
                : "none";
        });
    }

    function limpiarFiltros() {
        if (filtroNombre) {
            filtroNombre.value = "";
        }

        if (filtroCampania) {
            filtroCampania.value = "";
        }

        if (filtroTiendas) {
            filtroTiendas.value = "";
        }

        if (hayFiltroCampaniaEnUrl()) {
            window.location.href = obtenerUrlListadoCoordinadores();
            return;
        }

        filas.forEach((fila) => {
            fila.style.display = "";
        });
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

function obtenerUrlBorrarCoordinador(id) {
    return `${getContextPath()}/coordinadores/borrar?id=${encodeURIComponent(id)}`;
}

function hayFiltroCampaniaEnUrl() {
    const parametros = new URLSearchParams(window.location.search);

    return parametros.has("campaniaId");
}

function estaEnCampania(campaniaId) {
    const parametros = new URLSearchParams(window.location.search);

    return parametros.get("campaniaId") === String(campaniaId);
}

function normalizar(texto) {
    return (texto || "")
        .toString()
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
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