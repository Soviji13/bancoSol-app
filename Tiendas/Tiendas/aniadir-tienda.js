const API_BASE = "http://localhost:8080/api";

async function fetchSafe(url) {
    try {
        const r = await fetch(url);
        if (!r.ok) return [];
        const d = await r.json();
        return Array.isArray(d) ? d : [];
    } catch (e) { return []; }
}

function toggleLoader(mostrar) {
    let loader = document.getElementById('loading-overlay');
    if (mostrar && !loader) {
        loader = document.createElement('div');
        loader.id = 'loading-overlay';
        loader.className = 'loading-overlay';
        loader.innerHTML = `<div class="spinner"></div><div class="loading-text">Cargando datos... Por favor, espere</div>`;
        document.body.appendChild(loader);
    }
    if (loader) loader.style.display = mostrar ? 'flex' : 'none';
}

document.addEventListener("DOMContentLoaded", async () => {
    // Campos Estructurales
    const inputNombre = document.querySelector("#input-nombre");
    const selectCadena = document.querySelector("#select-cadena");
    const selectResponsable = document.querySelector("#select-responsable");
    const inputCalle = document.querySelector("#input-calle");
    const inputNumero = document.querySelector("#input-numero");
    const selectLocalidad = document.querySelector("#select-localidad");
    const selectCP = document.querySelector("#select-cp");
    const bloqueDistrito = document.querySelector("#bloque-distrito"); 
    const selectDistrito = document.querySelector("#select-distrito");
    const textoZona = document.querySelector("#texto-zona");

    // Nuevos Elementos Reactivos
    const radioParticipadoSi = document.querySelector("#participado-si");
    const radioParticipadoNo = document.querySelector("#participado-no");
    const bloqueCampaniaOrigen = document.querySelector("#bloque-campania-origen");
    const bloqueTiendaExistente = document.querySelector("#bloque-tienda-existente");
    const btnSeleccionarOrigen = document.querySelector("#btn-seleccionar-origen");
    const textoCampaniaOrigen = document.querySelector("#texto-campania-origen");
    const selectTiendaExistente = document.querySelector("#select-tienda-existente");
    const selectCampaniaDestino = document.querySelector("#select-campania-destino");

    // Modal Campañas Origen
    const modalCampanias = document.querySelector("#modal-campanias");
    const btnCerrarCampanias = document.querySelector("#btn-cerrar-campanias");
    const listaCampaniasContenedor = document.querySelector("#lista-campanias");

    const btnConfirmar = document.querySelector("#btn-anadir");
    const btnDescartar = document.querySelector("#btn-cancelar");

    // Modal Responsable
    const modal = document.querySelector("#modal-nuevo-responsable");
    const btnAbrirModal = document.querySelector("#btn-abrir-modal-resp");
    const btnCerrarModal = document.querySelector("#btn-cerrar-modal");
    const btnGuardarResp = document.querySelector("#btn-guardar-responsable");

    let todasLasCampanias = [];
    let idCampaniaOrigenSeleccionada = null;
    let tiendasCampaniaOrigen = [];
    let zonaMap = new Map();
    let localidadMap = new Map();

    toggleLoader(true);

    async function cargarResponsables(idSeleccionar = null) {
        const dataResp = await fetchSafe(`${API_BASE}/responsables-tiendas`);
        if(selectResponsable) {
            selectResponsable.innerHTML = '<option value="" disabled selected>Seleccione...</option>';
            dataResp.forEach(r => {
                const sel = (r.id == idSeleccionar) ? 'selected' : '';
                selectResponsable.innerHTML += `<option value="${r.id}" ${sel}>${r.nombre}</option>`;
            });
        }
    }

    function poblarSelect(select, datos, esCadena = false) {
        if(!select) return;
        select.innerHTML = '<option value="" disabled selected>Seleccione...</option>';
        datos.forEach(d => {
            let texto = d.nombre || d.codigo || d.codigoPostal;
            if (esCadena) texto = `${d.id} / ${texto}`;
            select.innerHTML += `<option value="${d.id}">${texto}</option>`;
        });
    }

    function actualizarVistaLocalidad() {
        if(!selectLocalidad.value) {
            textoZona.textContent = "---"; bloqueDistrito.classList.add("oculto"); return;
        }
        const localidadObj = localidadMap.get(selectLocalidad.value);
        textoZona.textContent = localidadObj && localidadObj.zonaGeoId ? (zonaMap.get(localidadObj.zonaGeoId) || "---") : "---";

        const txtSelect = selectLocalidad.options[selectLocalidad.selectedIndex]?.text.toUpperCase() || "";
        if (txtSelect.includes("MÁLAGA") || txtSelect.includes("MALAGA")) {
            bloqueDistrito.classList.remove("oculto"); selectDistrito.required = !selectDistrito.disabled;
        } else {
            bloqueDistrito.classList.add("oculto"); selectDistrito.required = false; selectDistrito.value = ""; 
        }
    }

    function actualizarComboDestino(idExcluir = null) {
        if(!selectCampaniaDestino) return;
        selectCampaniaDestino.innerHTML = '<option value="" disabled selected>Seleccione...</option>';
        todasLasCampanias.forEach(c => {
            if (c.id !== idExcluir) {
                selectCampaniaDestino.innerHTML += `<option value="${c.id}">${c.nombre} ${c.activa ? '(ACTIVA)' : '(INACTIVA)'}</option>`;
            }
        });
    }

    function bloquearCamposFormulario(bloquear) {
        inputNombre.disabled = bloquear;
        selectCadena.disabled = bloquear;
        document.querySelectorAll('input[name="franquicia"]').forEach(r => r.disabled = bloquear);
        selectLocalidad.disabled = bloquear;
        selectDistrito.disabled = bloquear;
        selectCP.disabled = bloquear;
        inputCalle.disabled = bloquear;
        inputNumero.disabled = bloquear;
        selectResponsable.disabled = bloquear;
        if(btnAbrirModal) btnAbrirModal.style.display = bloquear ? "none" : "block";
    }

    function limpiarFormulario() {
        inputNombre.value = "";
        selectCadena.value = "";
        document.querySelector('#franq-no').checked = true;
        selectLocalidad.value = "";
        selectDistrito.value = "";
        selectCP.value = "";
        inputCalle.value = "";
        inputNumero.value = "";
        selectResponsable.value = "";
        textoZona.textContent = "---";
        bloqueDistrito.classList.add("oculto");
    }

    function alternarModoFormulario() {
        if (radioParticipadoSi.checked) {
            bloqueCampaniaOrigen.classList.remove("oculto");
            bloqueTiendaExistente.classList.remove("oculto");
            if (!selectTiendaExistente.value) {
                bloquearCamposFormulario(true);
            }
        } else {
            bloqueCampaniaOrigen.classList.add("oculto");
            bloqueTiendaExistente.classList.add("oculto");
            idCampaniaOrigenSeleccionada = null;
            textoCampaniaOrigen.textContent = "Ninguna seleccionada";
            selectTiendaExistente.innerHTML = '<option value="" disabled selected>Seleccione una campaña primero...</option>';
            bloquearCamposFormulario(false);
            limpiarFormulario();
            actualizarComboDestino(null);
        }
    }

    try {
        const [dataLoc, dataCp, dataDist, dataCad, dataZonas, dataCamp] = await Promise.all([
            fetchSafe(`${API_BASE}/localidades`), fetchSafe(`${API_BASE}/codigos-postales`),
            fetchSafe(`${API_BASE}/distritos`), fetchSafe(`${API_BASE}/cadenas`),
            fetchSafe(`${API_BASE}/zonas-geograficas`), fetchSafe(`${API_BASE}/campanias`)
        ]);

        todasLasCampanias = dataCamp;
        zonaMap = new Map(dataZonas.map(z => [z.id, z.nombre]));
        localidadMap = new Map(dataLoc.map(l => [l.id.toString(), l]));

        poblarSelect(selectCadena, dataCad, true);
        poblarSelect(selectLocalidad, dataLoc);
        poblarSelect(selectCP, dataCp);
        poblarSelect(selectDistrito, dataDist);
        actualizarComboDestino(null);
        await cargarResponsables();

        selectLocalidad.addEventListener("change", actualizarVistaLocalidad);
        radioParticipadoSi.addEventListener("change", alternarModoFormulario);
        radioParticipadoNo.addEventListener("change", alternarModoFormulario);

    } catch (error) { console.error(error); } finally { toggleLoader(false); }

    // GESTIÓN DEL MODAL DE CAMPAÑA ORIGEN
    if(btnSeleccionarOrigen) {
        btnSeleccionarOrigen.onclick = () => {
            listaCampaniasContenedor.innerHTML = "";
            const campOrdenadas = [...todasLasCampanias].sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio));
            
            campOrdenadas.forEach(c => {
                const tarjeta = document.createElement("div");
                tarjeta.className = `tarjeta-campania ${c.id === idCampaniaOrigenSeleccionada ? 'seleccionada' : ''}`;
                tarjeta.innerHTML = `
                    <div class="tarjeta-titulo">${c.nombre}</div>
                    <div class="tarjeta-detalles">
                        <span>Año fiscal: ${c.anio || 'N/A'}</span>
                    </div>
                    <div class="badges-container">
                        <span class="badge ${c.activa ? 'activa' : 'inactiva'}">${c.activa ? 'ACTIVA' : 'INACTIVA'}</span>
                    </div>
                `;
                
                tarjeta.onclick = async () => {
                    idCampaniaOrigenSeleccionada = c.id;
                    textoCampaniaOrigen.textContent = c.nombre;
                    modalCampanias.classList.add("oculto");

                    // REGLA: Excluimos de inmediato la campaña de origen en el desplegable destino
                    actualizarComboDestino(c.id);

                    toggleLoader(true);
                    try {
                        const urlTiendas = `${API_BASE}/tiendas?campaniaId=${c.id}`;
                        tiendasCampaniaOrigen = await fetchSafe(urlTiendas);
                        
                        selectTiendaExistente.innerHTML = '<option value="" disabled selected>Seleccione...</option>';
                        tiendasCampaniaOrigen.forEach(t => {
                            selectTiendaExistente.innerHTML += `<option value="${t.id}">${t.nombre}</option>`;
                        });
                        bloquearCamposFormulario(true);
                    } catch(err) { console.error(err); } finally { toggleLoader(false); }
                };
                listaCampaniasContenedor.appendChild(tarjeta);
            });
            modalCampanias.classList.remove("oculto");
        };
    }

    if(btnCerrarCampanias) btnCerrarCampanias.onclick = () => modalCampanias.classList.add("oculto");

    // CARGAR TIENDA EXISTENTE EN EL FORMULARIO EN MODO SOLO LECTURA
    selectTiendaExistente.addEventListener("change", () => {
        const tId = selectTiendaExistente.value;
        if(!tId) return;
        const tiendaObj = tiendasCampaniaOrigen.find(item => item.id == tId);
        if(!tiendaObj) return;

        inputNombre.value = tiendaObj.nombre || "";
        if(tiendaObj.cadenaId) selectCadena.value = tiendaObj.cadenaId;
        
        if (tiendaObj.esFranquicia) document.querySelector("#franq-si").checked = true;
        else document.querySelector("#franq-no").checked = true;

        inputCalle.value = tiendaObj.calle || "";
        inputNumero.value = tiendaObj.numero || "";
        if(tiendaObj.localidadId) selectLocalidad.value = tiendaObj.localidadId;
        if(tiendaObj.cpId) selectCP.value = tiendaObj.cpId;
        if(tiendaObj.distritoId) selectDistrito.value = tiendaObj.distritoId;
        if(tiendaObj.responsableTiendaId) selectResponsable.value = tiendaObj.responsableTiendaId;

        actualizarVistaLocalidad();
        bloquearCamposFormulario(true);
    });

    // CONTROL DEL MODAL RESPONSABLE
    btnAbrirModal.onclick = () => modal.classList.remove("oculto");
    btnCerrarModal.onclick = () => modal.classList.add("oculto");

    btnGuardarResp.onclick = async () => {
        const nombre = document.querySelector("#modal-nombre").value;
        const email = document.querySelector("#modal-email").value;
        const telefono = document.querySelector("#modal-telefono").value;
        const contrasenia = document.querySelector("#modal-password").value;

        if(!nombre || !email) { alert("Nombre y Email son obligatorios."); return; }

        toggleLoader(true);
        try {
            const res = await fetch(`${API_BASE}/responsables-tiendas`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ nombre, email, telefono, contrasenia })
            });
            if(res.ok) {
                const nuevoResp = await res.json();
                modal.classList.add("oculto");
                document.querySelector("#modal-nombre").value = "";
                document.querySelector("#modal-email").value = "";
                document.querySelector("#modal-telefono").value = "";
                await cargarResponsables(nuevoResp.id);
            } else { alert("Error al registrar responsable."); }
        } catch (e) { console.error(e); } finally { toggleLoader(false); }
    };

    btnDescartar.onclick = () => window.history.back();

    // CONFIRMACIÓN DE ENVÍO FORMULARIO (POST)
    btnConfirmar.onclick = async (e) => {
        e.preventDefault();

        if(!selectCampaniaDestino.value) {
            alert("Por favor, seleccione la campaña de destino obligatoriamente."); return;
        }

        let dto = {};
        const esExistente = radioParticipadoSi.checked;

        if(esExistente) {
            if(!selectTiendaExistente.value) {
                alert("Por favor, elija la tienda existente a importar."); return;
            }
            dto = {
                tiendaIdExistente: parseInt(selectTiendaExistente.value),
                campaniaIdTarget: parseInt(selectCampaniaDestino.value)
            };
        } else {
            if (!inputNombre.value || !selectCadena.value || !inputCalle.value || !selectResponsable.value) {
                alert("Por favor, rellene todos los campos obligatorios."); return;
            }
            const esFranquicia = document.querySelector('input[name="franquicia"]:checked').value === 'si';
            dto = {
                nombre: inputNombre.value,
                esFranquicia: esFranquicia,
                cadenaId: parseInt(selectCadena.value),
                calle: inputCalle.value,
                numero: parseInt(inputNumero.value) || 0,
                cpId: selectCP.value ? parseInt(selectCP.value) : null,
                localidadId: parseInt(selectLocalidad.value),
                distritoId: selectDistrito.value ? parseInt(selectDistrito.value) : null,
                responsableTiendaId: parseInt(selectResponsable.value),
                campaniaIdTarget: parseInt(selectCampaniaDestino.value)
            };
        }
        
        toggleLoader(true);
        try {
            const res = await fetch(`${API_BASE}/tiendas`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(dto)
            });
            if (res.ok) window.location.href = "../Tiendas/tiendas.html";
            else alert("Error al procesar la tienda. Verifique los datos o si ya fue agregada previamente.");
        } catch(error) { alert("Error de conexión."); } finally { toggleLoader(false); }
    };
});