/**
 * exportarCsv.js
 * Lógica para exportar los datos de la tabla de colaboradores a un archivo CSV funcional.
 * Este script se comunica con la caché de datos de conexionApiTabla.js.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Localizamos el botón con la clase .csv que ya tienes en el HTML
    const btnCsv = document.querySelector('.csv');
    
    if (btnCsv) {
        // Mejoramos la experiencia de usuario (UI)
        btnCsv.style.cursor = 'pointer';
        btnCsv.title = 'Descargar lista actual de colaboradores en CSV';
        
        // Añadimos el "escuchador" de eventos
        btnCsv.addEventListener('click', () => {
            // Verificamos si existe la variable global colaboradoresCache (definida en conexionApiTabla.js)
            if (typeof colaboradoresCache !== 'undefined' && colaboradoresCache.length > 0) {
                exportarACsv(colaboradoresCache);
            } else {
                alert("⚠️ No hay datos cargados en la tabla para exportar. Por favor, asegúrate de que la tabla muestra colaboradores.");
            }
        });
    }
});

/**
 * Transforma los objetos de la caché en un formato CSV y lanza la descarga.
 * @param {Array} datos - El array de colaboradores (colaboradoresCache).
 */
function exportarACsv(datos) {
    // 1. Definir las cabeceras (Nombres de las columnas)
    const cabeceras = [
        "ID", 
        "Nombre de la Entidad", 
        "Estado", 
        "Domicilio Completo", 
        "Localidad", 
        "Código Postal", 
        "Responsable Principal", 
        "Email Responsable", 
        "Teléfono Responsable", 
        "Tiendas Asignadas", 
        "Campañas",
        "Observaciones"
    ];

    // 2. Procesar cada fila de datos
    const filasCsv = datos.map(c => {
        // Buscamos al contacto principal dentro de la lista de responsables
        const principal = (c.responsables || []).find(r => r.esPrincipal) || {};
        
        // Unimos las listas de nombres (tiendas y campañas) con un separador visual
        const tiendasStr = (c.nombresTiendas || []).join(" | ");
        const campaniasStr = (c.nombresCampanias || []).join(" | ");

        // Escapamos comillas dobles en campos de texto para no romper el formato CSV
        const limpiar = (texto) => (texto ? `"${texto.toString().replace(/"/g, '""')}"` : '""');

        return [
            c.id,
            limpiar(c.nombre),
            c.estadoActivo ? "ACTIVO" : "INACTIVO",
            limpiar(c.domicilioCompleto),
            limpiar(c.localidadNombre),
            limpiar(c.codigoPostal),
            limpiar(principal.nombre),
            limpiar(principal.email),
            limpiar(principal.telefono),
            limpiar(tiendasStr),
            limpiar(campaniasStr),
            limpiar(c.observaciones)
        ].join(",");
    });

    // 3. Crear el contenido final con el BOM (Byte Order Mark)
    // Esto es CRUCIAL para que Excel reconozca tildes, la 'ñ' y caracteres españoles correctamente.
    const BOM = "\uFEFF";
    const contenidoFinal = BOM + cabeceras.join(",") + "\n" + filasCsv.join("\n");

    // 4. Crear el archivo (Blob) y el enlace de descarga
    const blob = new Blob([unescape(encodeURIComponent(contenidoFinal))], { type: 'text/csv;charset=utf-8;' });
    // Nota: unescape(encodeURIComponent()) ayuda con la codificación si el navegador es antiguo, 
    // pero el BOM suele bastar. Usamos una descarga directa estándar:
    const blobFinal = new Blob([contenidoFinal], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blobFinal);
    
    const link = document.createElement("a");
    const fecha = new Date().toISOString().slice(0, 10);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `bancosol_colaboradores_${fecha}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Liberamos memoria
    URL.revokeObjectURL(url);
}