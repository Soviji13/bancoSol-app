// Script refactorizado de parte de Clientes - Sofía Si Villalba Jiménez
// IA usada solo para entender cómo vincular el JavaScript y donde se comente más

// Intentamos a acceder al apartado de entidades
const seccionEntidades = document.getElementById("entidades");

if (seccionEntidades) {

    // PARA MOSTRAR LAS DEMÁS TIENDAS ---------------------------------------------------------------------

    // Se obtienen los botones de desplegar tienda
    const botonesDesplegar = document.querySelectorAll(".boton-desplegar-tiendas-js");

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

    // Función auxiliar: desplegar las tiendas de la campaña - Refactorización total de la IA de añadir entidad
    const contCampaniasPanel = document.getElementById('check-campanias-panel');

    if (contCampaniasPanel) {
        contCampaniasPanel.addEventListener('change', function(e) {
            // Verificamos si lo que cambió fue un checkbox de "campaña maestra"
            if (e.target.classList.contains('check-campania-master')) {
                const campId = e.target.value;
                const divTiendas = document.getElementById(`tiendas-campania-${campId}`);
                
                if (divTiendas) {
                    // Si se marca, mostramos el div de tiendas. Si se desmarca, lo ocultamos.
                    divTiendas.style.display = e.target.checked ? 'block' : 'none';
                    
                    // Limpieza de datos: si desmarca la campaña, desmarcamos también todas sus tiendas hijas
                    // para que no se queden "guardadas" por error si vuelve a marcar la campaña después
                    if (!e.target.checked) {
                        divTiendas.querySelectorAll('.check-tienda-sub').forEach(check => {
                            check.checked = false;
                        });
                    }
                }
            }
        });
    }

    // Función auxiliar: Mostrar inputs relacionados con ubicación (refactorización de añadir entidad por la IA casi al completo)
    let localizacionCargada = false;

    async function cargarDatosLocalizacionEdicion() {
        if (localizacionCargada) return;

        const inputLocalidad = document.getElementById('edit-localidad');
        const inputZona = document.getElementById('edit-zona');
        const inputCps = document.getElementById('edit-cp');
        const checkCapital = document.getElementById('check-es-capital-panel');
        const selecDistritos = document.getElementById('campo-distrito-panel');
        const inputDistrito = document.getElementById('edit-distrito');

        // Guardamos los valores de texto originales (esto en añadir no hace falta, pero en edición sí para no perderlos)
        const idLocalidadInicial = inputLocalidad.value;
        const idZonaInicial = inputZona.value;
        const idCpInicial = inputCps.value;
        const idDistritoInicial = inputDistrito ? inputDistrito.value : "";

        // Para las funciones auxiliares
        const textoLocalidadActual = inputLocalidad.options[0]?.text.trim();
        const textoZonaActual = inputZona.options[0]?.text.trim();
        const textoCpActual = inputCps.options[0]?.text.trim();

        // Solo cargamos los catálogos completos si el campo está vacío o corrupto, 
        // si ya traen datos de BBDD, los dejamos intactos para que no parpadee la UI
        if (!idZonaInicial) {
            await resetearInputs(inputZona);
        } else {
            await actualizarInputsLocalidad(idZonaInicial);
            inputLocalidad.value = idLocalidadInicial;
        }

        if (!idLocalidadInicial) {
            await resetearInputs(inputLocalidad);
        } else {
            await actualizarInputsZona(idLocalidadInicial);
            inputZona.value = idZonaInicial;
        }
        
        if (checkCapital && checkCapital.checked) {
            if (selecDistritos) selecDistritos.style.display = 'flex';
            
            if (idDistritoInicial !== "") {
                await actualizarInputsCps(idDistritoInicial);
                inputCps.value = idCpInicial; 
            }
        } else {
            if (selecDistritos) selecDistritos.style.display = 'none';
            if (!idCpInicial) {
                await resetearInputs(inputCps);
            }
        }

        // 1. FUNCIONES AUXILIARES (Iguales que en añadirEntidad.js)
        async function resetearInputs(tipoInput) {
            if (tipoInput === inputZona) {
                try {
                    const dataZonas = await fetch(`/zonas/devolver-json`);
                    const zona = await dataZonas.json();
                    if (zona && zona.length > 0) {
                        inputZona.innerHTML = `<option value="">Zona Geográfica...</option>` + 
                            zona.map(z => `<option value="${z.id}" ${z.nombre === textoZonaActual ? 'selected' : ''}>${z.nombre}</option>`).join('');
                    }
                } catch (error) { console.error(error); }
            } else if (tipoInput === inputLocalidad) {
                try {
                    const dataLocalidades = await fetch(`/localidades/devolver-json`);
                    const localidades = await dataLocalidades.json();
                    if (localidades && localidades.length > 0) {
                        inputLocalidad.innerHTML = `<option value="">Seleccione localidad...</option>` + 
                            localidades.map(l => `<option value="${l.id}" ${l.nombre === textoLocalidadActual ? 'selected' : ''}>${l.nombre}</option>`).join('');
                    }
                } catch (error) { console.error(error); }
            } else if (tipoInput === inputCps) {
                try {
                    const dataCps = await fetch(`/cps/devolver-json`);
                    const cps = await dataCps.json();
                    if (cps && cps.length > 0) {
                        inputCps.innerHTML = `<option value="">Seleccione CP...</option>` + 
                            cps.map(c => `<option value="${c.id}" ${String(c.codigo) === String(textoCpActual) ? 'selected' : ''}>${c.codigo}</option>`).join('');
                    }
                } catch (error) { console.error(error); }
            }
        }

        async function actualizarInputsZona(idLocalidad) {
            try {
                const dataZonas = await fetch(`/zonas/devolver-json?idLocalidad=${idLocalidad}`);
                const zona = await dataZonas.json();
                if (zona && zona.length > 0) {
                    inputZona.innerHTML = `<option value="">Seleccione una zona Geográfica...</option>` + 
                        zona.map(z => `<option value="${z.id}" selected>${z.nombre}</option>`).join('');
                }
            } catch (error) { console.error(error); }
        }

        async function actualizarInputsCps(idDistrito) {
            try {
                const dataCps = await fetch(`/cps/devolver-json?idDistrito=${idDistrito}`);
                const cps = await dataCps.json();
                if (cps && cps.length > 0) {
                    inputCps.innerHTML = `<option value="">Seleccione CP...</option>` + 
                        cps.map(c => `<option value="${c.id}" ${String(c.codigo) === String(textoCpActual) ? 'selected' : ''}>${c.codigo}</option>`).join('');
                }
            } catch (error) { console.error(error); }
        }

        async function actualizarInputsLocalidad(idZona) {
            try {
                const dataLocs = await fetch(`/localidades/devolver-json?idZona=${idZona}`);
                const localidades = await dataLocs.json();
                if (localidades && localidades.length > 0) {
                    inputLocalidad.innerHTML = `<option value="" selected>Seleccione una localidad...</option>` + 
                        localidades.map(l => `<option value="${l.id}">${l.nombre}</option>`).join('');
                }
            } catch (error) { console.error(error); }
        }

        // 2. INICIALIZACIÓN DE LOS INPUTS AL ABRIR EDICIÓN
        await resetearInputs(inputZona);
        await resetearInputs(inputLocalidad);
        
        // Comprobamos la lógica de los CPs y la capital al cargar la ventana
        if (checkCapital && checkCapital.checked) {
            if (selecDistritos) selecDistritos.style.display = 'flex';
            // Si es capital y tiene un distrito guardado, cargamos solo los CPs de ese distrito
            if (inputDistrito && inputDistrito.value !== "") {
                await actualizarInputsCps(inputDistrito.value);
            } else {
                await resetearInputs(inputCps);
            }
        } else {
            // Si no es capital, cargamos todos los CPs del tirón
            if (selecDistritos) selecDistritos.style.display = 'none';
            await resetearInputs(inputCps);
        }

        // 3. LISTENERS (CLAVADOS A AÑADIR ENTIDAD)
        
        // -- Cambio en Localidad --
        inputLocalidad.addEventListener('change', async function () {
            if (this.value === '') {
                inputZona.innerHTML = `<option value="">Recargando zonas...</option>`;
                inputLocalidad.innerHTML = `<option value="">Recargando localidades...</option>`;
                await resetearInputs(inputZona);
                await resetearInputs(inputLocalidad);
            } else {
                await actualizarInputsZona(this.value);
            }

            // Lógica de Capital (ID de Málaga = 79)
            if (this.value === '79') {
                if (checkCapital) checkCapital.checked = true;
                if (selecDistritos) selecDistritos.style.display = 'flex'; 
                // Esperamos a que elija distrito para cargar CPs
                inputCps.innerHTML = `<option value="">Seleccione un distrito primero...</option>`;
            } else {
                // Si no es capital
                if (checkCapital) checkCapital.checked = false;
                if (selecDistritos) selecDistritos.style.display = 'none';
                if (inputDistrito) inputDistrito.value = "";
                
                inputCps.innerHTML = `<option value="">Recargando todos los CPs...</option>`;
                await resetearInputs(inputCps);
            }
        });

        // -- Cambio en Distrito -- (ESTO FALTABA PARA QUE FILTRARA LOS CP)
        if (inputDistrito) {
            inputDistrito.addEventListener('change', async function () {
                if (this.value === '') {
                    // Si deja el distrito en blanco, reseteamos todos los CPs
                    await resetearInputs(inputCps);
                } else {
                    // Filtramos CPs por el distrito exacto seleccionado
                    await actualizarInputsCps(this.value);
                }
            });
        }

        // -- Cambio en Zona --
        inputZona.addEventListener('change', async function () {
            if (this.value === '') {
                inputZona.innerHTML = `<option value="">Recargando zonas...</option>`;
                inputLocalidad.innerHTML = `<option value="">Recargando localidades...</option>`;
                await resetearInputs(inputLocalidad);
                await resetearInputs(inputZona);
            } else {
                await actualizarInputsLocalidad(this.value);
            }

            if (checkCapital) checkCapital.checked = false;
            if (selecDistritos) selecDistritos.style.display = 'none';
            if (inputDistrito) inputDistrito.value = "";

            inputCps.innerHTML = `<option value="">Recargando todos los CPs...</option>`;
            await resetearInputs(inputCps);
        });

        localizacionCargada = true;
    }

    // Funciones auxiliares: Añadir bloque de responsable
    function aniadirBloqueResponsable () {

        // Obtenemos el la tabla de contactos dinámica
        const tablaContactos = document.getElementById('tabla-contactos-dinamica');

        // Obtenemos el número de contactos header que hay
        let nContactos = document.querySelectorAll('.contacto-header').length;

        // Bloque a añadir
        let bloqueC = `
            <tr class="contacto-header">
                <td rowspan="5" style="width: 90px; text-align: center; vertical-align: top; background-color: #f8fafc;">
                    <strong style="color: #1e3a8a;">Contacto ${nContactos}</strong><br>
                    <label style="cursor: pointer; display: inline-block; margin-top: 8px;">
                        <span style="color: #dc2626; font-size: 12px; display: block; margin-bottom: 2px;">Principal</span>
                        <input type="radio" name="nuevo-contacto-principal" class="check-inline r-principal">
                    </label>
                    <button type="button" class="btn-eliminar-contacto" style="color:red; margin-top:10px; cursor:pointer; width: 100%; border: 1px solid red; background: none; font-size: 12px;"><b>Borrar<b></button>
                </td>
                <td><span class="etiqueta-tabla">Nombre</span> <input type="text" class="input-linea r-nombre" name="nuevo-contacto-principal"></td>
            </tr>
            <tr><td><span class="etiqueta-tabla">Email</span> <input type="email" class="input-linea r-email"></td></tr>
            <tr><td><span class="etiqueta-tabla">Telef.</span> <input type="tel" class="input-linea r-telefono"></td></tr>
            <tr><td><span class="etiqueta-tabla">Usuario</span> <input type="text" class="input-linea r-user" placeholder="Login (email)" required></td></tr>
            <tr><td><span class="etiqueta-tabla">Contraseña</span> <input type="password" class="input-linea r-pass" placeholder="Contraseña" required></td></tr>
            `;

        tablaContactos.insertAdjacentHTML('beforeend', bloqueC);
        
    }

    // Función auxiliar: Eliminar contacto - Obtenida de la IA para que el display de la tabla se mantenga
    // Usamos delegación de eventos en el contenedor dinámico de los contactos
    const tablaContactos = document.getElementById('tabla-contactos-dinamica');

    let responsablesEliminadosIds = [];

    if (tablaContactos) {
        tablaContactos.addEventListener('click', function (event) {
            
            // 1. Detectamos si el usuario ha pulsado cualquiera de los dos botones de borrar
            const botonBorrarNuevo = event.target.closest('.btn-eliminar-contacto');
            const botonBorrarExistente = event.target.closest('.eliminar-responsable-js');
            
            if (botonBorrarNuevo || botonBorrarExistente) {
                const botonActivo = botonBorrarNuevo || botonBorrarExistente;
                
                // 2. Localizamos la fila donde se hizo clic
                const filaOrigen = botonActivo.closest('tr');
                
                // 3. Subimos por el DOM hasta encontrar la fila 'contacto-header' de este bloque específico
                let trPrincipal = filaOrigen.classList.contains('contacto-header') 
                    ? filaOrigen 
                    : encontrarFilaPrincipalAnterior(filaOrigen);

                if (trPrincipal) {
                    // 4. Averiguamos cuántas filas reales tiene este bloque leyendo su rowspan actual
                    const celdaPrincipal = trPrincipal.querySelector('td');
                    const filasABorrar = celdaPrincipal ? parseInt(celdaPrincipal.rowSpan) : 4;

                    // 5. [Opcional] Si es un contacto de la Base de Datos, capturamos su ID para el backend
                    // ... dentro de tu listener de borrar, paso 5:
                    if (botonBorrarExistente) {
                        // Buscamos el input oculto .r-id que pusimos en el mismo bloque del responsable
                        const filaBoton = botonBorrarExistente.closest('tr');
                        const inputId = filaBoton.querySelector('.r-id') || trPrincipal.querySelector('.r-id');
                        
                        if (inputId && inputId.value) {
                            const idResponsable = parseInt(inputId.value);
                            responsablesEliminadosIds.push(idResponsable); // Guardado limpio
                            console.log("Responsables marcados para eliminar:", responsablesEliminadosIds);
                        } else if (botonBorrarExistente.dataset.id) {
                            // Por si acaso mantienes el data-id en el botón
                            responsablesEliminadosIds.push(parseInt(botonBorrarExistente.dataset.id));
                        }
                    }

                    // 6. BORRADO EN CADENA BLINDADO: Guardamos las referencias antes de destruir los nodos
                    let filaActual = trPrincipal;
                    for (let i = 0; i < filasABorrar; i++) {
                        if (!filaActual) break;
                        let siguienteFila = filaActual.nextElementSibling;
                        filaActual.remove(); // Eliminamos la fila de la tabla de forma segura
                        filaActual = siguienteFila;
                    }
                    
                    // 7. REINDEXACIÓN AUTOMÁTICA: Recalculamos los índices visuales (Contacto 0, Contacto 1...)
                    reindexarCabecerasContactos();
                }
            }
        });
    }

    // Función de apoyo para rastrear el DOM hacia arriba hasta encontrar el inicio del bloque del contacto
    function encontrarFilaPrincipalAnterior(fila) {
        let aux = fila;
        while (aux && !aux.classList.contains('contacto-header')) {
            aux = aux.previousElementSibling;
        }
        return aux;
    }

    // Función cosmética para ordenar los títulos de los contactos supervivientes
    function reindexarCabecerasContactos() {
        const cabeceras = document.querySelectorAll('#tabla-contactos-dinamica .contacto-header');
        cabeceras.forEach((cabecera, index) => {
            const strong = cabecera.querySelector('td strong');
            if (strong) {
                strong.textContent = `Contacto ${index}`;
            }
        });
    }
    

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
                // Menos tienda, esCapital y participa en última campaña
                if (el.name !== "nueva-tienda" 
                    && el.name !== "esCapital"
                    && el.name !== "estadoActivo"
                ) {
                    el.removeAttribute('readonly');
                    el.removeAttribute('disabled');
                }
            });

            // Cambiamos el texto del botón
            if (botonModificar) botonModificar.textContent = "Cancelar edición";

            // Mostramos los botones para poder actualizar la información, añadir un nuevo responsable de entidad, hacemos focus automático a edit-calle
            document.getElementById('btn-guardar-container').style.display = 'block';
            document.querySelectorAll('.js-logica-td-form').forEach(celda => {
                celda.rowSpan = '4';
            });

            document.querySelectorAll('.eliminar-responsable-js').forEach(boton => {
                boton.style.display = 'table-row';
            });

            document.getElementById('edit-calle').focus();

            // Activamos también los botones de ir añadiendo responsable de entidad
            const botonAniadirResponsable = document.getElementById('btn-add-contacto');
            botonAniadirResponsable.style.display = 'block';

            botonAniadirResponsable.addEventListener('click', aniadirBloqueResponsable);

            // Cargamos los datos de localización
            cargarDatosLocalizacionEdicion();
        } 
        // Si nos encontrábamos en modo edición, pasamos a modo lectura
        else 
        {
            // Pasamos a modo lectura y cerramos el modo edición
            form.classList.replace('modo-edicion', 'modo-lectura');

            // Devolvemos el texto del botón a como estaba
            if (botonModificar) botonModificar.textContent = "Modificar colaborador";
            
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
            document.querySelectorAll('.js-logica-td-form').forEach(celda => {
                celda.rowSpan = '3';
            });

            document.querySelectorAll('.eliminar-responsable-js').forEach(boton => {
                boton.style.display = 'none';
            });

            // Nos volvemos a donde estábamos (sin editar)
            const idCampania = seccionEntidades.dataset.idCampaniaActual;
            const idEntidad = parseInt(document.getElementById('detalle-id-display').textContent.trim());

            window.location.href = `http://localhost:8080/entidades?campaniaId=${idCampania}&entidadId=${idEntidad}`;
            
            // Cargamos los datos del formulario
            //cargarDatosFormulario();
        }
    }

    // BOTON DE MODIFICAR -------------------------------------------------------------------------

    const botonEliminar = document.getElementById('btn-eliminar-colaborador');
    const botonModificar = document.getElementById('btn-modificar-colaborador');

    if (botonModificar && seccionEntidades.dataset.modificable === "true") {
        botonModificar.addEventListener ('click', function () {
            // Obtenemos todos los campos que estaban readOnly y required y los habilitamos
            // Además de poder añadir responsables
            toggleModoEdicion();
        });
    }

    // PARA ELIMINAR ENTIDAD ---------------------------------------------------------------------------------------

    if (botonEliminar && seccionEntidades.dataset.modificable === "true") {
        botonEliminar.addEventListener ('click', function () {
            const idCampania = seccionEntidades.dataset.idCampaniaActual;
            const idEntidad = parseInt(document.getElementById('detalle-id-display').textContent.trim());
            window.location.href = `http://localhost:8080/entidades/eliminar?entidadId=${idEntidad}&campaniaId=${idCampania}`;
        });
    }

    // PARA GUARDAR LOS DATOS TRAS MODIFICAR ----------------------------------------------------------------------
    // La recogida de datos me la ha hecho la IA, ya que es un proceso muy mecánico y repetible

    const formEdicion = document.getElementById('form-edicion-lateral');

    if (formEdicion) {
        formEdicion.addEventListener('submit', function (event) {
            event.preventDefault();

            let textoErrores = "";

            // =========================================================
            // 1. INFORMACIÓN GENERAL (Solo lo modificable)
            // =========================================================
            const idEntidad = parseInt(document.getElementById('detalle-id-display').textContent.trim());
            const nombre = document.getElementById('titulo-colaborador').value;
            const observaciones = document.getElementById('edit-observaciones').value;
            const estaActiva = document.querySelector('input[name="estaActiva"]').checked;

            if (!nombre) textoErrores += "\n- Información General: Nombre de la entidad";

            // =========================================================
            // 2. LOCALIZACIÓN
            // =========================================================
            const calle = document.getElementById('edit-calle').value;
            const numero = document.getElementById('edit-numero').value ? parseInt(document.getElementById('edit-numero').value) : null;
            const localidad = document.getElementById('edit-localidad').value;
            const cp = document.getElementById('edit-cp').value;
            
            // Aunque el check de capital está deshabilitado visualmente, lo necesitamos para saber si enviar el distrito
            const esCapital = document.getElementById('check-es-capital-panel').checked;
            const distritoValue = document.getElementById('edit-distrito').value;
            const idDistrito = (esCapital && distritoValue !== "") ? parseInt(distritoValue) : null;

            if (!calle) textoErrores += "\n- Localización: Calle/Av";
            if (!numero) textoErrores += "\n- Localización: Número";
            if (!localidad) textoErrores += "\n- Localización: Localidad";
            if (!cp) textoErrores += "\n- Localización: Código Postal";

        // =========================================================
        // 3. RESPONSABLES (Nuevos y Actualizados separados)
        // =========================================================
            const responsablesNuevos = [];
            const responsablesActualizados = [];
            const bloquesResponsables = document.querySelectorAll('#tabla-contactos-dinamica .contacto-header');
        
            bloquesResponsables.forEach((headerTr, index) => {
                const filasBloque = [headerTr];
                let actual = headerTr.nextElementSibling;
                
                for (let i = 0; i < 5; i++) {
                    if (actual && !actual.classList.contains('contacto-header')) {
                        filasBloque.push(actual);
                        actual = actual.nextElementSibling;
                    }
                }

                let rNombre = "", rEmail = "", rTelefono = "", rUser = null, rPass = null;
                let rPrincipal = false;
                let idResponsable = null;

                filasBloque.forEach(tr => {
                    if (tr.querySelector('.r-nombre')) rNombre = tr.querySelector('.r-nombre').value;
                    if (tr.querySelector('.r-principal')) rPrincipal = tr.querySelector('.r-principal').checked;
                    if (tr.querySelector('.r-email')) rEmail = tr.querySelector('.r-email').value;
                    if (tr.querySelector('.r-telefono')) rTelefono = tr.querySelector('.r-telefono').value;
                    if (tr.querySelector('.r-user')) rUser = tr.querySelector('.r-user').value;
                    if (tr.querySelector('.r-pass')) rPass = tr.querySelector('.r-pass').value;
                    
                    // Buscamos el input oculto que hemos puesto en el JSP
                    const inputId = tr.querySelector('.r-id');
                    if (inputId && inputId.value) idResponsable = parseInt(inputId.value);
                });

                let errResp = 0;
                if (!rNombre) { errResp++; textoErrores += `\n- Contacto ${index}: Nombre`; }
                if (!rEmail && !rTelefono) { errResp++; textoErrores += `\n- Contacto ${index}: Email o Teléfono`; }
                
                if (idResponsable) {
                    // ES UN RESPONSABLE ACTUALIZADO (Ya existía en BD)
                    if (errResp === 0) {
                        responsablesActualizados.push({
                            id: idResponsable, 
                            nombre: rNombre,
                            email: rEmail,
                            telefono: rTelefono,
                            esPrincipal: rPrincipal
                        });
                    }
                } else {
                    // ES UN RESPONSABLE NUEVO
                    if (!rUser) { errResp++; textoErrores += `\n- Contacto ${index} (Nuevo): Username`; }
                    if (!rPass) { errResp++; textoErrores += `\n- Contacto ${index} (Nuevo): Contraseña`; }
                    
                    if (errResp === 0) {
                        responsablesNuevos.push({
                            nombre: rNombre,
                            email: rEmail,
                            telefono: rTelefono,
                            user: rUser,
                            pass: rPass,
                            esPrincipal: rPrincipal
                        });
                    }
                }
            });

            // Validamos que la suma de los que se actualizan y los que se crean sea al menos 1
            if ((responsablesActualizados.length + responsablesNuevos.length) < 1) {
                textoErrores += "\n- Responsables: Debe quedar al menos un responsable.";
            }

            // =========================================================
            // 4. CAMPAÑAS Y TIENDAS ASIGNADAS
            // =========================================================
            const campaniasAsignadas = [];
            document.querySelectorAll('#check-campanias-panel .campania-panel-item').forEach(block => {
                const checkCampania = block.querySelector('.check-campania-master');
                
                if (checkCampania && checkCampania.checked) {
                    const idsTiendasSeleccionadas = [];
                    block.querySelectorAll('.check-tienda-sub:checked').forEach(checkTienda => {
                        const idTienda = parseInt(checkTienda.value.split('-')[0]);
                        idsTiendasSeleccionadas.push(idTienda);
                    });

                    if (idsTiendasSeleccionadas.length > 0) {
                        campaniasAsignadas.push({
                            idCampania: parseInt(checkCampania.value),
                            idsTiendas: idsTiendasSeleccionadas
                        });
                    }
                }
            });

            if (campaniasAsignadas.length < 1) textoErrores += "\n- Campañas: Selecciona al menos una campaña y asigna una tienda.";

            // =========================================================
            // OBJETO FINAL A ENVIAR AL BACKEND
            // =========================================================
            const entidadEditada = {
                idEntidad: idEntidad,
                informacionGeneral: {
                    nombre: nombre,
                    observaciones: observaciones.trim(),
                    estadoActivo: estaActiva
                },
                localizacion: {
                    calle: calle,
                    numero: numero,
                    localidad: parseInt(localidad),
                    cp: parseInt(cp),
                    esCapital: esCapital,
                    idDistrito: idDistrito
                },
                responsables: {
                    nuevos: responsablesNuevos,
                    actualizados: responsablesActualizados,
                    idsEliminados: responsablesEliminadosIds // Tu variable encapsulada
                },
                campanias: campaniasAsignadas
            };

            // Para enviar los datos y que se actualice la entidad (reusado de crear)
            async function enviarDatosControlador (entidadCompleta) {
                const url = 'http://localhost:8080/entidades/actualizar';

                try {
                    const resp = await fetch (url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(entidadCompleta)
                    });

                    if (resp.ok) {

                        // Volvemos a las campañas
                        const idCampania = seccionEntidades.dataset.idCampaniaActual;
                        window.location.href = `/entidades/?campaniaId=${idCampania}`;

                    } else {
                        // Obtenemos los errores del servidor
                        const datosError = await resp.json();
                        const mensajeBack = datosError.message || "El servidor ha rechazado los datos.";
                        mostrarError(`Error en el servidor: ${mensajeBack}`);
                    }
                } catch (error) {
                    console.error(error);
                }
            }

            // EVALUACIÓN DE ERRORES Y ALERTA
            const error = document.getElementById ('modal-error-aniadir');
            const mensajeError = document.getElementById ('mensaje-error-aniadir');

            // Obtenemos también el botón para cerrar el mensaje
            const cerrarError = document.getElementById ('cerrar-fallo-aniadir');
            cerrarError.addEventListener ('click', () => {
                error.style.display = 'none';
            })

            function mostrarError (mensaje) {
                error.style.display = 'block';

                // Para que detecte los \n
                mensajeError.style.whiteSpace = 'pre-line';
                mensajeError.textContent = `${mensaje}`;
            }

            // Si todo está bien
            if (!textoErrores) {    
                enviarDatosControlador (entidadEditada);
            } else {
                mostrarError(`Errores al enviar datos, faltan: ${textoErrores}`);
            }
        });
    }

    // PARA ABRIR PANEL DE CREAR ENTIDAD (0 IA) -------------------------------------------------------------------------------
    const botonAbrirRegistro = document.getElementById ('btn-abrir-registro');

    if (botonAbrirRegistro) {

        // Lo pasamos para que si se le da al botón cerrar, se muestre el listado donde estaba la campaña
        const idCampania = seccionEntidades.dataset.idCampaniaActual;

        botonAbrirRegistro.addEventListener('click', () => {
            window.location.href = `http://localhost:8080/entidades/crear?campaniaId=${idCampania}`;
        })
    }

    // PARA AÑADIR FILTROS (0 IA) ----------------------------------------------------------------------------------------------
    
    const botonFiltros = document.getElementById('filtrar');

    if (botonFiltros) {
        const idCampania = seccionEntidades.dataset.idCampaniaActual;

        botonFiltros.addEventListener('click', () => {
            window.location.href = `http://localhost:8080/entidades/?filtros=${true}&campaniaId=${idCampania}`;
        })
    }

    // PARA EL MENÚ FILTROS ------------------------------------------------------
    // IA para recoger datos y enviarlos
    const botonQuitarFiltros = document.getElementById('btn-cerrar-filtros');
    
    if (botonQuitarFiltros) {
        botonQuitarFiltros.addEventListener('click', async function () {
            const idCampania = seccionEntidades.dataset.idCampaniaActual;
            window.location.href = `http://localhost:8080/entidades/?campaniaId=${idCampania}`;
        });

        // Cargamos todas las localidades y auto-seleccionamos si venimos de un filtrado
        const filtroLocalidad = document.getElementById('filtro-localidad');
        filtroLocalidad.setAttribute('readonly', 'true');
        filtroLocalidad.setAttribute('disabled', 'true');
        try {
            const dataLocalidades = await fetch(`/localidades/devolver-json`);
            const localidades = await dataLocalidades.json();
            const idGuardado = filtroLocalidad.getAttribute('data-seleccionada'); // Leemos del JSP

            if (localidades && localidades.length > 0) {
                filtroLocalidad.innerHTML = `<option value="">Todas las localidades</option>` + 
                localidades.map(l => {
                    const isSelected = (idGuardado && parseInt(idGuardado) === l.id) ? 'selected' : '';
                    return `<option value="${l.id}" ${isSelected}>${l.nombre}</option>`;
                }).join('');
            }

            filtroLocalidad.removeAttribute('readonly');
            filtroLocalidad.removeAttribute('disabled');

        } catch (error) { console.error(error); }

        // Recogemos todos los filtros cuando se pulsa Aplicar
        const btnAplicar = document.getElementById('btn-aplicar-filtros');

        if (btnAplicar) {
            btnAplicar.addEventListener('click', function () {
                const tiendaInput = document.getElementById('filtro-tienda').value.trim(); 
                const localidadInput = document.getElementById('filtro-localidad').value; 
                const mostrarTodasCampanias = document.getElementById('filtro-todas-campanias').checked; 
                const soloCapital = document.getElementById('filtro-capital').checked; 
                const colaboradorActivo = document.getElementById('filtro-activa').checked; 
                const idCampania = seccionEntidades.dataset.idCampaniaActual;

                // Construcción limpia y segura de URL (¡Arreglo de tu bug anterior!)
                let url = new URL('http://localhost:8080/entidades/filtrar');
                if (tiendaInput) url.searchParams.append('nombreTienda', tiendaInput);
                if (localidadInput) url.searchParams.append('localidadId', parseInt(localidadInput));
                if (mostrarTodasCampanias) url.searchParams.append('todasCampanias', true);
                if (soloCapital) url.searchParams.append('esCapital', true);
                if (colaboradorActivo) url.searchParams.append('activo', true);
                
                url.searchParams.append('campaniaId', idCampania);

                window.location.href = url.toString();
            });
        }

        // Para limpiar los inputs visualmente sin recargar
        const btnLimpiar = document.getElementById('btn-limpiar-filtros');
        if (btnLimpiar) {
            btnLimpiar.addEventListener('click', function () {
                document.getElementById('filtro-tienda').value = "";
                document.getElementById('filtro-localidad').value = "";
                document.getElementById('filtro-todas-campanias').checked = false;
                document.getElementById('filtro-capital').checked = false;
                document.getElementById('filtro-activa').checked = false;
            });
        }
    }

    // PARA EXPORTAR A CSV ----------------------------------------------------------------------
    // Refactorizado de la versión de clientes para adaptarse al renderizado de JSTL de Sofía, refactorización total por IA
    const btnCsv = document.querySelector('.csv'); //
        
    if (btnCsv) {
        btnCsv.style.cursor = 'pointer';
        btnCsv.title = 'Descargar lista actual de colaboradores en CSV';
            
        btnCsv.addEventListener('click', () => {
            // Obtenemos todas las filas reales de datos de la tabla, ignorando las filas separadoras de campaña
            const filasTabla = document.querySelectorAll('#tabla-body tr:not(.fila-seccion-campania)'); //
            
            if (filasTabla.length > 0 && !filasTabla[0].querySelector('td[colspan="6"]')) {
                // Si hay datos reales expuestos en la UI, disparamos la exportación leyendo el DOM
                exportarTablaACsv(filasTabla);
            } else {
                alert("No hay datos cargados en la tabla para exportar. Por favor, asegúrate de que la tabla muestra colaboradores.");
            }
        });
    }

    function exportarTablaACsv(filasHTML) {
        // 1. Definimos las cabeceras exactas basadas en las columnas visuales de tu tabla.jsp
        const cabeceras = [
            "Colaborador", 
            "Domicilio", 
            "Colabora en", 
            "Contacto Principal", 
            "Tienda(s) asignada(s)"
        ];

        // Función defensiva para sanear las cadenas: duplica comillas, limpia espacios y quita saltos de línea molestos
        const limpiar = (texto) => {
            if (!texto) return '""';
            // Limpiamos los espacios en blanco colgados y tabulaciones del JSP
            let limpio = texto.textContent.replace(/\s+/g, ' ').trim();
            // Duplicamos comillas internas para no romper el formato estándar CSV
            return `"${limpio.replace(/"/g, '""')}"`;
        };

        // 2. Mapeamos las filas del HTML leyendo celda por celda
        const filasCsv = Array.from(filasHTML).map(tr => {
            const celdas = tr.querySelectorAll('td'); //
            
            // Recogemos los valores en base al orden de las columnas de tu tabla
            const colaborador = limpiar(celdas[0]);
            const domicilio = limpiar(celdas[1]);
            const colaboraEn = limpiar(celdas[2]);
            const contacto = limpiar(celdas[3]);
            
            // Para las tiendas, leemos el contenedor del resumen (celdas[4])
            // Si tiene el componente "tiendas-resumen", extraemos su texto; si no, el texto plano de la celda
            const divResumen = celdas[4].querySelector('.tiendas-resumen'); //
            const tiendas = divResumen ? limpiar(divResumen) : limpiar(celdas[4]);

            return [colaborador, domicilio, colaboraEn, contacto, tiendas].join(",");
        });

        // 3. Crear el contenido final con el BOM (Byte Order Mark) para soporte de la 'ñ' y tildes en Excel
        const BOM = "\uFEFF";
        const contenidoFinal = BOM + cabeceras.join(",") + "\n" + filasCsv.join("\n");

        // 4. Fabricamos el archivo de descarga binario de tipo UTF-8 sin código obsoleto
        const blobFinal = new Blob([contenidoFinal], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blobFinal);
            
        const link = document.createElement("a");
        const fecha = new Date().toISOString().slice(0, 10);
            
        link.setAttribute("href", url);
        link.setAttribute("download", `bancosol_colaboradores_${fecha}.csv`);
        link.style.visibility = 'hidden';
            
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
            
        URL.revokeObjectURL(url);
    }
}