<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>

<aside class="panel-colaborador" id="entidades" data-id-campania-actual="${campaniaSelec.id}">
    <header class="panel-cabecera">
        <div style="flex: 1;">
            <h2 style="font-size: 18px; color: #2e1065;">Filtros de búsqueda</h2>
            <span class="badge-id">Ajuste de resultados</span>
        </div>
        <button id="btn-cerrar-filtros" class="btn-cerrar" type="button">←</button>
    </header>

    <div class="panel-contenido">
        <section class="bloque-seccion border-bottom">
            <div class="fila-flex">
                <span class="etiqueta">Tienda:</span>
                <input type="text" id="filtro-tienda" class="input-linea" 
                      placeholder="Escribe nombre de tienda..." 
                      value="${fTienda != null ? fTienda : ''}">
            </div>
            
            <div class="fila-flex">
                <span class="etiqueta">Localidad:</span>
                <%-- Guardamos el id filtrado en data-seleccionada para que el JS lo lea --%>
                <select id="filtro-localidad" class="input-linea" data-seleccionada="${fLocalidadId != null ? fLocalidadId : ''}">
                   <option value="">Cargando localidades...</option>
                </select>
            </div>

            <label class="fila-check" style="margin-top: 15px;">
                <input type="checkbox" id="filtro-todas-campanias" class="check-inline" ${fTodasCampanias ? 'checked' : ''}>
                <span class="etiqueta" style="font-weight: bold;">Mostrar todas las campañas</span>
            </label>
        </section>

        <section class="bloque-seccion border-bottom">
            <label class="fila-check">
                <input type="checkbox" id="filtro-capital" class="check-inline" ${fCapital ? 'checked' : ''}>
                <span class="etiqueta">Solo en Capital</span>
            </label>

            <label class="fila-check">
                <input type="checkbox" id="filtro-activa" class="check-inline" ${fActivo ? 'checked' : ''}>
                <span class="etiqueta">Colaborador Activo</span>
            </label>
        </section>

        <section class="bloque-seccion">
            <button id="btn-aplicar-filtros" class="btn-guardar-lateral" style="background-color: #1e3a8a;">Aplicar Filtros</button>
            <button id="btn-limpiar-filtros" class="btn-limpiar" style="margin-top: 10px; width: 100%; padding: 10px; cursor: pointer; border: 1px solid #ccc; background: none; border-radius: 4px;">Limpiar todos los filtros</button>
        </section>
    </div>
</aside>