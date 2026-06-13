document.addEventListener('DOMContentLoaded', () => {

    const selectLocalidad = document.getElementById('filtro-localidad');
    const bloqueDistrito = document.getElementById('bloque-distrito');
    const selectDistrito = document.getElementById('filtro-distrito');

    // 1. Alternar visualización de Distritos si es Málaga
    const alternarDistrito = () => {
        const opcionSeleccionada = selectLocalidad.options[selectLocalidad.selectedIndex];
        const nombreLocalidad = (opcionSeleccionada ? opcionSeleccionada.dataset.nombre : "").toUpperCase();

        if (nombreLocalidad.includes("MÁLAGA") || nombreLocalidad.includes("MALAGA")) {
            bloqueDistrito.classList.remove("oculto");
        } else {
            bloqueDistrito.classList.add("oculto");
            if(selectDistrito) selectDistrito.value = ""; // Limpiar valor para no mandar ruido al backend
        }
    };

    if (selectLocalidad) {
        selectLocalidad.addEventListener('change', alternarDistrito);
        alternarDistrito(); // Validación inicial por si ya viene filtrado de antes
    }

    // 2. Botón Limpiar filtros (Resetea la URL enviando solo la campaña actual)
    const btnLimpiar = document.getElementById('btn-limpiar-filtros');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const campaniaId = urlParams.get('campaniaId') || "";
            window.location.href = `/tiendas?campaniaId=${campaniaId}&verFiltros=true`;
        });
    }

    // 3. Botón Cerrar X (Esconde el panel lateral volviendo al listado limpio)
    const btnCerrar = document.getElementById('btn-cerrar-filtros');
    if (btnCerrar) {
        btnCerrar.addEventListener('click', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const campaniaId = urlParams.get('campaniaId') || "";
            window.location.href = `/tiendas?campaniaId=${campaniaId}`;
        });
    }
});