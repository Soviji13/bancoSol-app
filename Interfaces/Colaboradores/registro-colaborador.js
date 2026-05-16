// VARIABLES GLOBALES
let contadorResponsables = 0;
let mapaGeografico = [];

document.addEventListener('DOMContentLoaded', () => {
    cargarOpcionesRegistro();

    // 1. Escuchar cambio de CP
    const inputCP = document.querySelector('input[name="numeroCP"]');
    if (inputCP) inputCP.addEventListener('change', manejarAutocompletadoCP);

    // 2. Escuchar el checkbox de Capital (Para que siempre funcione)
    const checkCapital = document.getElementById('check-es-capital');
    if (checkCapital) {
        checkCapital.addEventListener('change', function() {
            toggleDistrito(this);
        });
    }

    // 3. Botón Abrir Registro
    const btnAbrir = document.getElementById('btn-abrir-registro');
    if (btnAbrir) {
        btnAbrir.onclick = () => {
            const tabla = document.querySelector('table');
            const modal = document.getElementById('modal-registro');
            const avisoBorrado = document.getElementById('aviso-borrado');

            // 1. Escondemos la tabla y avisos
            if (tabla) tabla.style.display = 'none';
            if (avisoBorrado) avisoBorrado.style.display = 'none';

            // 2. Mostramos el modal pero con la clase de "sustitución"
            modal.classList.add('v-sustitucion');
            modal.style.display = 'block';

            // Lógica que ya tenías
            cargarOpcionesRegistro(); 
            const contenedor = document.getElementById('contenedor-responsables');
            if (contenedor.children.length === 0) agregarBloqueResponsable();
            
            window.scrollTo(0, 0);
        };
    }
});

// Función para volver a la tabla
function cerrarModalRegistro() {
    const tabla = document.querySelector('table');
    const modal = document.getElementById('modal-registro');

    // 1. Escondemos el formulario
    modal.style.display = 'none';
    modal.classList.remove('v-sustitucion');

    // 2. Recuperamos la tabla
    if (tabla) tabla.style.display = 'table'; // Importante: 'table', no 'block'
}

async function cargarOpcionesRegistro() {
    try {
        const [resTiendas, resCampanias, resCps, resLocs, resDirs, resDists, resCoords, resZonas] = await Promise.all([
            fetch(`${API_BASE}/tiendas`).then(r => r.json()),
            fetch(`${API_BASE}/campanias`).then(r => r.json()),
            fetch(`${API_BASE}/codigos-postales`).then(r => r.json()),
            fetch(`${API_BASE}/localidades`).then(r => r.json()),
            fetch(`${API_BASE}/direcciones`).then(r => r.json()),
            fetch(`${API_BASE}/distritos`).then(r => r.json()),
            fetch(`${API_BASE}/coordinadores`).then(r => r.json()),
            fetch(`${API_BASE}/zonas-geograficas`).then(r => r.json())
        ]);

        // Llenar datalists (Esto hace que funcionen como el CP)
        document.getElementById('lista-localidades').innerHTML = resLocs.map(l => `<option value="${l.nombre}">`).join('');
        document.getElementById('lista-cps').innerHTML = resCps.map(cp => `<option value="${cp.codigo}">`).join('');
        document.getElementById('lista-distritos').innerHTML = resDists.map(d => `<option value="${d.nombre}">`).join('');
        document.getElementById('lista-zonas').innerHTML = resZonas.map(z => `<option value="${z.nombre}">`).join('');

        // Tiendas
        document.getElementById('check-tiendas').innerHTML = resTiendas.map(t => 
            `<label><input type="checkbox" value="${t.id}" class="check-tienda"> ${t.nombre}</label>`
        ).join('');

        // Campañas
        document.getElementById('check-campanias').innerHTML = resCampanias.map(c => 
            `<label><input type="checkbox" value="${c.id}" class="check-campania"> ${c.nombre}</label>`
        ).join('');



        // CONSTRUCCIÓN DEL MAPA INTELIGENTE (Cruzando Localidad con Zona)
        mapaGeografico = resDirs.map(dir => {
            const cpObj = resCps.find(c => c.id === dir.codigoPostalId);
            const locObj = resLocs.find(l => l.id === dir.localidadId);
            
            // Buscamos la zona de esa localidad
            const zonaObj = locObj ? resZonas.find(z => z.id === locObj.zonaGeoId) : null;
            const distObj = resDists.find(d => d.id === dir.distritoId);
            
            return {
                codigo: cpObj ? cpObj.codigo : null,
                localidad: locObj ? locObj.nombre : '',
                zonaNombre: zonaObj ? zonaObj.nombre : '', // <--- AQUÍ ESTABA EL FALLO
                distrito: distObj ? distObj.nombre : '',
                esCapital: dir.esCapital
            };
        }).filter(item => item.codigo);

        const selectCoords = document.getElementById('select-coordinadores');
        selectCoords.innerHTML = '<option value="">Seleccione un coordinador...</option>' + 
            resCoords.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');

    } catch (error) {
        console.error("Error cargando el motor:", error);
    }
}

function toggleDistrito(checkbox) {
    const divDistrito = document.getElementById('campo-distrito');
    if (divDistrito) {
        divDistrito.style.display = checkbox.checked ? 'block' : 'none';
        if (!checkbox.checked) divDistrito.querySelector('input').value = '';
    }
}

function manejarAutocompletadoCP(e) {
    const cpIntroducido = e.target.value;
    const coincidencia = mapaGeografico.find(m => m.codigo == cpIntroducido);

    if (coincidencia) {
        document.querySelector('input[name="nombreLocalidad"]').value = coincidencia.localidad;
        const checkCapital = document.getElementById('check-es-capital');
        checkCapital.checked = coincidencia.esCapital;
        toggleDistrito(checkCapital);

        if (coincidencia.esCapital && coincidencia.distrito) {
            document.querySelector('input[name="nombreDistrito"]').value = coincidencia.distrito;
        }

        const inputZona = document.getElementById('input-zona');
        if (coincidencia.zonaNombre) {
            inputZona.value = coincidencia.zonaNombre;
            inputZona.readOnly = true; // Bloqueamos si ya existe
            inputZona.style.backgroundColor = "#e9ecef";
        } else {
            inputZona.value = "";
            inputZona.readOnly = false;
            inputZona.style.backgroundColor = "#fff";
        }
    }
}

function agregarBloqueResponsable() {
    const contenedor = document.getElementById('contenedor-responsables');
    const index = contadorResponsables++;
    
    const html = `
        <div class="responsable-card" id="resp-${index}">
            <div class="card-header">
                <h4>Responsable #${index + 1}</h4>
                <button type="button" class="btn-eliminar-resp" onclick="this.closest('.responsable-card').remove()">Eliminar</button>
            </div>
            <div class="form-grid-resp">
                <input type="text" placeholder="Nombre completo" class="r-nombre" required>
                <input type="email" placeholder="Email" class="r-email" required>
                <input type="tel" placeholder="Teléfono" class="r-telefono" required>
                <div class="radio-group">
                    <label><input type="radio" name="esPrincipal" class="r-principal" ${index === 0 ? 'checked' : ''}> ¿Principal?</label>
                </div>
                <hr>
                <input type="text" placeholder="Username (Email)" class="r-user" required>
                <input type="password" placeholder="Contraseña" class="r-pass" required>
            </div>
        </div>
    `;
    contenedor.insertAdjacentHTML('beforeend', html);
}

document.getElementById('form-registro-entidad').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const formData = new FormData(e.target);
        const responsables = Array.from(document.querySelectorAll('.responsable-card')).map(card => ({
            nombre: card.querySelector('.r-nombre').value,
            email: card.querySelector('.r-email').value,
            telefono: card.querySelector('.r-telefono').value,
            esPrincipal: card.querySelector('.r-principal').checked,
            username: card.querySelector('.r-user').value,
            password: card.querySelector('.r-pass').value
        }));

        const objetoFinal = {
            nombre: formData.get('nombre'),
            estadoActivo: formData.get('estadoActivo') === 'on',
            observaciones: formData.get('observaciones'),
            calle: formData.get('calle'),
            numero: parseInt(formData.get('numero')),
            esCapital: formData.get('esCapital') === 'on',
            nombreLocalidad: formData.get('nombreLocalidad'),
            numeroCP: formData.get('numeroCP'),
            nombreZonaGeografica: formData.get('nombreZonaGeografica'),
            nombreDistrito: formData.get('nombreDistrito') || null,
            responsables: responsables,
            idsTiendas: obtenerChecksMarcados('check-tiendas'),
            idsCampanias: obtenerChecksMarcados('check-campanias'),
            idCoordinador: parseInt(formData.get('idCoordinador'))
        };

        // Cambiado a la URL completa para evitar errores de ruta
        const res = await fetch(`${API_BASE}/entidades/registro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(objetoFinal)
        });

        const respuestaTexto = await res.text();

        if (res.ok) {
            alert("¡Entidad creada con éxito!");
            window.location.reload();
        } else {
            console.error("Error del servidor:", respuestaTexto);
            alert("Error al guardar: " + respuestaTexto);
        }
    } catch (error) {
        console.error("Fallo crítico:", error);
        alert("No se pudo conectar con el servidor.");
    }
});

function obtenerChecksMarcados(idContenedor) {
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) return [];
    const checks = contenedor.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(checks).map(cb => parseInt(cb.value));
}
