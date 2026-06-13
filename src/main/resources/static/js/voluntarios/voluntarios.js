document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.querySelector('#tabla-voluntarios-body');
    const btnAnadir = document.querySelector('#btn-anadir-voluntario');
    const btnModificar = document.querySelector('#btn-modificar-voluntario');
    const btnEliminar = document.querySelector('#btn-eliminar-voluntario');

    if (tbody) {
        //clic normal pone fila azul
        tbody.addEventListener('click', (event) => {
            const fila = event.target.closest('tr.fila-voluntario');
            if (!fila) return;

            tbody.querySelectorAll('tr.fila-voluntario').forEach(tr => tr.classList.remove('seleccionada'));
            fila.classList.add('seleccionada');

            if (btnModificar) btnModificar.disabled = false;
        });

        //doble clic para abrir detalles
        tbody.addEventListener('dblclick', (event) => {
            const fila = event.target.closest('tr.fila-voluntario');
            if (fila) {
                const idVoluntario = fila.dataset.id;
                window.location.href = `/voluntarios?voluntarioId=${idVoluntario}`;
            }
        });
    }

    if (btnAnadir) {
        btnAnadir.addEventListener('click', () => {
            window.location.href = '/voluntarios/aniadir';
        });
    }

    //logica popover de asignaciones al estilo react!!!!
    const botonesPopover = document.querySelectorAll('.btn-desplegar-asignaciones');
    botonesPopover.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); //evita q se seleccione la fila entera

            //cerramos todos los demas popovers primero
            document.querySelectorAll('.popover-asignaciones').forEach(p => p.classList.add('oculto'));
            document.querySelectorAll('.flecha-desplegable').forEach(f => f.textContent = '▾');

            const id = btn.getAttribute('data-vol-id');
            const popover = document.getElementById(`popover-${id}`);
            const flecha = btn.querySelector('.flecha-desplegable');

            if (popover) {
                if (popover.classList.contains('oculto')) {
                    popover.classList.remove('oculto');
                    flecha.textContent = '▴';
                } else {
                    popover.classList.add('oculto');
                    flecha.textContent = '▾';
                }
            }
        });
    });

    //click fuera cierra los popovers abiertos
    document.addEventListener('click', () => {
        document.querySelectorAll('.popover-asignaciones').forEach(p => p.classList.add('oculto'));
        document.querySelectorAll('.flecha-desplegable').forEach(f => f.textContent = '▾');
    });
});