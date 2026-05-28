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
                window.location.href = `${getContextPath()}/coordinadores/editar/${id}`;
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
        btnAplicarFiltros.addEventListener("click", aplicarFiltros);
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
            const nombreCampania = tarjeta.textContent.trim();

            if (filtroCampania) {
                seleccionarCampaniaEnFiltro(nombreCampania);
                aplicarFiltros();
            }

            if (modalCampanias) {
                modalCampanias.style.display = "none";
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
            btnModificar.href = `${getContextPath()}/coordinadores/editar/${idCoordinadorSeleccionado}`;
        }

        if (formEliminar) {
            formEliminar.action = `${getContextPath()}/coordinadores/eliminar/${idCoordinadorSeleccionado}`;
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

    function aplicarFiltros() {
        const nombreBuscado = normalizar(filtroNombre?.value);
        const campaniaBuscada = obtenerTextoCampaniaSeleccionada();
        const tiendasBuscadas = filtroTiendas?.value.trim();

        filas.forEach((fila) => {
            const celdas = fila.querySelectorAll("td");

            const nombreFila = normalizar(celdas[0]?.textContent);
            const campaniasFila = normalizar(celdas[1]?.textContent);
            const tiendasFila = celdas[2]?.textContent.trim();

            const coincideNombre = !nombreBuscado || nombreFila.includes(nombreBuscado);
            const coincideCampania = !campaniaBuscada || campaniasFila.includes(campaniaBuscada);
            const coincideTiendas = !tiendasBuscadas || tiendasFila === tiendasBuscadas;

            fila.style.display = coincideNombre && coincideCampania && coincideTiendas
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

        filas.forEach((fila) => {
            fila.style.display = "";
        });
    }

    function seleccionarCampaniaEnFiltro(nombreCampania) {
        if (!filtroCampania) {
            return;
        }

        const opciones = Array.from(filtroCampania.options);

        const opcionEncontrada = opciones.find((opcion) => {
            return normalizar(opcion.textContent) === normalizar(nombreCampania);
        });

        if (opcionEncontrada) {
            filtroCampania.value = opcionEncontrada.value;
        }
    }

    function obtenerTextoCampaniaSeleccionada() {
        if (!filtroCampania || !filtroCampania.value) {
            return "";
        }

        const opcionSeleccionada = filtroCampania.options[filtroCampania.selectedIndex];

        return normalizar(opcionSeleccionada?.textContent);
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