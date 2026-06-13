<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<section class="panel-filtros">
    <header class="panel-filtros__cabecera">
        <div>
            <h2>Filtros de búsqueda</h2>

            <c:choose>
                <c:when test="${not empty campaniaSeleccionada}">
                    <span class="badge-id">
                        Campaña: ${campaniaSeleccionada.nombre}
                    </span>
                </c:when>

                <c:otherwise>
                    <span class="badge-id">
                        Ajuste de resultados
                    </span>
                </c:otherwise>
            </c:choose>
        </div>

        <a href="${pageContext.request.contextPath}/coordinadores"
           class="panel-filtros__cerrar"
           aria-label="Cerrar filtros">
            ←
        </a>
    </header>

    <form id="form-filtros-coordinadores"
          class="panel-filtros__contenido"
          action="${pageContext.request.contextPath}/coordinadores"
          method="get">

        <input type="hidden" name="mostrarFiltros" value="true" />

        <section class="panel-filtros__bloque border-bottom">

            <div class="panel-filtros__campo">
                <label for="filtro-nombre">Nombre:</label>
                <input id="filtro-nombre"
                       name="nombre"
                       class="input-linea"
                       type="text"
                       value="${param.nombre}"
                       placeholder="Buscar por nombre..." />
            </div>

            <div class="panel-filtros__campo">
                <label for="filtro-campania">Campaña:</label>

                <select id="filtro-campania"
                        name="campaniaId"
                        class="input-linea">
                    <option value=""
                            <c:if test="${empty campaniaIdSeleccionada}">selected</c:if>>
                        Todas las campañas
                    </option>

                    <c:forEach var="campania" items="${campanias}">
                        <option value="${campania.id}"
                                <c:if test="${campania.id == campaniaIdSeleccionada}">selected</c:if>>
                                ${campania.nombre}
                        </option>
                    </c:forEach>
                </select>
            </div>

            <div class="panel-filtros__campo">
                <label for="filtro-tiendas">Nº tiendas:</label>
                <input id="filtro-tiendas"
                       name="tiendas"
                       class="input-linea"
                       type="number"
                       min="0"
                       value="${param.tiendas}"
                       placeholder="Ej: 3" />
            </div>
        </section>

        <section class="panel-filtros__acciones">
            <button class="btn-guardar-lateral"
                    type="submit">
                Aplicar filtros
            </button>

            <a class="btn-limpiar-filtros"
               href="${pageContext.request.contextPath}/coordinadores?mostrarFiltros=true">
                Limpiar todos los filtros
            </a>
        </section>
    </form>
</section>