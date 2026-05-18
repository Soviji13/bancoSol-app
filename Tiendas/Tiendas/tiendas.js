const API_BASE = "http://localhost:8080/api";

const btnModificar = document.querySelector("#btn-modificar");
const btnEliminar = document.querySelector("#btn-eliminar");
const btnDescartar = document.querySelector("#btn-descartar");
const btnConfirmar = document.querySelector("#btn-confirmar");

const accionesNormales = document.querySelector("#acciones-normales");
const accionesEdicion = document.querySelector("#acciones-edicion");
const accionesEliminar = document.querySelector("#acciones-eliminar");

const alertaEdicion = document.querySelector("#alerta-edicion");
const alertaTexto = document.querySelector("#alerta-texto");

const btnCancelarEliminar = document.querySelector("#btn-cancelar-eliminar");
const btnConfirmarEliminar = document.querySelector("#btn-confirmar-eliminar");

let filaSeleccionada = null;
let modoEliminacion = false;

let todasLasCampanias = [];
let idCampaniaActual = null;

// GESTIÓN DE FILTROS AVANZADOS VIA BROADCAST CHANNEL
let filtrosTiendasAplicados = null;
const canalComunicacion = new BroadcastChannel('bancosol_channel');

canalComunicacion.onmessage = (event) => {
    if (event.data && event.data.type === 'aplicar-filtros-tiendas') {
        filtrosTiendasAplicados = event.data.filtros;
        actualizarContadorFiltros();
        cargarDatosCompletos();
    }
};

function actualizarContadorFiltros() {
    const contadorEl = document.querySelector(".boton-icono__contador");
    if (!contadorEl) return;
    
    if (!filtrosTiendasAplicados) {
        contadorEl.textContent = "0";
        contadorEl.style.display = "none";
        return;
    }
    
    let count = 0;
    if (filtrosTiendasAplicados.nombre) count++;
    if (filtrosTiendasAplicados.cadenaId) count++;
    if (filtrosTiendasAplicados.localidadId) count++;
    if (filtrosTiendasAplicados.distritoId) count++;
    if (filtrosTiendasAplicados.zonaGeoId) count++;
    if (filtrosTiendasAplicados.colaboradorId) count++;
    if (filtrosTiendasAplicados.responsableTiendaId) count++;
    if (filtrosTiendasAplicados.participaActiva !== null) count++;
    if (filtrosTiendasAplicados.esFranquicia !== null) count++;

    contadorEl.textContent = count;
    contadorEl.style.display = count > 0 ? "flex" : "none";
}

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
        loader.innerHTML = `
            <div class="spinner"></div>
            <div class="loading-text">Cargando datos... Por favor, espere</div>
        `;
        document.body.appendChild(loader);
    }
    if (loader) {
        loader.style.display = mostrar ? 'flex' : 'none';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if(btnModificar) btnModificar.disabled = true;
    
    // Clic del embudo para abrir el panel lateral corregido
    const btnFiltro = document.querySelector(".filtro .boton-icono");
    if (btnFiltro) {
        btnFiltro.onclick = () => {
            cambiarIframe("../Tiendas/panel-filtros.html");
        };
    }

    actualizarContadorFiltros();
    cargarDatosCompletos();
    registrarEventosModalCampanias();
});

async function cargarDatosCompletos() {
    toggleLoader(true); 
    const tbody = document.querySelector("#tabla-tiendas-body");
    
    try {
        if (todasLasCampanias.length === 0) {
            todasLasCampanias = await fetchSafe(`${API_BASE}/campanias`);
        }

        if (!idCampaniaActual && todasLasCampanias.length > 0) {
            const campOrdenadas = [...todasLasCampanias].sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio));
            const activa = campOrdenadas.find(c => c.activa);
            idCampaniaActual = activa ? activa.id : campOrdenadas[0].id;
        }

        const tituloEl = document.querySelector("#historial_titulo");
        const campActualObj = todasLasCampanias.find(c => c.id === idCampaniaActual);
        const campActivaGlobalObj = todasLasCampanias.find(c => c.activa);

        if (tituloEl && campActualObj) {
            tituloEl.innerHTML = `Listado de tiendas en <b>"${campActualObj.nombre}"</b>`;
        } else if (tituloEl) {
            tituloEl.innerHTML = `Listado de Tiendas`;
        }

        // CONSTRUCCIÓN DINÁMICA DE LA URL CON QUERY PARAMS PARA EL BACKEND
        let urlTiendas = new URL(`${API_BASE}/tiendas`);
        if (idCampaniaActual) {
            urlTiendas.searchParams.append("campaniaId", idCampaniaActual);
        }

        if (filtrosTiendasAplicados) {
            if (filtrosTiendasAplicados.nombre) urlTiendas.searchParams.append("nombre", filtrosTiendasAplicados.nombre);
            if (filtrosTiendasAplicados.cadenaId) urlTiendas.searchParams.append("cadenaId", filtrosTiendasAplicados.cadenaId);
            if (filtrosTiendasAplicados.localidadId) urlTiendas.searchParams.append("localidadId", filtrosTiendasAplicados.localidadId);
            if (filtrosTiendasAplicados.distritoId) urlTiendas.searchParams.append("distritoId", filtrosTiendasAplicados.distritoId);
            if (filtrosTiendasAplicados.zonaGeoId) urlTiendas.searchParams.append("zonaGeoId", filtrosTiendasAplicados.zonaGeoId);
            if (filtrosTiendasAplicados.colaboradorId) urlTiendas.searchParams.append("colaboradorId", filtrosTiendasAplicados.colaboradorId);
            if (filtrosTiendasAplicados.responsableTiendaId) urlTiendas.searchParams.append("responsableTiendaId", filtrosTiendasAplicados.responsableTiendaId);
            if (filtrosTiendasAplicados.participaActiva !== null) urlTiendas.searchParams.append("participaActiva", filtrosTiendasAplicados.participaActiva);
            if (filtrosTiendasAplicados.esFranquicia !== null) urlTiendas.searchParams.append("esFranquicia", filtrosTiendasAplicados.esFranquicia);
        }
        
        const [tiendasFiltradas, direcciones, localidades, cadenas, cps] = await Promise.all([
            fetchSafe(urlTiendas.toString()),
            fetchSafe(`${API_BASE}/direcciones`),
            fetchSafe(`${API_BASE}/localidades`),
            fetchSafe(`${API_BASE}/cadenas`),
            fetchSafe(`${API_BASE}/codigos-postales`)
        ]);

        window.tiendasDatosOriginales = tiendasFiltradas;

        const mapD = new Map(direcciones.map(d => [d.id, d]));
        const mapL = new Map(localidades.map(l => [l.id, l]));
        const mapCP = new Map(cps.map(cp => [cp.id, cp])); 

        tbody.innerHTML = "";
        
        if (!tiendasFiltradas || tiendasFiltradas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px; color:#666;">No hay tiendas que cumplan los criterios seleccionados</td></tr>`;
            return;
        }

        tiendasFiltradas.forEach(t => {
            const d = mapD.get(t.direccionId);
            const l = d ? mapL.get(d.localidadId) : null;
            const cpObj = d ? mapCP.get(d.codigoPostalId) : null; 
            
            const idDeLaCadena = t.cadenaId || t.idCadena || (t.cadena ? t.cadena.id : null);
            const c = cadenas.find(cad => cad.id == idDeLaCadena);

            const listaResp = t.responsablesInfo || [];
            const textoResumen = listaResp.length > 0 ? `${listaResp[0].nombre} (${listaResp[0].nombreEntidad})` : 'Sin asignar';
            const indicadorMas = listaResp.length > 1 ? ` <b>(+${listaResp.length - 1})</b>` : '';

            const respHtml = `
                <div class="resp-resumen">${textoResumen}${indicadorMas}</div>
                <div class="resp-lista-completa" style="display: none; text-align: left; font-size: 0.82rem; margin-top: 5px; color: #555555; text-align: center;">
                    ${listaResp.map(r => `<div>• ${r.nombre} <span style="color:var(--color-principal); font-size:0.75rem; ">(${r.nombreEntidad})</span></div>`).join('')}
                </div>
            `;

            const participaActivaGlobal = t.idsCampanias && campActivaGlobalObj && t.idsCampanias.includes(campActivaGlobalObj.id);

            const tr = document.createElement("tr");
            tr.dataset.id = t.id;
            tr.innerHTML = `
                <td>${t.nombre}</td>
                <td>${d ? d.calle + ', ' + d.numero : '---'}</td>
                <td>${l ? l.nombre : 'Málaga'}</td>
                <td>${respHtml}</td>
                <td><img src="../assets/keyboard_double_arrow_down.svg" class="btn-desplegar-resp" style="transition: transform 0.2s; cursor: pointer;"></td>
                <td><input type="checkbox" ${participaActivaGlobal ? 'checked' : ''} disabled></td>
                <td>${t.puntosRecogida || 0}</td>
            `;
            
            const imgArrow = tr.querySelector(".btn-desplegar-resp");
            if (imgArrow) {
                imgArrow.onclick = (event) => {
                    event.stopPropagation(); 
                    const listaCompleta = tr.querySelector(".resp-lista-completa");
                    const resumen = tr.querySelector(".resp-resumen");
                    
                    if (listaCompleta.style.display === "none") {
                        listaCompleta.style.display = "block";
                        resumen.style.display = "none";
                        imgArrow.style.transform = "rotate(180deg)";
                    } else {
                        listaCompleta.style.display = "none";
                        resumen.style.display = "block";
                        imgArrow.style.transform = "rotate(0deg)";
                    }
                };
            }

            tr.onclick = () => {
                if (modoEliminacion) {
                    tr.classList.toggle("seleccionada-eliminar");
                    return;
                }

                if(filaSeleccionada?.classList.contains("fila-editando")) return;
                
                document.querySelectorAll("#tabla-tiendas-body tr").forEach(r => {
                    r.classList.remove("seleccionada");
                    r.classList.remove("seleccionada-eliminar");
                });
                tr.classList.add("seleccionada");
                filaSeleccionada = tr;
                
                const infoEnriquecida = {
                    ...t,
                    nombreLocalidad: l?.nombre,
                    nombreCadena: c?.nombre,
                    cadenaIdReal: c?.id, 
                    calle: d?.calle,
                    numero: d?.numero,
                    cpId: d?.codigoPostalId, 
                    codigoPostalReal: cpObj?.codigo, 
                    distritoId: d?.distritoId,
                    localidadId: d?.localidadId,
                    campaniaActualId: idCampaniaActual,
                    campaniaActualNombre: campActualObj ? campActualObj.nombre : "Sin campaña",
                    campaniaActivaGlobalId: campActivaGlobalObj ? campActivaGlobalObj.id : null,
                    campaniaActivaGlobalNombre: campActivaGlobalObj ? campActivaGlobalObj.nombre : "Sin campaña activa",
                    participaActivaGlobal: participaActivaGlobal
                };
                sessionStorage.setItem("tiendaSeleccionada", JSON.stringify(infoEnriquecida));
                btnModificar.disabled = false;
                cambiarIframe("../Tiendas/tienda-seleccionada.html");
            };
            tbody.appendChild(tr);
        });
    } catch (e) { console.error("Fallo carga tabla", e); } finally { toggleLoader(false); }
}

function registrarEventosModalCampanias() {
    const btnAbrir = document.querySelector("#btn-seleccionar-campania");
    const btnCerrar = document.querySelector("#btn-cerrar-campanias");
    const modal = document.querySelector("#modal-campanias");
    const listaContenedor = document.querySelector("#lista-campanias");

    if (btnAbrir) btnAbrir.onclick = () => { renderizarTarjetasCampanias(listaContenedor); modal.classList.remove("oculto"); };
    if (btnCerrar) btnCerrar.onclick = () => modal.classList.add("oculto");
}

function renderizarTarjetasCampanias(contenedor) {
    contenedor.innerHTML = "";
    const campOrdenadas = [...todasLasCampanias].sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio));

    campOrdenadas.forEach(c => {
        const esViendo = c.id === idCampaniaActual;
        const formatFecha = (f) => f ? new Date(f).toLocaleDateString('es-ES') : '--/--/----';

        let badgesHTML = `<span class="badge ${c.activa ? 'activa' : 'inactiva'}">${c.activa ? 'ACTIVA' : 'INACTIVA'}</span>`;
        if (esViendo) badgesHTML += `<span class="badge viendo">VIENDO AHORA</span>`;

        const tarjeta = document.createElement("div");
        tarjeta.className = `tarjeta-campania ${esViendo ? 'seleccionada' : ''}`;
        tarjeta.innerHTML = `
            <div class="tarjeta-titulo">${c.nombre}</div>
            <div class="tarjeta-detalles">
                <span>Inicio: ${formatFecha(c.fechaInicio)} | Fin: ${formatFecha(c.fechaFin)}</span>
                <span>Año fiscal: ${c.anio || 'N/A'}</span>
            </div>
            <div class="badges-container">${badgesHTML}</div>
        `;

        tarjeta.onclick = () => {
            idCampaniaActual = c.id;
            document.querySelector("#modal-campanias").classList.add("oculto");
            cargarDatosCompletos(); 
        };
        contenedor.appendChild(tarjeta);
    });
}

function cambiarIframe(url) {
    const iframe = window.parent.document.querySelector(".menu-lateral-iframe");
    if (iframe) iframe.src = url;
}

if (btnEliminar) {
    btnEliminar.onclick = () => {
        modoEliminacion = true;
        document.querySelectorAll("#tabla-tiendas-body tr").forEach(r => {
            r.classList.remove("seleccionada"); r.classList.remove("seleccionada-eliminar");
        });
        filaSeleccionada = null;
        if(btnModificar) btnModificar.disabled = true;

        if(alertaTexto) alertaTexto.textContent = "SELECCIONE LAS TIENDAS QUE DESEA ELIMINAR";
        alertaEdicion.classList.remove("oculto");
        accionesNormales.classList.add("oculto");
        accionesEliminar.classList.remove("oculto");
        cambiarIframe("../MenuLateral/menu-lateral.html");
    };
}

if (btnCancelarEliminar) {
    btnCancelarEliminar.onclick = () => {
        modoEliminacion = false;
        alertaEdicion.classList.add("oculto");
        accionesEliminar.classList.add("oculto");
        accionesNormales.classList.remove("oculto");
        document.querySelectorAll("#tabla-tiendas-body tr").forEach(r => r.classList.remove("seleccionada-eliminar"));
        if(alertaTexto) alertaTexto.textContent = "Modifique en el menú lateral los datos de la tienda";
    };
}

if (btnConfirmarEliminar) {
    btnConfirmarEliminar.onclick = async () => {
        const seleccionados = document.querySelectorAll("#tabla-tiendas-body tr.seleccionada-eliminar");
        if (seleccionados.length === 0) return alert("Por favor, seleccione al menos una tienda para eliminar.");

        if (confirm(`¿Está seguro de que desea eliminar ${seleccionados.length} tiendas?`)) {
            const idsParaBorrar = Array.from(seleccionados).map(tr => parseInt(tr.dataset.id));
            toggleLoader(true); 
            try {
                const res = await fetch(`${API_BASE}/tiendas`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(idsParaBorrar) });
                if (res.ok) {
                    alert("¡Tiendas eliminadas con éxito!");
                    modoEliminacion = false; alertaEdicion.classList.add("oculto"); accionesEliminar.classList.add("oculto"); accionesNormales.classList.remove("oculto");
                    if(alertaTexto) alertaTexto.textContent = "Modifique en el menú lateral los datos de la tienda";
                    await cargarDatosCompletos(); 
                } else alert("Error en el borrado masivo. Código: " + res.status);
            } catch (error) { alert("Error de conexión con el servidor."); } finally { toggleLoader(false); }
        }
    };
}

if(btnModificar) btnModificar.onclick = () => {
    if(alertaTexto) alertaTexto.textContent = "Modifique en el menú lateral los datos de la tienda";
    accionesNormales.classList.add("oculto"); accionesEdicion.classList.remove("oculto"); alertaEdicion.classList.remove("oculto");
    filaSeleccionada.classList.add("fila-editando");
    cambiarIframe("../Tiendas/tienda-modificar.html");
};

if(btnDescartar) btnDescartar.onclick = () => {
    accionesNormales.classList.remove("oculto"); accionesEdicion.classList.add("oculto"); alertaEdicion.classList.add("oculto");
    filaSeleccionada.classList.remove("fila-editando");
    cambiarIframe("../Tiendas/tienda-seleccionada.html");
};

if(btnConfirmar) btnConfirmar.onclick = () => {
    const iframe = window.parent.document.querySelector(".menu-lateral-iframe");
    if (iframe && iframe.contentWindow.guardarCambiosDesdeIframe) iframe.contentWindow.guardarCambiosDesdeIframe();
};

const btnAnadir = document.querySelector("#btn-anadir");
if(btnAnadir) btnAnadir.onclick = () => window.location.href = "../Tiendas/aniadir-tienda.html";