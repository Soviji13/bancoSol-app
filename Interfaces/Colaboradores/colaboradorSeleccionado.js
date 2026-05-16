const API_BASE = "http://localhost:8080/api";

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Cargar todas las opciones (CPs, Localidades, Tiendas, Campañas)
    await cargarListasDesplegables();

    // 2. Cargar los datos específicos del colaborador seleccionado
    cargarDatosFormulario();

    window.addEventListener('message', (event) => {
        if (event.data === 'toggle-edicion-lateral') {
            toggleModoEdicion();
        }
    });

    document.getElementById('btn-cerrar-panel')?.addEventListener('click', cerrarPanelLateral);
    document.getElementById('btn-add-contacto').addEventListener('click', () => renderizarBloqueContacto({}, null, true));
    document.getElementById('form-edicion-lateral').addEventListener('submit', guardarCambiosReales);
});

function toggleModoEdicion() {
    const form = document.getElementById('form-edicion-lateral');
    
    if (form.classList.contains('modo-lectura')) {
        form.classList.replace('modo-lectura', 'modo-edicion');
        
        form.querySelectorAll('input, textarea').forEach(el => {
            el.removeAttribute('readonly');
            el.removeAttribute('disabled');
        });

        document.getElementById('btn-guardar-container').style.display = 'block';
        document.getElementById('btn-add-contacto-container').style.display = 'block';
        document.getElementById('edit-calle').focus();
    } else {
        form.classList.replace('modo-edicion', 'modo-lectura');
        
        form.querySelectorAll('input, textarea').forEach(el => {
            if (el.type === 'checkbox' || el.type === 'radio') {
                el.setAttribute('disabled', 'true');
            } else {
                el.setAttribute('readonly', 'true');
            }
        });

        document.getElementById('btn-guardar-container').style.display = 'none';
        document.getElementById('btn-add-contacto-container').style.display = 'none';
        
        cargarDatosFormulario();
    }
}

async function cargarListasDesplegables() {

    const loaderLateral = document.createElement('div');
    loaderLateral.className = 'loading-overlay';
    loaderLateral.style.position = 'absolute'; // Localizado al panel
    loaderLateral.innerHTML = '<div class="spinner"></div>';
    document.querySelector('.panel-colaborador').appendChild(loaderLateral);

    try {
        const [resCps, resLocs, resTiendas, resCampanias, resZonas, resDists] = await Promise.all([
            fetch(`${API_BASE}/codigos-postales`).then(r => r.json()),
            fetch(`${API_BASE}/localidades`).then(r => r.json()),
            fetch(`${API_BASE}/tiendas`).then(r => r.json()),
            fetch(`${API_BASE}/campanias`).then(r => r.json()),
            fetch(`${API_BASE}/zonas-geograficas`).then(r => r.json()),
            fetch(`${API_BASE}/distritos`).then(r => r.json())
        ]);

        document.getElementById('lista-cps-panel').innerHTML = resCps.map(cp => `<option value="${cp.codigo}">`).join('');
        document.getElementById('lista-locs-panel').innerHTML = resLocs.map(l => `<option value="${l.nombre}">`).join('');
        document.getElementById('lista-zonas-panel').innerHTML = resZonas.map(z => `<option value="${z.nombre}">`).join('');
        document.getElementById('lista-distritos-panel').innerHTML = resDists.map(d => `<option value="${d.nombre}">`).join('');

        // NUEVO: Guardamos tiendas y campañas globales en el dataset para usarlas al cargar el colaborador
        const contTiendas = document.getElementById('check-tiendas-panel');
        contTiendas.innerHTML = resTiendas.map(t => 
            `<label><input type="checkbox" value="${t.id}" class="check-tienda-panel" disabled> ${t.nombre}</label>`
        ).join('');

        const contCampanias = document.getElementById('check-campanias-panel');
        contCampanias.innerHTML = resCampanias.map(c => 
            `<label><input type="checkbox" value="${c.id}" class="check-campania-panel" disabled> ${c.nombre}</label>`
        ).join('');

    } catch (e) {
        console.error("Fallo al cargar datos maestros del panel", e);
    }
    finally{
        loaderLateral.remove();
    }
}

function cargarDatosFormulario() {
    const colab = JSON.parse(sessionStorage.getItem("colaboradorSeleccionado"));
    if (!colab) return;

    // --- Datos básicos ---
    document.getElementById('titulo-colaborador').value = colab.nombre || "";
    document.getElementById('colaborador-id').value = colab.id;
    document.getElementById('detalle-id-display').textContent = `A${String(colab.id).padStart(5, '0')}`;
    
    // --- Lógica del número de calle ---
    let calle = colab.calle || "";
    let numero = colab.numero || "";
    if (!calle && colab.domicilioCompleto) {
        const partes = colab.domicilioCompleto.split(',');
        calle = partes[0] ? partes[0].trim() : "";
        numero = partes[1] ? parseInt(partes[1].trim()) : "";
    }
    document.getElementById('edit-calle').value = calle;
    document.getElementById('edit-numero').value = numero;
    document.getElementById('edit-localidad').value = colab.localidadNombre || "";
    document.getElementById('edit-cp').value = colab.codigoPostal || "";
    document.getElementById('check-campania').checked = colab.estadoActivo;
    document.getElementById('edit-observaciones').value = colab.observaciones || "";

    // --- 1. MARCADO DE TIENDAS (Usando nombresTiendas que sí viene en tu JSON) ---
    const misTiendasNombres = colab.nombresTiendas || []; //

    document.querySelectorAll('.check-tienda-panel').forEach(cb => {
        // Obtenemos el nombre que está escrito al lado del checkbox
        const nombreTiendaEnPanel = cb.parentElement.textContent.trim();
        
        // Si el nombre de la tienda está en la lista de la API, lo marcamos
        cb.checked = misTiendasNombres.includes(nombreTiendaEnPanel);
    });

    // --- 2. MARCADO DE CAMPAÑAS (Aviso: faltan datos en la API) ---
    // Tu API ahora mismo no devuelve "nombresCampanias" ni "idsCampanias"
    const misCampaniasNombres = colab.nombresCampanias || []; 

    document.querySelectorAll('.check-campania-panel').forEach(cb => {
        const nombreCampaniaEnPanel = cb.parentElement.textContent.trim();
        cb.checked = misCampaniasNombres.includes(nombreCampaniaEnPanel);
    });

    // --- 3. Renderizado de contactos ---
    const tbody = document.getElementById('tabla-contactos-dinamica');
    tbody.innerHTML = ''; 
    if (colab.responsables && colab.responsables.length > 0) {
        colab.responsables.forEach((resp, index) => renderizarBloqueContacto(resp, index, false));
    } else {
        renderizarBloqueContacto({}, 0, false);
    }

    // NUEVO: Zona, Capital y Distrito
    document.getElementById('edit-zona').value = colab.zonaNombre || "";
    const checkCapital = document.getElementById('check-es-capital-panel');
    checkCapital.checked = colab.esCapital || false;
    
    const divDistrito = document.getElementById('campo-distrito-panel');
    if (colab.esCapital) {
        divDistrito.style.display = 'flex';
        document.getElementById('edit-distrito').value = colab.distritoNombre || "";
    } else {
        divDistrito.style.display = 'none';
    }

    // Escuchar el cambio de capital en tiempo real (solo si estamos editando)
    checkCapital.onchange = function() {
        divDistrito.style.display = this.checked ? 'flex' : 'none';
    };
}

function renderizarBloqueContacto(resp, index = null, esNuevo = false) {
    const tbody = document.getElementById('tabla-contactos-dinamica');
    const currIndex = index !== null ? index : (tbody.querySelectorAll('.contacto-header').length);
    const form = document.getElementById('form-edicion-lateral');
    const estaEnEdicion = form.classList.contains('modo-edicion');
    
    const disabledAtr = estaEnEdicion ? '' : 'disabled';
    const readonlyAtr = estaEnEdicion ? '' : 'readonly';
    const rowspan = esNuevo ? 5 : 3;

    let html = `
        <tr class="contacto-header">
            <td rowspan="${rowspan}" style="width: 90px; text-align: center; vertical-align: top; background-color: #f8fafc;">
                <strong style="color: #1e3a8a;">Contacto ${currIndex + 1}</strong><br>
                <label style="cursor: pointer; display: inline-block; margin-top: 8px;">
                    <span style="color: #dc2626; font-size: 12px; display: block; margin-bottom: 2px;">Principal</span>
                    <input type="radio" name="radio-principal" class="check-inline r-principal" ${resp.esPrincipal ? 'checked' : ''} ${disabledAtr}>
                </label>
                <button type="button" class="btn-eliminar-contacto" onclick="eliminarContacto(this)" style="${estaEnEdicion ? 'display:block;' : 'display:none;'} color:red; margin-top:10px; cursor:pointer; width: 100%; border: none; background: none; font-size: 12px;">🗑️ Borrar</button>
            </td>
            <td><span class="etiqueta-tabla">Nombre</span> <input type="text" class="input-linea r-nombre" value="${resp.nombre || ''}" ${readonlyAtr}></td>
        </tr>
        <tr><td><span class="etiqueta-tabla">Email</span> <input type="email" class="input-linea r-email" value="${resp.email || ''}" ${readonlyAtr}></td></tr>
        <tr><td><span class="etiqueta-tabla">Telef.</span> <input type="tel" class="input-linea r-telefono" value="${resp.telefono || ''}" ${readonlyAtr}></td></tr>
    `;

    if (esNuevo) {
        html += `
            <tr><td><span class="etiqueta-tabla">Usuario</span> <input type="text" class="input-linea r-user" placeholder="Login (email)" required></td></tr>
            <tr><td><span class="etiqueta-tabla">Contraseña</span> <input type="password" class="input-linea r-pass" placeholder="Contraseña" required></td></tr>
        `;
    }
    tbody.insertAdjacentHTML('beforeend', html);
}

window.eliminarContacto = function(btn) {
    const trPrincipal = btn.closest('tr');
    const filasABorrar = parseInt(trPrincipal.querySelector('td').rowSpan);
    let filaActual = trPrincipal;
    for (let i = 0; i < filasABorrar; i++) {
        let siguienteFila = filaActual.nextElementSibling;
        filaActual.remove();
        filaActual = siguienteFila;
    }
}

const canalComunicacion = new BroadcastChannel('bancosol_channel');

async function guardarCambiosReales(e) {
    e.preventDefault();
    
    const idEntidad = document.getElementById('colaborador-id').value;
    
    // 1. Recolectar responsables (pasando nombres a Mayúsculas)
    const responsables = [];
    document.querySelectorAll('.contacto-header').forEach(filaPrincipal => {
        const email = filaPrincipal.nextElementSibling.querySelector('.r-email').value.trim();
        const telefono = filaPrincipal.nextElementSibling.nextElementSibling.querySelector('.r-telefono').value.trim();
        
        const respObj = {
            nombre: filaPrincipal.querySelector('.r-nombre').value.trim().toUpperCase(), // MAYÚSCULAS
            email: email,
            telefono: telefono,
            esPrincipal: filaPrincipal.querySelector('.r-principal').checked
        };

        const rowUser = filaPrincipal.nextElementSibling.nextElementSibling.nextElementSibling;
        if (rowUser && rowUser.querySelector('.r-user')) {
            respObj.username = rowUser.querySelector('.r-user').value.trim();
            respObj.password = rowUser.nextElementSibling.querySelector('.r-pass').value;
        }
        responsables.push(respObj);
    });

    // 2. Construir el objeto DTO (con Mayúsculas)
    const objetoUpdate = {
        nombre: document.getElementById('titulo-colaborador').value.trim().toUpperCase(), // MAYÚSCULAS
        estadoActivo: document.getElementById('check-campania').checked,
        observaciones: document.getElementById('edit-observaciones').value.trim(),
        calle: document.getElementById('edit-calle').value.trim().toUpperCase(), // MAYÚSCULAS
        numero: parseInt(document.getElementById('edit-numero').value),
        nombreLocalidad: document.getElementById('edit-localidad').value.trim().toUpperCase(), // MAYÚSCULAS
        numeroCP: document.getElementById('edit-cp').value.trim(),
        nombreZonaGeografica: (document.getElementById('edit-zona').value || "").trim().toUpperCase() || null,
        esCapital: document.getElementById('check-es-capital-panel').checked,
        nombreDistrito: (document.getElementById('edit-distrito').value || "").trim().toUpperCase() || null,
        idsTiendas: obtenerChecksMarcados('check-tiendas-panel'),
        idsCampanias: obtenerChecksMarcados('check-campanias-panel'),
        responsables: responsables
    };

    try {
        const res = await fetch(`${API_BASE}/entidades/${idEntidad}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(objetoUpdate)
        });

        if (res.ok) {
            // --- AQUÍ ESTÁ EL CAMBIO PARA EL DINAMISMO ---
            
            // 1. Actualizamos el sessionStorage para que el lateral se vea bien
            const colabLocal = JSON.parse(sessionStorage.getItem("colaboradorSeleccionado"));
            const nuevoColab = { ...colabLocal, ...objetoUpdate };
            
            // Sincronizamos nombres de campos del DTO con los de la vista
            nuevoColab.localidadNombre = objetoUpdate.nombreLocalidad;
            nuevoColab.zonaNombre = objetoUpdate.nombreZonaGeografica;
            nuevoColab.distritoNombre = objetoUpdate.nombreDistrito;
            nuevoColab.codigoPostal = objetoUpdate.numeroCP;

            sessionStorage.setItem("colaboradorSeleccionado", JSON.stringify(nuevoColab));

            alert("✅ Colaborador actualizado correctamente");
            
            // 2. LA MAGIA: Enviamos la orden de recarga por el canal de radio
            canalComunicacion.postMessage('recargar-tabla');

            // 3. Volvemos al modo lectura
            toggleModoEdicion();
            
        } else {
            const error = await res.text();
            alert("❌ Error al actualizar: " + error);
        }
    } catch (error) {
        console.error("Error en la conexión:", error);
    }
}

// Función auxiliar para obtener IDs de los checkboxes marcados
function obtenerChecksMarcados(idContenedor) {
    const contenedor = document.getElementById(idContenedor);
    const checks = contenedor.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(checks).map(cb => parseInt(cb.value));
}

function cerrarPanelLateral() {
    if (window.parent) {
        const iframeMenu = window.parent.document.querySelector('.menu-lateral-iframe');
        if (iframeMenu) iframeMenu.src = '../MenuLateral/menu-lateral.html';
    }
}