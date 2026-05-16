const canalComunicacion = new BroadcastChannel('bancosol_channel');
const API_BASE = "http://localhost:8080/api";

document.addEventListener('DOMContentLoaded', async () => {
    // Cargar datos dinámicos
    await cargarFiltrosMaestros();

    document.getElementById('btn-aplicar-filtros').onclick = enviarFiltros;
    document.getElementById('btn-limpiar-filtros').onclick = limpiarFiltros;
    document.getElementById('btn-cerrar-filtros').onclick = cerrarPanel;
});

async function cargarFiltrosMaestros() {
    // 1. Localidades desde el cache de la tabla
    const datosColabs = JSON.parse(sessionStorage.getItem("colaboradoresCache")) || [];
    const selectLoc = document.getElementById('filtro-localidad');
    const localidades = [...new Set(datosColabs.map(c => c.localidadNombre))].filter(Boolean).sort();
    
    localidades.forEach(loc => {
        const opt = new Option(loc, loc);
        selectLoc.add(opt);
    });

    // 2. Campañas desde la API
    try {
        const res = await fetch(`${API_BASE}/campanias`);
        const campanias = await res.json();
        const selectCamp = document.getElementById('filtro-campania');
        
        campanias.forEach(c => {
            const opt = new Option(c.nombre, c.id);
            selectCamp.add(opt);
        });
    } catch (e) {
        console.error("Error cargando campañas para filtro", e);
    }
}

function enviarFiltros() {
    const filtros = {
        tienda: document.getElementById('filtro-tienda').value.trim().toUpperCase(),
        localidad: document.getElementById('filtro-localidad').value,
        campaniaId: document.getElementById('filtro-campania').value, // Nuevo
        soloCapital: document.getElementById('filtro-capital').checked,
        soloActiva: document.getElementById('filtro-activa').checked
    };

    canalComunicacion.postMessage({ type: 'aplicar-filtros', filtros });
}

function limpiarFiltros() {
    document.getElementById('filtro-tienda').value = '';
    document.getElementById('filtro-localidad').value = '';
    document.getElementById('filtro-campania').value = '';
    document.getElementById('filtro-capital').checked = false;
    document.getElementById('filtro-activa').checked = false;
    enviarFiltros();
}

function cerrarPanel() {
    if (window.parent) {
        const iframeMenu = window.parent.document.querySelector('.menu-lateral-iframe');
        if (iframeMenu) iframeMenu.src = '../MenuLateral/menu-lateral.html';
    }
}