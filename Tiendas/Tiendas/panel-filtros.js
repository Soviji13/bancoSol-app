const canalComunicacion = new BroadcastChannel('bancosol_channel');
const API_BASE = "http://localhost:8080/api";

async function fetchSafe(url) {
    try {
        const r = await fetch(url);
        if (!r.ok) return [];
        const d = await r.json();
        return Array.isArray(d) ? d : [];
    } catch (e) { return []; }
}

document.addEventListener('DOMContentLoaded', async () => {
    await cargarFiltrosMaestros();

    document.getElementById('filtro-localidad').addEventListener('change', alternarDistrito);
    document.getElementById('btn-aplicar-filtros').onclick = enviarFiltros;
    document.getElementById('btn-limpiar-filtros').onclick = limpiarFiltros;
    document.getElementById('btn-cerrar-filtros').onclick = cerrarPanel;
});

async function cargarFiltrosMaestros() {
    const [cadenas, localidades, distritos, zonas, entidades, responsables] = await Promise.all([
        fetchSafe(`${API_BASE}/cadenas`),
        fetchSafe(`${API_BASE}/localidades`),
        fetchSafe(`${API_BASE}/distritos`),
        fetchSafe(`${API_BASE}/zonas-geograficas`),
        fetchSafe(`${API_BASE}/entidades`),
        fetchSafe(`${API_BASE}/responsables-tiendas`)
    ]);

    poblarSelect('filtro-cadena', cadenas);
    poblarSelect('filtro-localidad', localidades);
    poblarSelect('filtro-distrito', distritos);
    poblarSelect('filtro-zona', zonas);
    poblarSelect('filtro-colaborador', entidades);
    poblarSelect('filtro-responsable', responsables);
}

function poblarSelect(idSelect, lista) {
    const el = document.getElementById(idSelect);
    if (!el) return;
    lista.forEach(item => {
        const nombreText = item.nombre || item.codigo || item.id;
        const opt = new Option(nombreText, item.id);
        el.add(opt);
    });
}

function alternarDistrito() {
    const selectLoc = document.getElementById('filtro-localidad');
    const bloqueDistrito = document.getElementById('bloque-distrito');
    const txtSelect = selectLoc.options[selectLoc.selectedIndex]?.text.toUpperCase() || "";

    if (txtSelect.includes("MÁLAGA") || txtSelect.includes("MALAGA")) {
        bloqueDistrito.classList.remove("oculto");
    } else {
        bloqueDistrito.classList.add("oculto");
        document.getElementById('filtro-distrito').value = "";
    }
}

function enviarFiltros() {
    const campaniaActivaRadio = document.querySelector('input[name="filtro-campania-activa"]:checked').value;
    const franquiciaRadio = document.querySelector('input[name="filtro-franquicia"]:checked').value;

    const filtros = {
        nombre: document.getElementById('filtro-nombre').value.trim(),
        cadenaId: document.getElementById('filtro-cadena').value,
        localidadId: document.getElementById('filtro-localidad').value,
        distritoId: document.getElementById('filtro-distrito').value,
        zonaGeoId: document.getElementById('filtro-zona').value,
        colaboradorId: document.getElementById('filtro-colaborador').value,
        responsableTiendaId: document.getElementById('filtro-responsable').value,
        participaActiva: campaniaActivaRadio === 'SI' ? true : (campaniaActivaRadio === 'NO' ? false : null),
        esFranquicia: franquiciaRadio === 'SI' ? true : (franquiciaRadio === 'NO' ? false : null)
    };

    canalComunicacion.postMessage({ type: 'aplicar-filtros-tiendas', filtros });
}

function limpiarFiltros() {
    document.getElementById('filtro-nombre').value = '';
    document.getElementById('filtro-cadena').value = '';
    document.getElementById('filtro-localidad').value = '';
    document.getElementById('filtro-distrito').value = '';
    document.getElementById('filtro-zona').value = '';
    document.getElementById('filtro-colaborador').value = '';
    document.getElementById('filtro-responsable').value = '';
    document.querySelector('input[name="filtro-campania-activa"][value="TODAS"]').checked = true;
    document.querySelector('input[name="filtro-franquicia"][value="TODAS"]').checked = true;
    document.getElementById('bloque-distrito').classList.add("oculto");
    enviarFiltros();
}

function cerrarPanel() {
    if (window.parent) {
        const iframeMenu = window.parent.document.querySelector('.menu-lateral-iframe');
        if (iframeMenu) iframeMenu.src = '../MenuLateral/menu-lateral.html';
    }
}