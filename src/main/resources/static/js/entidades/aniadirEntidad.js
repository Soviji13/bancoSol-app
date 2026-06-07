// Script refactorizado de parte de Clientes - Sofía Si Villalba Jiménez
// IA usada solo para entender cómo vincular el JavaScript

const seccionEntidades = document.getElementById("entidades");

if (seccionEntidades) {
    // PARA CERRAR PANEL DE CREAR ENTIDAD ---------------------------------------------------------------------------------------
    const botonCerrarRegistro = document.querySelector ('.btn-cerrar-modal');

    if (botonCerrarRegistro) {

        // Lo pasamos para que si se le da al botón cerrar, se muestre el listado donde estaba la campaña
        const idCampania = seccionEntidades.dataset.idCampaniaActual;

        botonCerrarRegistro.addEventListener('click', () => {
            window.location.href = `http://localhost:8080/entidades/?campaniaId=${idCampania}`;
        })
    }

    const botonCancelarRegistro = document.querySelector ('.btn-cancelar');

    if (botonCancelarRegistro) {

        // Lo pasamos para que si se le da al botón cerrar, se muestre el listado donde estaba la campaña
        const idCampania = seccionEntidades.dataset.idCampaniaActual;

        botonCancelarRegistro.addEventListener('click', () => {
            window.location.href = `http://localhost:8080/entidades/?campaniaId=${idCampania}`;
        })
    }

    // PARA AÑADIR RESPONSABLES -------------------------------------------------------------

    const botonAniadirResponsable = document.getElementById('btn-aniadir-resp');
    const contenedorResponsables = document.getElementById('contenedor-responsables');

    const responsables = [];

    // Creo el índice de cada responsable para luego poder ir iterando sobre él
    let nResponsables = 0;

    if (botonAniadirResponsable && contenedorResponsables) {
        botonAniadirResponsable.addEventListener ('click', function () {
            // Creo el contenido que tendrá el responsable
            const contenido = 
            `
            <div class="responsable-card" id="resp-${nResponsables}">
                <div class="card-header">
                    <h4>Responsable #${nResponsables + 1}</h4>
                    <button type="button" class="btn-eliminar-resp" onclick="this.closest('.responsable-card').remove()">Eliminar</button>
                </div>
                <div class="form-grid-resp">
                    <input type="text" placeholder="Nombre completo" class="r-nombre" required>
                    <input type="email" placeholder="Email" class="r-email" required>
                    <input type="tel" placeholder="Teléfono" class="r-telefono" required>
                    <div class="radio-group">
                        <label><input type="radio" name="esPrincipal" class="r-principal" ${nResponsables === 0 ? 'checked' : ''}> ¿Principal?</label>
                    </div>
                    <hr>
                    <input type="text" placeholder="Username (Email)" class="r-user" required>
                    <input type="password" placeholder="Contraseña" class="r-pass" required>
                </div>
            </div>
            `
            contenedorResponsables.insertAdjacentHTML('beforeend', contenido);

            // Incrementamos el contador
            nResponsables++;
        });
    }

    // PARA QUE SE ACTUALICEN AUTOMÁTICAMENTE LOS INPUTS DE LOCALIZACIÓN -----------------------------------------------------------

    // La IA me ha ayudado a saber cómo arreglar algunos fragmentos de código y plantear mínimamente la solución (en algunas cosas)
    // La lógica la he planteado a partir de una base (cómo mostrar selects), por mi cuenta (fetchs, comparaciones, lógica de filtro...)

    // -- Para Localidad-Zona --

    // Primero accedemos a los inputs de zona y localidad (son select)
    const inputLocalidad = document.getElementById('lista-localidades');
    const inputZona = document.getElementById('lista-zonas');
    const inputCps = document.getElementById('lista-cps');

    async function cargarDatosLocalizacion () {

        // Función que vuelve a dejar todas las zonas o localidades como estaban
        async function resetearInputs (tipoInput) {

            // Resetear todas las zonas geográficas
            if (tipoInput === inputZona) {
                try {
                    // Primero hacemos fetch a las zonas para que se devuelvan todas
                    const dataZonas = await fetch(`/zonas/devolver-json`);
                    const zona = await dataZonas.json();

                    // Mostramos de nuevo todos los inputs de la zona
                    if (zona && zona.length > 0) {
                        inputZona.innerHTML = `
                            <option value="">Zona Geográfica...</option>
                            ${zona.map(z => `<option value="${z.id}" data-zona-selec="${z.id}">${z.nombre}</option>`).join('')}
                        `;

                        inputZona.disabled = false;
                    } else {
                        throw new Error("Error: No se ha encontrado una zona geográfica perteneciente a esa localidad");
                    }
                } catch (error) {
                    console.error(error);
                }
            } else if (tipoInput === inputLocalidad) {
                // Resetear todas las localidades
                try {
                    // Primero hacemos fetch a las localidades para que se devuelvan todas
                    const dataLocalidades = await fetch(`/localidades/devolver-json`);
                    const localidades = await dataLocalidades.json();

                    // Mostramos de nuevo todos los inputs de la zona
                    if (localidades && localidades.length > 0) {
                    // Ayuda de la IA para introducit correctamente los option
                    inputLocalidad.innerHTML = `
                        <option value="">Seleccione localidad...</option>
                        ${localidades.map(l => `<option value="${l.id}">${l.nombre}</option>`).join('')}
                    `; 

                    inputLocalidad.disabled = false;
                    } else {
                        throw new Error("Error: No se ha encontrado una zona geográfica perteneciente a esa localidad");
                    }
                } catch (error) {
                    console.error(error);
                }
            } else if (tipoInput === inputCps) {
                // Resetear todos los CPs y no mostramos los de capital
                try {
                    // Primero hacemos fetch a las localidades para que se devuelvan todas
                    const dataCps = await fetch(`/cps/devolver-json`);
                    const cps = await dataCps.json();

                    // Mostramos de nuevo todos los inputs de la zona
                    if (cps && cps.length > 0) {
                    // Ayuda de la IA para introducir correctamente los option
                    inputCps.innerHTML = `
                        <option value="">Seleccione CP...</option>
                        ${cps.map(c => `<option value="${c.id}">${c.codigo}</option>`).join('')}
                    `; 

                    inputCps.disabled = false;

                    } else {
                        throw new Error("Error: No se ha encontrado una zona geográfica perteneciente a esa localidad");
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }


        // Función que actualiza los inputs de la zona
        async function actualizarInputsZona (idLocalidad) {
            try {

                // Primero hacemos fetch a la zona filtrada por la localidad
                const dataZonas = await fetch(`/zonas/devolver-json?idLocalidad=${idLocalidad}`);
                const zona = await dataZonas.json();

                // Como solo nos devolverá una, entonces, solo mostraremos esa
                if (zona && zona.length > 0) {
                    inputZona.innerHTML = `
                        ${zona.map(z => `<option value="${z.id}">${z.nombre}</option>`).join('')};
                        <option value="">Seleccione otra zona Geográfica...</option>
                    `
                } else {
                    throw new Error("Error: No se ha encontrado una zona geográfica perteneciente a esa localidad");
                }
            } catch (error) {
                console.error(error);
            }
        }

        // Función que actualiza los inputs del CP
        async function actualizarInputsCps (idDistrito) {
            try {
                // Primero hacemos fetch a los cp filtrados por el distrito
                const dataCps = await fetch(`/cps/devolver-json?idDistrito=${idDistrito}`);
                const cps = await dataCps.json();

                // Como solo nos devolverá una, entonces, solo mostraremos esa
                if (cps && cps.length > 0) {
                    inputCps.innerHTML = `
                        ${cps.map(c => `<option value="${c.id}">${c.codigo}</option>`).join('')};
                    `
                } else {
                    throw new Error("Error: No se han encontrado códigos postales asociados a ese distrito");
                }
            } catch (error) {
                console.error(error);
            }
        }

        // Función que actualiza los inputs de la localidad
        async function actualizarInputsLocalidad (idZona) {
            try {

                // Primero hacemos fetch a las localidades filtradas por la zona
                const dataLocs = await fetch(`/localidades/devolver-json?idZona=${idZona}`);
                const localidades = await dataLocs.json();

                // Mostramos las localidades solo de esa zona
                if (localidades && localidades.length > 0) {
                    inputLocalidad.innerHTML = `
                        ${localidades.map(l => `<option value="${l.id}">${l.nombre}</option>`).join('')}
                        <option value="">Seleccione otra localidad...</option>
                    `;
                } else {
                    throw new Error("Error: No se ha encontrado ninguna localidad perteneciente a esa zona geográfica");
                }
            } catch (error) {
                console.error(error);
            }
        }

        // Inicializamos inputs al principio
        inputZona.disabled = true;
        inputLocalidad.disabled = true;
        inputCps.disabled = true;

        await resetearInputs (inputZona);
        await resetearInputs (inputLocalidad);
        await resetearInputs (inputCps);

        // Vemos cual ha cambiado de los dos
        inputLocalidad.addEventListener('change', async function () {
            // Si el valor es por defecto, liberamos todos los posibles inputs
            if (this.value === '') {
                inputZona.innerHTML = `
                        <option value="">Recargando zonas...</option>
                    `;
                inputLocalidad.innerHTML = `
                        <option value="">Recargando localidades...</option>
                    `;
                await resetearInputs (inputZona);
                await resetearInputs (inputLocalidad);
            } else {
                // Si el valor es uno específico
                await actualizarInputsZona (inputLocalidad.value);
            }

            // -- Para localidad EsCapital --

            // Accedemos al checkbox de si es capital
            const checkCapital = document.getElementById('check-es-capital');

            // Comprobamos además, si es capital. Si lo es, ponemos checked capital
            // Lo comprobamos por el ID de málaga en nuestra BBDD -> 79
            if (this.value === '79') {
                if (checkCapital) {
                    checkCapital.checked = true;

                    const selecDistritos = document.getElementById('campo-distrito');
                    if (selecDistritos) {
                        selecDistritos.style.display = 'block';

                        // -- Para Distrito CP --
                        const inputDistrito = document.getElementById('lista-distritos');
                        inputDistrito.addEventListener('change', async function () {
                            if (this.value === '') {
                                // Nos deja libremente seleccionar el que queramos
                                await resetearInputs (inputCps);
                            } else {
                                // Buscamos qué distrito se seleccionó
                                const idDistrito = inputDistrito.value;
                                await actualizarInputsCps (idDistrito);
                            }
                        })
                    }
                }
            } else {
                if (checkCapital) {
                    checkCapital.checked = false;

                    const selecDistritos = document.getElementById('campo-distrito');
                    if (selecDistritos) {
                        selecDistritos.style.display = 'none';
                    }
                }

                // Reseteamos CPS y dejamos nulo el distrito
                inputCps.disabled = true;
                inputCps.innerHTML = `
                        <option value="">Recargando todos los CPs...</option>
                    `;
                await resetearInputs (inputCps);
                const inputDistrito = document.getElementById('lista-distritos');
                inputDistrito.value = "";
            }
        })


        inputZona.addEventListener('change', async function () {
            // Si el valor es por defecto, liberamos todos los posibles inputs
            if (this.value === '') {
                inputZona.innerHTML = `
                        <option value="">Recargando zonas...</option>
                    `;
                inputLocalidad.innerHTML = `
                        <option value="">Recargando localidades...</option>
                    `;
                await resetearInputs (inputLocalidad);
                await resetearInputs (inputZona)
            } else {
                // Si el valor es uno específico
                await actualizarInputsLocalidad (inputZona.value);
            }
        })
    }

    // Si los ha encontrado
    if (inputLocalidad && inputZona && inputCps) {
        cargarDatosLocalizacion();
    }

    // PARA MOSTRAR SOLO LAS CAMPAÑAS DE ESE COORDINADOR ---------------------------------------------

    // Obtenemos el input del coordinador
    const inputCoordinador = document.getElementById('select-coordinadores');

    
    inputCoordinador.addEventListener('change', async function () {
        if (inputCoordinador.value !== '') {
            // Obtenemos el ID del coordinador seleccionado y hacemos una petición para recoger
            // cada campaña del coordinador con las tiendas de la campaña
            try {

                // Obtenemos el input que contiene las campañas y tiendas
                const contCampaniasReg = document.getElementById('check-campanias');

                // Para mostrar o desmostrar las tiendas asociadas a esa campaña
                if (contCampaniasReg) {

                    // Le aplicamos estilos (no influye en la funcionalidad)
                    contCampaniasReg.style.display = 'flex';
                    contCampaniasReg.style.flexDirection = 'column';
                    contCampaniasReg.style.width = '100%';
                    contCampaniasReg.style.gap = '12px';
                    contCampaniasReg.style.boxSizing = 'border-box';

                    // Si se cambia algo del contenedor de campañas
                    contCampaniasReg.addEventListener('change', function(e) {
                        // Vemos si ha sido un check de campaña
                        if (e.target.classList.contains('check-campania-master')) {
                            // Obtenemos el ID de la campaña
                            const campId = e.target.value;
                            // Y sus tiendas
                            const divTiendas = document.getElementById(`tiendas-campania-${campId}`);
                            
                            if (divTiendas) {
                                // Mostramos u ocultamos
                                divTiendas.style.display = e.target.checked ? 'block' : 'none';
                                
                                // Si desmarca, limpiamos los sub-checkboxes
                                if (!e.target.checked) {
                                    divTiendas.querySelectorAll('.check-tienda-sub').forEach(check => check.checked = false);
                                }
                            }
                        }
                    });
                }

                // Mientras se cargan los datos, mostramos un mensaje
                contCampaniasReg.innerHTML = "<p>Esperando datos...</p>"

                // Obtenemos las campañas con las tiendas
                const dataCampaniasCoordinador = await fetch (`http://localhost:8080/entidades/obtener-campanias-json-crear?idCoordinador=${inputCoordinador.value}`);
                const campaniasTiendas = await dataCampaniasCoordinador.json();

                // Mostramos las campañas con las tiendas

                /* (MI CÓDIGO ORIGINAL)
                contCampaniasReg.innerHTML = campaniasTiendas.map(c => `
                    <div class="campania-block-item" style="width: 100%; box-sizing: border-box; background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; display: block;">
                        <label style="font-weight: bold; color: var(--color-principal); cursor: pointer; display: flex; align-items: center; gap: 10px; width: 100%; box-sizing: border-box;">
                            <input type="checkbox" value="${c.id}" class="check-campania-master" onchange="toggleTiendasCampania(this, ${c.id})" style="flex-shrink: 0; width: 16px; height: 16px; margin: 0;">
                            <span style="line-height: 1.4; flex: 1; white-space: normal; text-align: left; word-break: break-word; font-size: 1.05em;">${c.nombre}</span>
                        </label>
                        
                        <div id="tiendas-campania-${c.id}" style="display: none; margin-left: 20px; border-left: 2px solid #cbd5e1; padding-left: 14px; margin-top: 10px; width: calc(100% - 20px); box-sizing: border-box; max-height: 200px; overflow-y: auto;">
                            <span style="font-size: 0.85em; color: #64748b; margin-bottom: 8px; display: block; font-weight: 500; text-align: left;">Selecciona las tiendas asignadas para esta campaña:</span>
                            ${campaniasTiendas[c].map(t => `
                                <label style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 6px; font-size: 0.9em; cursor: pointer; color: #334155; width: 100%; box-sizing: border-box;">
                                    <input type="checkbox" value="${t.id}" class="check-tienda-sub" style="margin-top: 3px; flex-shrink: 0; width: 14px; height: 14px; margin-left: 0;">
                                    <span style="flex: 1; white-space: normal; text-align: left; line-height: 1.3; word-break: break-word;">${t.nombre}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                `).join('');
                */
            
                // Esto sí es mío
                if (campaniasTiendas && campaniasTiendas.length > 0) {
                    // Código refactorizado por la IA
                    contCampaniasReg.innerHTML = campaniasTiendas.map(item => `
                        <div class="campania-block-item" style="width: 100%; box-sizing: border-box; background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; display: block;">
                            <label style="font-weight: bold; color: var(--color-principal); cursor: pointer; display: flex; align-items: center; gap: 10px; width: 100%; box-sizing: border-box;">
                                <input type="checkbox" value="${item.campania.id}" class="check-campania-master" style="flex-shrink: 0; width: 16px; height: 16px; margin: 0;">
                                <span style="line-height: 1.4; flex: 1; white-space: normal; text-align: left; word-break: break-word; font-size: 1.05em;">${item.campania.nombre}</span>
                            </label>
                            
                            <div id="tiendas-campania-${item.campania.id}" style="display: none; margin-left: 20px; border-left: 2px solid #cbd5e1; padding-left: 14px; margin-top: 10px; width: calc(100% - 20px); box-sizing: border-box; max-height: 200px; overflow-y: auto;">
                                <span style="font-size: 0.85em; color: #64748b; margin-bottom: 8px; display: block; font-weight: 500; text-align: left;">Selecciona las tiendas asignadas:</span>
                                ${item.tiendas.map(t => `
                                    <label style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 6px; font-size: 0.9em; cursor: pointer; color: #334155; width: 100%; box-sizing: border-box;">
                                        <input type="checkbox" value="${t.id}" class="check-tienda-sub" style="margin-top: 3px; flex-shrink: 0; width: 14px; height: 14px; margin-left: 0;">
                                        <span style="flex: 1; white-space: normal; text-align: left; line-height: 1.3; word-break: break-word;">${t.nombre}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    `).join('');
                } else {
                    contCampaniasReg.innerHTML = '<p>Este coordinador no tiene campañas asociadas</p>';
                }

            } catch (error) {
                console.error(error);
            }
        }
    })

    // PARA REGISTRAR UNA ENTIDAD COLABORADORA ---------------------------------------------------------


    // Uso de la IA para recoger todos los campos, ya que es una tarea muy automatizable
    const botonGuardarEntidadCreada = document.querySelector ('#btn-guardar-creacion');

    if (botonGuardarEntidadCreada) {
        botonGuardarEntidadCreada.addEventListener('click', (event) => {
            // Prompt que le he dado:
            // Debes recoger todos los campos, no hagas ninguna lógica más
            // No debes hacer redirecciones, urls,... solo debes obtener todos
            // Los campos del formulario, absolutamente todos, y almacenarlos aquí
            // De paso, pon un comentario sobre los campos obtenidos a los que no les haya puesto required

            event.preventDefault();

            // =========================================================
            // 1. INFORMACIÓN GENERAL
            // =========================================================
            const nombre = document.querySelector('input[name="nuevoNombre"]').value;
            const idCoordinador = document.querySelector('select[name="idCoordinador"]').value;
            
            // 📌 CAMPOS NO REQUIRED:
            // estadoActivo [cite: 6] -> Es un checkbox, recogemos su estado checked
            const estadoActivo = document.querySelector('input[name="estadoActivo"]').checked; 
            // observaciones [cite: 7] -> Es un textarea, no tiene required
            const observaciones = document.querySelector('textarea[name="observaciones"]').value; 

            // =========================================================
            // 2. LOCALIZACIÓN
            // =========================================================
            const calle = document.querySelector('input[name="nuevaCalle"]').value;
            const numero = document.querySelector('input[name="nuevoNumero"]').value;
            const localidad = document.querySelector('select[name="nuevaLocalidad"]').value;
            const cp = document.querySelector('select[name="CPNuevo"]').value;
            const zonaGeo = document.querySelector('select[name="zonaGeoNueva"]').value;

            // 📌 CAMPOS NO REQUIRED:
            // esCapital [cite: 18] -> Checkbox deshabilitado, comprobamos si está checked
            const esCapital = document.getElementById('check-es-capital').checked;
            // nombreDistrito [cite: 19] -> Select dinámico que aparece y desaparece
            const idDistrito = document.querySelector('select[name="nombreDistrito"]').value;

            // =========================================================
            // 3. RESPONSABLES (DINÁMICOS)
            // =========================================================
            const responsables = [];
            document.querySelectorAll('.responsable-card').forEach(card => {
                responsables.push({
                    nombre: card.querySelector('.r-nombre').value,
                    email: card.querySelector('.r-email').value,
                    telefono: card.querySelector('.r-telefono').value,
                    user: card.querySelector('.r-user').value,
                    pass: card.querySelector('.r-pass').value,
                    
                    // 📌 CAMPO NO REQUIRED:
                    // El radio button de si es principal no tiene required explícito
                    esPrincipal: card.querySelector('.r-principal').checked 
                });
            });

            // =========================================================
            // 4. CAMPAÑAS Y TIENDAS ASIGNADAS (DINÁMICAS)
            // =========================================================
            // 📌 CAMPOS NO REQUIRED: Ninguno de estos checkboxes dinámicos es obligatorio para crear la entidad
            const campaniasAsignadas = [];
            document.querySelectorAll('.campania-block-item').forEach(block => {
                const checkCampania = block.querySelector('.check-campania-master');
                
                // Si la campaña está marcada, recogemos sus tiendas
                if (checkCampania && checkCampania.checked) {
                    const idsTiendasSeleccionadas = [];
                    block.querySelectorAll('.check-tienda-sub:checked').forEach(checkTienda => {
                        idsTiendasSeleccionadas.push(checkTienda.value);
                    });

                    campaniasAsignadas.push({
                        idCampania: checkCampania.value,
                        idsTiendas: idsTiendasSeleccionadas
                    });
                }
            });

            // =========================================================
            // OBJETO FINAL RECOLECTOR
            // =========================================================
            const entidadCompleta = {
                informacionGeneral: { nombre, estadoActivo, observaciones, idCoordinador },
                localizacion: { calle, numero, localidad, cp, zonaGeo, esCapital, idDistrito },
                responsables: responsables,
                campanias: campaniasAsignadas
            };

            alert("esto va megaguachiii");
        })
    }

}