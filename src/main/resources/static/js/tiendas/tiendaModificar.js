document.addEventListener("DOMContentLoaded", () => {
    // 1. Lógica para bloquear/desbloquear Distrito según la localidad seleccionada
    const selectLocalidad = document.getElementById("select-localidad");
    const selectDistrito = document.getElementById("select-distrito");

    const comprobarLocalidad = () => {
        const opcionSeleccionada = selectLocalidad.options[selectLocalidad.selectedIndex];
        const nombreLocalidad = (opcionSeleccionada ? opcionSeleccionada.dataset.nombre : "").toUpperCase();

        if (nombreLocalidad.includes("MÁLAGA") || nombreLocalidad.includes("MALAGA")) {
            selectDistrito.disabled = false;
            selectDistrito.style.backgroundColor = "white";
        } else {
            selectDistrito.disabled = true;
            selectDistrito.value = "";
            selectDistrito.style.backgroundColor = "#eee";
        }
    };

    if(selectLocalidad) {
        selectLocalidad.addEventListener("change", comprobarLocalidad);
        comprobarLocalidad();
    }

    // 2. Lógica para el botón X de cerrar (Vuelve a detalles)
    const btnCerrar = document.getElementById('btn-cerrar-panel');
    if(btnCerrar) {
        btnCerrar.addEventListener('click', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const campaniaId = urlParams.get('campaniaId');
            const tiendaId = document.querySelector('input[name="tiendaId"]').value;
            // Devolvemos al usuario a la vista de solo lectura
            window.location.href = `/tiendas?campaniaId=${campaniaId}&tiendaId=${tiendaId}`;
        });
    }
});