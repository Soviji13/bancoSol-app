document.addEventListener("DOMContentLoaded", function() {
    const cards = document.querySelectorAll('.card-campania');
    const btnModificar = document.getElementById('btn-modificar-campania');
    const btnEliminar = document.getElementById('btn-eliminar-campania');

    const contextPath = document.body.getAttribute('data-context-path') || '';

    let idSeleccionada = null;

    cards.forEach(card => {

        card.addEventListener('click', function() {
            if (this.classList.contains('seleccionada')) {
                this.classList.remove('seleccionada');
                idSeleccionada = null;

                desactivarBoton(btnModificar);
                desactivarBoton(btnEliminar);
            } else {
                cards.forEach(c => c.classList.remove('seleccionada'));

                this.classList.add('seleccionada');
                idSeleccionada = this.getAttribute('data-id');

                activarBoton(btnModificar, contextPath + '/campanias/gestion/modificar?id=' + idSeleccionada);
                activarBoton(btnEliminar, contextPath + '/campanias/eliminar?id=' + idSeleccionada);
            }
        });

        card.addEventListener('dblclick', function() {
            const id = this.getAttribute('data-id');
            // Redirige directamente a la pantalla de detalles (gestion)
            window.location.href = contextPath + '/campanias/gestion?id=' + id;
        });
    });

    function activarBoton(boton, href) {
        boton.classList.remove('desactivado');
        boton.classList.add('activado');
        boton.href = href;
        boton.title = "";
    }

    function desactivarBoton(boton) {
        boton.classList.remove('activado');
        boton.classList.add('desactivado');
        boton.href = "#";
        boton.title = "Debes primero seleccionar una campaña";
    }

    // Confirmación al eliminar
    btnEliminar.addEventListener('click', function(e) {
        if (this.classList.contains('desactivado')) {
            e.preventDefault();
            return;
        }
        if (!confirm('¿Estás seguro de que deseas eliminar esta campaña?')) {
            e.preventDefault();
        }
    });
});