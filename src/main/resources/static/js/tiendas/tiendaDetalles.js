document.addEventListener("DOMContentLoaded", () => {
    // BOTÓN DE LA "X" PARA CERRAR EL MENÚ LATERAL
    const botonCerrarLateral = document.getElementById('btn-cerrar-panel');

    if (botonCerrarLateral) {
        botonCerrarLateral.addEventListener('click', () => {
            const urlParams = new URLSearchParams(window.location.search);
            let campaniaId = urlParams.get('campaniaId');

            if (!campaniaId) {
                const divContexto = document.getElementById("datos-contexto");
                campaniaId = divContexto ? divContexto.dataset.campaniaId : "";
            }

            // Recargamos quitando el id de la tienda para que se cierre el panel
            window.location.href = `/tiendas?campaniaId=${campaniaId}`;
        });
    }
});