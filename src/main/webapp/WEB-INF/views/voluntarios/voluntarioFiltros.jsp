<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<script>
    window.entidadesFiltros = ${entidadesJson != null ? entidadesJson : '[]'};
    window.tiendasFiltros = ${tiendasJson != null ? tiendasJson : '[]'};
    window.filtrosActuales = {
        id: "${filtroId != null ? filtroId : ''}",
        entidad: "${filtroEntidad != null ? filtroEntidad : ''}",
        responsable: "${filtroResponsable != null ? filtroResponsable : ''}",
        tienda: "${filtroTienda != null ? filtroTienda : ''}"
    };
</script>

<aside class="panel-detalle-lateral">
    <header class="panel-lateral-header header-filtros">
        <div class="panel-lateral-info">
            <h2 class="panel-lateral-titulo">Filtros</h2>
            <p class="panel-lateral-subtitulo subtitulo-filtros">Búsqueda de voluntarios</p>
        </div>
        <div class="panel-lateral-acciones">
            <a href="${pageContext.request.contextPath}/voluntarios?campaniaId=${campaniaId}" class="btn-cerrar-lateral" aria-label="Cerrar panel" style="text-decoration: none;" title="Cerrar filtros">X</a>
        </div>
    </header>

    <form action="${pageContext.request.contextPath}/voluntarios" method="GET" class="panel-detalle-contenido">
        <input type="hidden" name="campaniaId" value="${campaniaId}">
        <input type="hidden" name="verFiltros" value="true">

        <div class="detalle-bloque">
            <span class="texto-azul">ID Voluntario:</span>
            <input type="number" name="filtroId" class="input-datos" value="${filtroId}" placeholder="Ej: 123" style="width: 100%;">
        </div>

        <div class="detalle-bloque">
            <span class="texto-azul">Entidad colaboradora:</span>
            <select id="filtroEntidad" name="filtroEntidad" class="select-datos" style="width: 100%;">
                <option value="">Todas las entidades</option>
            </select>
        </div>

        <div class="detalle-bloque">
            <span class="texto-azul">Responsable:</span>
            <select id="filtroResponsable" name="filtroResponsable" class="select-datos" style="width: 100%;">
                <option value="">Todos los responsables</option>
            </select>
        </div>

        <div class="detalle-bloque">
            <span class="texto-azul">Tienda asignada:</span>
            <select id="filtroTienda" name="filtroTienda" class="select-datos" style="width: 100%;">
                <option value="">Todas las tiendas</option>
            </select>
        </div>

        <div style="margin-top: 2rem; display: flex; flex-direction: column; gap: 10px;">
            <button type="submit" class="acciones-tabla__btn" style="width: 100%; text-align: center; padding: 12px; background: #2c398b; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
                Aplicar Filtros
            </button>
            <a href="${pageContext.request.contextPath}/voluntarios?campaniaId=${campaniaId}&verFiltros=true" style="display: block; width: 100%; text-align: center; padding: 10px; border: 1px solid #2c398b; color: #2c398b; border-radius: 4px; text-decoration: none; font-weight: bold; cursor: pointer; box-sizing: border-box;">
                Limpiar filtros
            </a>
        </div>
    </form>
</aside>