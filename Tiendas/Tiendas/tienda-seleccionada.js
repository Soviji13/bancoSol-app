const API_BASE = "http://localhost:8080/api";

async function fetchSafe(url) {
    try {
        const r = await fetch(url);
        if (!r.ok) return [];
        const d = await r.json();
        return Array.isArray(d) ? d : [];
    } catch(e) { return []; }
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

    try {
        document.querySelector("#titulo-tienda").textContent = tienda.nombre || "Sin nombre";
        document.querySelector("#detalle-puntuacion").textContent = tienda.puntosRecogida ?? "0";
        document.querySelector("#detalle-id-tienda").textContent = tienda.id;
        document.querySelector("#detalle-franquicia").checked = tienda.esFranquicia;
        document.querySelector("#detalle-domicilio").textContent = (tienda.calle ? `${tienda.calle}, ${tienda.numero}` : "---");
        document.querySelector("#detalle-localidad").textContent = tienda.nombreLocalidad || "---";
        document.querySelector("#detalle-cp").textContent = tienda.codigoPostalReal || "--";
        
        document.querySelector("#detalle-responsable").textContent = tienda.nombreResponsableTienda || "Sin responsable asignado";

        const localidadUpper = (tienda.nombreLocalidad || "").toUpperCase();
        if (localidadUpper.includes("MÁLAGA") || localidadUpper.includes("MALAGA")) {
            document.querySelector("#detalle-distrito").textContent = "Distrito Centro";
        } else {
            document.querySelector("#detalle-distrito").textContent = "No se ubica en capital.";
        }

        document.querySelector("#label-participa").textContent = `Participa en la campaña actual "${tienda.campaniaActivaGlobalNombre}":`;
        document.querySelector("#label-turnos").textContent = `Turnos de la campaña "${tienda.campaniaActualNombre}"`;
        document.querySelector("#detalle-participa").checked = tienda.participaActivaGlobal;

        const [dataEnt, dataLoc, dataZonas, dataCadena, dataTT, dataTurnos, dataVols, dataRespEnt] = await Promise.all([
            fetchSafe(`${API_BASE}/entidades`),
            fetchSafe(`${API_BASE}/localidades`),
            fetchSafe(`${API_BASE}/zonas-geograficas`),
            fetchSafe(`${API_BASE}/cadenas`),
            fetchSafe(`${API_BASE}/tiendas-turnos`),
            fetchSafe(`${API_BASE}/turnos`),
            fetchSafe(`${API_BASE}/voluntarios`),
            fetchSafe(`${API_BASE}/responsables-entidades`)
        ]);

        const idCadenaBuscado = tienda.cadenaIdReal || tienda.cadenaId || tienda.idCadena || (tienda.cadena ? tienda.cadena.id : null);
        let cadenaObj = dataCadena.find(c => c.id == idCadenaBuscado);
        if (!cadenaObj && tienda.nombre) cadenaObj = dataCadena.find(c => tienda.nombre.toUpperCase().includes(c.nombre.toUpperCase()));
        document.querySelector("#detalle-cadena").textContent = cadenaObj ? `${cadenaObj.id} / ${cadenaObj.nombre}` : "---";
        
        const idEntidadBuscada = (tienda.idsEntidades && tienda.idsEntidades.length > 0) ? tienda.idsEntidades[0] : null;
        if (idEntidadBuscada) {
            const entidad = dataEnt.find(e => e.id == idEntidadBuscada);
            document.querySelector("#detalle-entidad").textContent = entidad ? entidad.nombre : "Entidad Desconocida";
        } else {
            document.querySelector("#detalle-entidad").textContent = "Sin entidad colaboradora";
        }

        const localidadObj = dataLoc.find(l => l.id === tienda.localidadId);
        if (localidadObj && localidadObj.zonaGeoId) {
            const zona = dataZonas.find(z => z.id === localidadObj.zonaGeoId);
            document.querySelector("#detalle-zona").textContent = zona ? zona.nombre : "---";
        } else document.querySelector("#detalle-zona").textContent = "---";

        const tbodyTurnos = document.querySelector("#tabla-turnos-body");
        tbodyTurnos.innerHTML = "";
        
        if (dataTT.length === 0 || dataTurnos.length === 0) {
             tbodyTurnos.innerHTML = '<tr><td colspan="2" style="text-align:center; color:#777;">No hay turnos registrados en esta campaña</td></tr>';
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
                 tbodyTurnos.innerHTML = '<tr><td colspan="2" style="text-align:center; color:#777;">No hay turnos registrados en esta campaña</td></tr>';
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

                     // MODIFICADO: Estilos inline aplicados para garantizar simetría visual y evitar saltos
                     const tr = document.createElement("tr");
                     tr.innerHTML = `
                        <td class="turno-id" style="font-weight: bold; width: 75px; vertical-align: top; text-align: left; padding: 6px 0;">Turno ${index + 1}</td>
                        <td style="vertical-align: top; text-align: left; padding: 6px 0; line-height: 1.4; color: #4a5568;">${nombreEntidad}, ${nombreVoluntario}, ${dia}, (${horario})</td>
                     `;
                     tbodyTurnos.appendChild(tr);
                 });
            }
        }

    } catch (error) { console.error("Error al procesar el detalle de la tienda:", error); } finally { toggleLoader(false); }

    const btnCerrar = document.querySelector("#btn-cerrar-panel");
    if (btnCerrar) {
        btnCerrar.onclick = () => {
            const iframeMenu = window.parent.document.querySelector(".menu-lateral-iframe");
            if (iframeMenu) iframeMenu.src = "../MenuLateral/menu-lateral.html";
            const limpiarInterfaz = (doc) => {
                doc.querySelectorAll("tr.seleccionada").forEach(tr => tr.classList.remove("seleccionada"));
                const btnMod = doc.querySelector("#btn-modificar");
                if (btnMod) btnMod.disabled = true;
            };
            limpiarInterfaz(window.parent.document);
            window.parent.document.querySelectorAll("iframe").forEach(frame => {
                try { if (frame.contentDocument) limpiarInterfaz(frame.contentDocument); } catch (e) {}
            });
            sessionStorage.removeItem("tiendaSeleccionada");
        };
    }
});