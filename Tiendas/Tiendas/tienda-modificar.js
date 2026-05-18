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
    const tienda = JSON.parse(sessionStorage.getItem("tiendaSeleccionada"));
    if (!tienda) return;

    toggleLoader(true);

    const inputNombre = document.querySelector("#input-nombre");
    const inputPuntuacion = document.querySelector("#input-puntuacion");
    const detalleId = document.querySelector("#detalle-id-tienda");
    const inputCalle = document.querySelector("#input-calle");
    const inputNumero = document.querySelector("#input-numero");
    const inputFranquicia = document.querySelector("#input-franquicia");
    const selectLocalidad = document.querySelector("#select-localidad");
    const selectCP = document.querySelector("#select-cp");
    const selectDistrito = document.querySelector("#select-distrito");
    const selectCadena = document.querySelector("#select-cadena");
    const selectResponsable = document.querySelector("#select-responsable");

    const textoDistrito = document.querySelector("#texto-distrito");
    const textoZona = document.querySelector("#texto-zona");

    const modal = document.querySelector("#modal-nuevo-responsable");
    const btnAbrirModal = document.querySelector("#btn-abrir-modal-resp");
    const btnCerrarModal = document.querySelector("#btn-cerrar-modal");
    const btnGuardarResp = document.querySelector("#btn-guardar-responsable");

    if(inputNombre) inputNombre.value = tienda.nombre || "";
    if(inputPuntuacion) inputPuntuacion.value = tienda.puntosRecogida ?? "0";
    if(detalleId) detalleId.textContent = tienda.id;
    if(inputCalle) inputCalle.value = tienda.calle || "";
    if(inputNumero) inputNumero.value = tienda.numero || "";
    if(inputFranquicia) inputFranquicia.checked = tienda.esFranquicia;

    document.querySelector("#label-participa").textContent = `Participa en la campaña actual "${tienda.campaniaActivaGlobalNombre}":`;
    document.querySelector("#label-turnos").textContent = `Turnos de la campaña "${tienda.campaniaActualNombre}"`;
    document.querySelector("#texto-participa").textContent = tienda.participaActivaGlobal ? "Sí" : "No";

    // CORRECCIÓN: Ahora busca correctamente al iframe hermano "tiendas.html" para simular el descarte de cambios legítimo
    const btnCerrarPanel = document.querySelector("#btn-cerrar-panel");
    if (btnCerrarPanel) {
        btnCerrarPanel.onclick = () => {
            let tiendasWindow = null;
            if (window.parent) {
                const iframes = window.parent.document.querySelectorAll("iframe");
                for (let i = 0; i < iframes.length; i++) {
                    try {
                        if (iframes[i].contentWindow && typeof iframes[i].contentWindow.cargarDatosCompletos === 'function') {
                            tiendasWindow = iframes[i].contentWindow;
                            break;
                        }
                    } catch (e) {}
                }
            }
            if (tiendasWindow) {
                const btnDescartar = tiendasWindow.document.querySelector("#btn-descartar");
                if (btnDescartar) btnDescartar.click();
            }
        };
    }

    async function cargarResponsablesCombo(idSeleccionar) {
        const [dataResp, todasTiendas] = await Promise.all([
            fetchSafe(`${API_BASE}/responsables-tiendas`),
            fetchSafe(`${API_BASE}/tiendas`)
        ]);

        const idsEnUso = todasTiendas
            .filter(t => t.id != tienda.id && t.responsableTiendaId != null)
            .map(t => t.responsableTiendaId);

        if(selectResponsable) {
            selectResponsable.innerHTML = '<option value="">Seleccione...</option>';
            dataResp.forEach(r => {
                if (r.id == idSeleccionar || !idsEnUso.includes(r.id)) {
                    const sel = (r.id == idSeleccionar) ? 'selected' : '';
                    selectResponsable.innerHTML += `<option value="${r.id}" ${sel}>${r.nombre}</option>`;
                }
            });
        }
    }

    try {
        const [dataLoc, dataCp, dataDist, dataCad, dataDistCp, dataZonas, dataEnt, dataTT, dataTurnos, dataVols, dataRespEnt] = await Promise.all([
            fetchSafe(`${API_BASE}/localidades`), fetchSafe(`${API_BASE}/codigos-postales`),
            fetchSafe(`${API_BASE}/distritos`), fetchSafe(`${API_BASE}/cadenas`),
            fetchSafe(`${API_BASE}/distritos-cp`), fetchSafe(`${API_BASE}/zonas-geograficas`),
            fetchSafe(`${API_BASE}/entidades`), 
            fetchSafe(`${API_BASE}/tiendas-turnos`), fetchSafe(`${API_BASE}/turnos`),
            fetchSafe(`${API_BASE}/voluntarios`), fetchSafe(`${API_BASE}/responsables-entidades`)
        ]);

        const zonaMap = new Map(dataZonas.map(z => [z.id, z.nombre]));
        const localidadMap = new Map(dataLoc.map(l => [l.id.toString(), l]));
        const cpToDistrito = {};
        dataDistCp.forEach(dcp => { cpToDistrito[dcp.cpId] = dcp.distritoId.toString(); });

        function actualizarTextoZona() {
            if(!selectLocalidad) return;
            const idLocalidad = selectLocalidad.value;
            const localidadObj = localidadMap.get(idLocalidad);
            if(textoZona) textoZona.textContent = localidadObj && localidadObj.zonaGeoId ? (zonaMap.get(localidadObj.zonaGeoId) || "---") : "---";
        }

        function actualizarVistaDistrito() {
            if(!selectLocalidad || !selectDistrito || !textoDistrito) return;
            const txtSelect = selectLocalidad.options[selectLocalidad.selectedIndex]?.text.toUpperCase() || "";
            if (txtSelect.includes("MÁLAGA") || txtSelect.includes("MALAGA")) {
                selectDistrito.classList.remove("oculto"); 
                textoDistrito.classList.add("oculto");
            } else {
                selectDistrito.classList.add("oculto"); 
                textoDistrito.classList.remove("oculto"); 
                selectDistrito.value = ""; 
            }
        }

        function poblarSelect(select, datos, idActual, esCadena = false) {
            if(!select) return;
            select.innerHTML = '<option value="">Seleccione...</option>';
            datos.forEach(d => {
                let texto = d.nombre || d.codigo || d.codigoPostal;
                if (esCadena) texto = `${d.id} / ${texto}`;
                const isSelected = (d.id == idActual) ? 'selected' : '';
                select.innerHTML += `<option value="${d.id}" ${isSelected}>${texto}</option>`;
            });
        }

        poblarSelect(selectLocalidad, dataLoc, tienda.localidadId);
        poblarSelect(selectCP, dataCp, tienda.cpId);
        poblarSelect(selectDistrito, dataDist, tienda.distritoId);
        poblarSelect(selectCadena, dataCad, tienda.cadenaIdReal, true);
        await cargarResponsablesCombo(tienda.responsableTiendaId);

        const idEntidadBuscada = (tienda.idsEntidades && tienda.idsEntidades.length > 0) ? tienda.idsEntidades[0] : null;
        if (idEntidadBuscada) {
            const entidad = dataEnt.find(e => e.id == idEntidadBuscada);
            document.querySelector("#texto-entidad").textContent = entidad ? entidad.nombre : "Entidad Desconocida";
        } else {
            document.querySelector("#texto-entidad").textContent = "Sin entidad colaboradora";
        }

        if(selectCP) {
            selectCP.addEventListener("change", () => {
                const cpVal = selectCP.value;
                if (cpToDistrito[cpVal]) {
                    const idMalaga = dataLoc.find(l => l.nombre.toUpperCase().includes("MALAGA"))?.id.toString();
                    if (idMalaga) selectLocalidad.value = idMalaga;
                    actualizarVistaDistrito(); selectDistrito.value = cpToDistrito[cpVal];
                }
                actualizarTextoZona();
            });
        }

        if(selectLocalidad) {
            selectLocalidad.addEventListener("change", () => {
                actualizarVistaDistrito(); actualizarTextoZona();
            });
        }

        actualizarVistaDistrito();
        actualizarTextoZona();

        const tbodyTurnos = document.querySelector("#tabla-turnos-body");
        tbodyTurnos.innerHTML = "";
        
        if (dataTT.length === 0 || dataTurnos.length === 0) {
             tbodyTurnos.innerHTML = '<tr><td colspan="2" style="text-align:center;" class="texto-no-editable">No hay turnos registrados en esta campaña</td></tr>';
        } else {
            const misTT = dataTT.filter(tt => tt.tiendaId == tienda.id);
            const turnosValidos = [];

            misTT.forEach(tt => {
                const tId = tt.turnoId;
                const vId = tt.voluntarioId;
                const turnoObj = dataTurnos.find(t => t.id == tId);
                const volObj = dataVols.find(v => v.id == vId);

                if (turnoObj && turnoObj.campaniaId == tienda.campaniaActualId) {
                    turnosValidos.push({ tt, turnoObj, volObj });
                }
            });

            if (turnosValidos.length === 0) {
                 tbodyTurnos.innerHTML = '<tr><td colspan="2" style="text-align:center;" class="texto-no-editable">No hay turnos registrados en esta campaña</td></tr>';
            } else {
                 turnosValidos.forEach((item, index) => {
                     let nombreEntidad = "Entidad Desconocida";
                     let nombreVoluntario = `Voluntario #${item.volObj ? item.volObj.id : '?'}`;

                     if (item.volObj) {
                         const idResp = item.volObj.responsableId;
                         const respObj = dataRespEnt.find(re => re.id == idResp);
                         if (respObj) {
                             const entId = respObj.entidadId;
                             const entObj = dataEnt.find(e => e.id == entId);
                             if (entObj) nombreEntidad = entObj.nombre;
                         }
                     }

                     const dia = item.turnoObj.dia || 'Día sin asignar';
                     let horario = item.turnoObj.franjaHoraria || 'Horario sin asignar';

                     if (item.volObj && item.volObj.horasSueltas) {
                         const hInicio = item.volObj.horaComienzo;
                         const hFin = item.volObj.horaFinal;
                         
                         if (hInicio && hFin) {
                             const strInicio = hInicio.length > 5 ? hInicio.substring(0, 5) : hInicio;
                             const strFin = hFin.length > 5 ? hFin.substring(0, 5) : hFin;
                             horario = `${strInicio} - ${strFin}`;
                         }
                     }

                     const tr = document.createElement("tr");
                     tr.innerHTML = `
                        <td class="turno-id texto-no-editable" style="font-weight: bold; width: 80px; vertical-align: top; text-align: left; padding: 6px 0;">Turno ${index + 1}</td>
                        <td class="texto-no-editable" style="vertical-align: top; text-align: left; padding: 6px 0; line-height: 1.4; color: #718096;">${nombreEntidad}, ${nombreVoluntario}, ${dia}, (${horario})</td>
                     `;
                     tbodyTurnos.appendChild(tr);
                 });
            }
        }

    } catch (e) { console.error(e); } finally { toggleLoader(false); }

    if(btnAbrirModal) btnAbrirModal.onclick = () => modal.classList.remove("oculto");
    if(btnCerrarModal) btnCerrarModal.onclick = () => modal.classList.add("oculto");
    
    if(btnGuardarResp) {
        btnGuardarResp.onclick = async () => {
            const nombre = document.querySelector("#modal-nombre").value;
            const email = document.querySelector("#modal-email").value;
            const telefono = document.querySelector("#modal-telefono").value;
            const contrasenia = document.querySelector("#modal-password").value;

            if(!nombre || !email) { alert("Nombre y Email obligatorios."); return; }
            toggleLoader(true);
            try {
                const res = await fetch(`${API_BASE}/responsables-tiendas`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ nombre, email, telefono, contrasenia })
                });
                if(res.ok) {
                    const nuevo = await res.json();
                    modal.classList.add("oculto");
                    document.querySelector("#modal-nombre").value = "";
                    document.querySelector("#modal-email").value = "";
                    document.querySelector("#modal-telefono").value = "";
                    await cargarResponsablesCombo(nuevo.id);
                }
            } catch(err) { console.error(err); } finally { toggleLoader(false); }
        };
    }

    window.guardarCambiosDesdeIframe = async () => {
        const dto = {
            id: tienda.id,
            nombre: inputNombre.value,
            puntosRecogida: parseInt(inputPuntuacion.value) || 0,
            esFranquicia: inputFranquicia.checked,
            cadenaId: selectCadena.value ? parseInt(selectCadena.value) : null,
            direccionId: tienda.direccionId,
            calle: inputCalle.value,
            numero: parseInt(inputNumero.value) || 0,
            localidadId: selectLocalidad.value ? parseInt(selectLocalidad.value) : null,
            cpId: selectCP.value ? parseInt(selectCP.value) : null,
            distritoId: selectDistrito.value ? parseInt(selectDistrito.value) : null,
            responsableTiendaId: selectResponsable.value ? parseInt(selectResponsable.value) : null
        };
        
        toggleLoader(true);
        try {
            const res = await fetch(`${API_BASE}/tiendas/${tienda.id}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(dto)
            });
            if (res.ok) {
                alert("¡Tienda actualizada con éxito!");
                const nuevoDtoDTO = {
                    ...tienda,
                    nombre: inputNombre.value,
                    puntosRecogida: parseInt(inputPuntuacion.value) || 0,
                    esFranquicia: inputFranquicia.checked,
                    calle: inputCalle.value,
                    numero: inputNumero.value,
                    localidadId: selectLocalidad.value ? parseInt(selectLocalidad.value) : null,
                    cpId: selectCP.value ? parseInt(selectCP.value) : null,
                    distritoId: selectDistrito.value ? parseInt(selectDistrito.value) : null,
                    responsableTiendaId: selectResponsable.value ? parseInt(selectResponsable.value) : null,
                    nombreResponsableTienda: selectResponsable.options[selectResponsable.selectedIndex]?.text || "Sin responsable asignado",
                    nombreLocalidad: selectLocalidad.options[selectLocalidad.selectedIndex]?.text || "---"
                };
                sessionStorage.setItem("tiendaSeleccionada", JSON.stringify(nuevoDtoDTO));

                let tiendasWindow = null;
                if (window.parent) {
                    const iframes = window.parent.document.querySelectorAll("iframe");
                    for (let i = 0; i < iframes.length; i++) {
                        try {
                            if (iframes[i].contentWindow && typeof iframes[i].contentWindow.cargarDatosCompletos === 'function') {
                                tiendasWindow = iframes[i].contentWindow; break;
                            }
                        } catch (e) {}
                    }
                }
                if (tiendasWindow) {
                    await tiendasWindow.cargarDatosCompletos();
                    const btnDescartarHermano = tiendasWindow.document.querySelector("#btn-descartar");
                    if (btnDescartarHermano) { btnDescartarHermano.click(); return; }
                }
                window.location.href = "tienda-seleccionada.html";
            } else {
                alert("Error al actualizar. Verifique los datos o si el responsable ya está asignado a otra tienda.");
            }
        } catch(e) { alert("Error de conexión."); } finally { toggleLoader(false); }
    };
});