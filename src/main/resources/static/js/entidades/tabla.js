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

    // PARA QUITAR MENÚ LATERAL -----------------------------------------------------------------------------------------
    const botonCerrarLateral = document.getElementById ('btn-cerrar-panel');

    if (botonCerrarLateral) {

        const idCampania = seccionEntidades.dataset.idCampaniaActual;

        botonCerrarLateral.addEventListener('click', () => {
            window.location.href = `http://localhost:8080/entidades?campaniaId=${idCampania}`;
        })
    }

    // PARA ACTIVAR MODO MODIFICACIÓN DE ENTIDAD -------------------------------------------------------

    // Función obtenida del JS de Clientes
    // Función para activar/desactivar el modo edición
    function toggleModoEdicion() {

        // Obtenemos del documento el formulario de edición
        const form = document.getElementById('form-edicion-lateral');
        
        // Si nos encontrábamos en modo lectura, pasamos a modo edición
        if (form.classList.contains('modo-lectura')) {
            form.classList.replace('modo-lectura', 'modo-edicion');
            
            // Ponemos todos los inputs, textArea y select activos
            form.querySelectorAll('input, textarea, select').forEach(el => {
                if (el.name !== "nueva-tienda") {
                    el.removeAttribute('readonly');
                    el.removeAttribute('disabled');
                }
            });

            // Mostramos los botones para poder actualizar la información, añadir un nuevo responsable de entidad, hacemos focus automático a edit-calle
            document.getElementById('btn-guardar-container').style.display = 'block';
            document.getElementById('btn-add-contacto-container').style.display = 'block';
            document.getElementById('edit-calle').focus();
        } 
        // Si nos encontrábamos en modo edición, pasamos a modo lectura
        else 
        {
            // Pasamos a modo lectura y cerramos el modo edición
            form.classList.replace('modo-edicion', 'modo-lectura');
            
            // Volvemos a reestablecer el modo de lectura únicamente en los inputs del form y en los textarea y selects
            form.querySelectorAll('input, textarea, select').forEach(el => {
                if (el.tagName === 'SELECT' || el.type === 'checkbox' || el.type === 'radio') {
                    el.setAttribute('disabled', 'true');
                } else {
                    el.setAttribute('readonly', 'true');
                }
            });

            // Ocultamos el botón de guardar y el de añadir nuevo responsable
            document.getElementById('btn-guardar-container').style.display = 'none';
            document.getElementById('btn-add-contacto-container').style.display = 'none';
            
            // Cargamos los datos del formulario
            //cargarDatosFormulario();
        }
    }


    const botonModificar = document.getElementById('btn-modificar-colaborador');

    if (botonModificar && seccionEntidades.dataset.modificable === "true") {
        botonModificar.addEventListener ('click', function () {
            // Obtenemos todos los campos que estaban readOnly y required y los habilitamos
            // Además de poder añadir responsables
            toggleModoEdicion();
        });
    }


    // PARA ABRIR PANEL DE CREAR ENTIDAD -------------------------------------------------------------------------------
    const botonAbrirRegistro = document.getElementById ('btn-abrir-registro');

    if (botonAbrirRegistro) {

        // Lo pasamos para que si se le da al botón cerrar, se muestre el listado donde estaba la campaña
        const idCampania = seccionEntidades.dataset.idCampaniaActual;

        botonAbrirRegistro.addEventListener('click', () => {
            window.location.href = `http://localhost:8080/entidades/crear?campaniaId=${idCampania}`;
        })
    }
}