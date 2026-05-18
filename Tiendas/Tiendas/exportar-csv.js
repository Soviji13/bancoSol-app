/**
 * exportar-csv.js
 * Lógica para exportar los datos filtrados de la tabla de tiendas a un archivo CSV.
 * Se comunica con la caché de tiendasDatosOriginales definida en tiendas.js.
 */

const API_BASE_EXPORT = "http://localhost:8080/api";

async function fetchExportSafe(url) {
    try {
        const r = await fetch(url);
        if (!r.ok) return [];
        const d = await r.json();
        return Array.isArray(d) ? d : [];
    } catch (e) { return []; }
}

document.addEventListener('DOMContentLoaded', () => {
    // Localizamos tu botón de exportar mediante su ID original
    const btnCsv = document.querySelector('#btn-exportar');
    
    if (btnCsv) {
        btnCsv.style.cursor = 'pointer';
        btnCsv.title = 'Descargar lista actual de tiendas en CSV';
        
        btnCsv.addEventListener('click', async () => {
            // Verificamos si existen datos cargados en la tabla de tiendas.js
            if (typeof window.tiendasDatosOriginales !== 'undefined' && window.tiendasDatosOriginales.length > 0) {
                await procesarYExportarTiendas(window.tiendasDatosOriginales);
            } else {
                alert("⚠️ No hay tiendas cargadas en la tabla para exportar en este momento.");
            }
        });
    }
});

/**
 * Cruza los datos de la tabla con los maestros de la API y genera la descarga del CSV
 * @param {Array} tiendas - El listado de tiendas visibles (window.tiendasDatosOriginales)
 */
async function procesarYExportarTiendas(tiendas) {
    // Para no sobrecargar tiendas.js, traemos los maestros geográficos necesarios aquí de forma asíncrona
    const [direcciones, localidades, cadenas, cps, distritos, zonas] = await Promise.all([
        fetchExportSafe(`${API_BASE_EXPORT}/direcciones`),
        fetchExportSafe(`${API_BASE_EXPORT}/localidades`),
        fetchExportSafe(`${API_BASE_EXPORT}/cadenas`),
        fetchExportSafe(`${API_BASE_EXPORT}/codigos-postales`),
        fetchExportSafe(`${API_BASE_EXPORT}/distritos`),
        fetchExportSafe(`${API_BASE_EXPORT}/zonas-geograficas`)
    ]);

    // Creamos mapas de búsqueda rápidos para optimizar el rendimiento del bucle
    const mapD = new Map(direcciones.map(d => [d.id, d]));
    const mapL = new Map(localidades.map(l => [l.id, l]));
    const mapCP = new Map(cps.map(cp => [cp.id, cp]));
    const mapDist = new Map(distritos.map(dist => [dist.id, dist]));
    const mapZona = new Map(zonas.map(z => [z.id, z.nombre]));

    // 1. Definimos las cabeceras exactamente como las has solicitado
    const cabeceras = [
        "TIENDA",
        "DOMICILIO",
        "LOCALIDAD",
        "DISTRITO",
        "CODIGOPOSTAL",
        "ZONA GEOGRAFICA",
        "ENTIDAD COLABORADORA",
        "RESPONSABLE DE TIENDA",
        "CADENA",
        "ES FRANQUICIA",
        "ID TIENDA",
        "PUNTUACION"
    ];

    // 2. Mapeamos y limpiamos cada registro de tienda activa usando punto y coma (;)
    const filasCsv = tiendas.map(t => {
        const d = mapD.get(t.direccionId);
        const l = d ? mapL.get(d.localidadId) : null;
        const cpObj = d ? mapCP.get(d.codigoPostalId) : null;
        const distObj = d ? mapDist.get(d.distritoId) : null;
        const zonaNombre = l && l.zonaGeoId ? (mapZona.get(l.zonaGeoId) || "---") : "---";
        
        const idDeLaCadena = t.cadenaId || t.idCadena || (t.cadena ? t.cadena.id : null);
        const c = cadenas.find(cad => cad.id == idDeLaCadena);

        // Agrupamos las entidades colaboradoras asociadas de forma limpia sin duplicados
        const entidadesArray = (t.responsablesInfo || []).map(r => r.nombreEntidad).filter(Boolean);
        const entidadesUnicas = [...new Set(entidadesArray)];
        const entidadesStr = entidadesUnicas.length > 0 ? entidadesUnicas.join(" | ") : "Sin entidad";

        const domicilioCompleto = d ? `${d.calle}, Nº ${d.numero}` : '---';
        const responsableTienda = t.nombreResponsableTienda || 'Sin responsable asignado';
        const cadenaNombre = c ? c.nombre : 'INDIVIDUAL';

        // Función auxiliar protectora para escapar comillas y evitar romper celdas en Excel
        const limpiar = (texto) => (texto ? `"${texto.toString().replace(/"/g, '""')}"` : '""');

        return [
            limpiar(t.nombre),
            limpiar(domicilioCompleto),
            limpiar(l ? l.nombre : 'Málaga'),
            limpiar(distObj ? distObj.nombre : '---'),
            limpiar(cpObj ? cpObj.codigo : '---'),
            limpiar(zonaNombre),
            limpiar(entidadesStr),
            limpiar(responsableTienda),
            limpiar(cadenaNombre),
            t.esFranquicia ? "SÍ" : "NO",
            t.id,
            t.puntosRecogida || 0
        ].join(";"); // <-- CORREGIDO: Unido con punto y coma para el Excel en español
    });

    // 3. Inyección de BOM (\uFEFF) para forzar a Excel a leer UTF-8 (Tildes, Ñs, etc.)
    const BOM = "\uFEFF";
    const contenidoFinal = BOM + cabeceras.join(";") + "\n" + filasCsv.join("\n"); // <-- CORREGIDO: Cabeceras con punto y coma

    // 4. Disparador nativo de la descarga de archivos del navegador
    const blobFinal = new Blob([contenidoFinal], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blobFinal);
    
    const link = document.createElement("a");
    const fecha = new Date().toISOString().slice(0, 10);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `bancosol_tiendas_${fecha}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Liberación de recursos en memoria
    URL.revokeObjectURL(url);
}