// Script refactorizado de parte de Clientes - Sofía Si Villalba Jiménez
// IA usada solo para entender cómo vincular el JavaScript

// Intentamos a acceder al apartado de entidades
const seccionEntidades = document.getElementById("entidades");

if (seccionEntidades) {

    // PARA MOSTRAR LAS DEMÁS TIENDAS ---------------------------------------------------------------------

    // Se obtienen los botones de desplegar tienda
    const botonesDesplegar = seccionEntidades.querySelectorAll(".boton-desplegar-tiendas-js");

    // Recorremos cada uno
    botonesDesplegar.forEach(boton => {
        boton.addEventListener("click", function() {

            // Se busca la columna anterior a su fila correspondiente
            const celdaTiendas = this.previousElementSibling;
            if (!celdaTiendas) return;

            // Se alternan los estilos entre "solo una tienda" o "todas las tiendas"
            const resumen = celdaTiendas.querySelector('.tiendas-resumen');
            const listaCompleta = celdaTiendas.querySelector('.tiendas-lista-completa');

            if (resumen && listaCompleta) {
                const estaOculta = listaCompleta.style.display === 'none';

                // Alternamos la visibilidad
                listaCompleta.style.display = estaOculta ? 'block' : 'none';
                resumen.style.display = estaOculta ? 'none' : 'block';

                // Rotamos la flechita con CSS
                if (estaOculta) {
                    this.classList.add('rotado');
                } else {
                    this.classList.remove('rotado');
                }
            }
        });
    });

    // PARA MOSTRAR EL MENÚ LATERAL ----------------------------------------------------------------------

    const tabla = document.querySelector('table');
    const tbody = document.querySelector('#tabla-body');

    // Si se hace doble click al tbody
    tbody.addEventListener('dblclick', (event) => {

        // Buscamos la fila (tr) más cercana al elemento donde se hizo clic
        const fila = event.target.closest('tr');

        // Refactorización JSP, queremos acceder a un enlace para que el controlador lo gestione
        if (fila) {
            // Obtenemos la campaña actual y el colaborador seleccionado 
            const idCampania = seccionEntidades.dataset.idCampaniaActual;
            const idEntidad = fila.dataset.idEntidadDetalle;

            window.location.href = `http://localhost:8080/entidades?campaniaId=${idCampania}&entidadId=${idEntidad}`;
        }
        
        // Comentado JS de parte de clientes
        // Si la fila existe, tiene un ID asignado y NO estamos en modo borrado, abrimos su vista detallada
        //abrirDetalleColaborador(fila.dataset.id);
    });

    // PARA QUITAR MENÚ LATERAL
    const botonCerrar = document.getElementById('btn-cerrar-panel');

    if (botonCerrar) {

        const idCampania = seccionEntidades.dataset.idCampaniaActual;

        botonCerrar.addEventListener('click', () => {
        window.location.href = `http://localhost:8080/entidades?campaniaId=${idCampania}`;
    })
    }
}