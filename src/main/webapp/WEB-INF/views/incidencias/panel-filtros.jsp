<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<section class="panel-filtro">

    <div class="panel-filtro__cabecera">
        <div>
            <h1>Filtros de búsqueda</h1>
            <p>Ajuste de resultados</p>
        </div>

        <a class="panel-filtro__cerrar"
           href="${pageContext.request.contextPath}/incidencias"
           aria-label="Cerrar filtros">
            ←
        </a>
    </div>

    <form method="get"
          action="${pageContext.request.contextPath}/incidencias"
          class="panel-filtro__form">

        <input type="hidden" name="mostrarFiltros" value="true" />

        <div class="panel-filtro__campo">
            <label for="estado">Estado:</label>

            <select id="estado" name="estado">
                <option value="">Todas</option>

                <option value="PENDIENTE"
                        <c:if test="${estadoSeleccionado == 'PENDIENTE'}">selected</c:if>>
                    Pendiente
                </option>

                <option value="LEIDA"
                        <c:if test="${estadoSeleccionado == 'LEIDA'}">selected</c:if>>
                    Leída
                </option>

                <option value="RESUELTA"
                        <c:if test="${estadoSeleccionado == 'RESUELTA'}">selected</c:if>>
                    Resuelta
                </option>
            </select>
        </div>

        <div class="panel-filtro__campo">
            <label for="asunto">Asunto:</label>

            <input id="asunto"
                   name="asunto"
                   type="text"
                   value="${asuntoSeleccionado}"
                   placeholder="Buscar por asunto..." />
        </div>

        <div class="panel-filtro__campo">
            <label for="tipo">Tipo:</label>

            <select id="tipo" name="tipo">
                <option value="">Todos</option>

                <option value="RESPONSABLE_TIENDA"
                        <c:if test="${tipoSeleccionado == 'RESPONSABLE_TIENDA'}">selected</c:if>>
                    Responsable tienda
                </option>

                <option value="RESPONSABLE_ENTIDAD"
                        <c:if test="${tipoSeleccionado == 'RESPONSABLE_ENTIDAD'}">selected</c:if>>
                    Responsable entidad
                </option>
            </select>
        </div>

        <div class="panel-filtro__campo">
            <label for="responsable">Responsable:</label>

            <input id="responsable"
                   name="responsable"
                   type="text"
                   value="${responsableSeleccionado}"
                   placeholder="Buscar responsable..." />
        </div>

        <div class="panel-filtro__acciones">
            <button type="submit" class="panel-filtro__aplicar">
                Aplicar filtros
            </button>

            <a href="${pageContext.request.contextPath}/incidencias?mostrarFiltros=true"
               class="panel-filtro__limpiar">
                Limpiar todos los filtros
            </a>
        </div>

    </form>

</section>