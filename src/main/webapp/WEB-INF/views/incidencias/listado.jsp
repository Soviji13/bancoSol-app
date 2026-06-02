<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>

<section class="incidencias">

    <div class="incidencias__superior">

        <div class="incidencias__acciones">
            <a id="btn-filtro-incidencias"
               class="incidencias__btn-icono"
               href="${pageContext.request.contextPath}/incidencias?mostrarFiltros=true&estado=${estadoSeleccionado}&asunto=${asuntoSeleccionado}&tipo=${tipoSeleccionado}&responsable=${responsableSeleccionado}"
               aria-label="Mostrar filtros">

                <img src="${pageContext.request.contextPath}/assets/filter_alt.svg"
                     alt="Filtrar" />
            </a>

            <a class="incidencias__btn-anadir"
               href="${pageContext.request.contextPath}/incidencias/nuevo">
                Añadir incidencia
            </a>
        </div>

        <div class="incidencias__titulo">
            <h1>Todas las incidencias</h1>
            <p>Para ver más información sobre una incidencia, haz doble click sobre su fila.</p>
        </div>

        <button class="incidencias__ayuda"
                type="button"
                aria-label="Ayuda">
            ?
        </button>

    </div>

    <div class="incidencias__tabla-contenedor">

        <c:choose>
            <c:when test="${empty incidencias}">
                <div class="incidencias__vacio">
                    No hay incidencias registradas.
                </div>
            </c:when>

            <c:otherwise>
                <table class="incidencias__tabla">
                    <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Asunto</th>
                        <th>Estado</th>
                        <th>Reportado por</th>
                        <th>Tipo</th>
                    </tr>
                    </thead>

                    <tbody>
                    <c:forEach var="incidencia" items="${incidencias}">
                        <tr class="fila-incidencia incidencias__fila"
                            data-id="${incidencia.id}">

                            <td>
                                <c:choose>
                                    <c:when test="${not empty incidencia.fechaHora}">
                                        ${fn:substring(incidencia.fechaHora, 0, 10)}
                                    </c:when>
                                    <c:otherwise>
                                        -
                                    </c:otherwise>
                                </c:choose>
                            </td>

                            <td class="incidencias__asunto">
                                <c:out value="${incidencia.asunto}" />
                            </td>

                            <td>
                                <c:choose>
                                    <c:when test="${incidencia.estado == 'RESUELTA'}">
                                        <span class="incidencias__estado incidencias__estado--resuelta">
                                            RESUELTA
                                        </span>
                                    </c:when>

                                    <c:when test="${incidencia.estado == 'LEIDA'}">
                                        <span class="incidencias__estado incidencias__estado--leida">
                                            LEÍDA
                                        </span>
                                    </c:when>

                                    <c:when test="${incidencia.estado == 'PENDIENTE'}">
                                        <span class="incidencias__estado incidencias__estado--pendiente">
                                            PENDIENTE
                                        </span>
                                    </c:when>

                                    <c:otherwise>
                                        <span class="incidencias__estado incidencias__estado--ninguno">
                                            -
                                        </span>
                                    </c:otherwise>
                                </c:choose>
                            </td>

                            <td>
                                <c:choose>
                                    <c:when test="${not empty incidencia.reportadoPorNombre}">
                                        <c:out value="${incidencia.reportadoPorNombre}" />
                                    </c:when>
                                    <c:otherwise>
                                        -
                                    </c:otherwise>
                                </c:choose>
                            </td>

                            <td>
                                <c:choose>
                                    <c:when test="${incidencia.reportadoPorTipo == 'RESPONSABLE_TIENDA'}">
                                        Responsable tienda
                                    </c:when>

                                    <c:when test="${incidencia.reportadoPorTipo == 'RESPONSABLE_ENTIDAD'}">
                                        Responsable entidad
                                    </c:when>

                                    <c:otherwise>
                                        -
                                    </c:otherwise>
                                </c:choose>
                            </td>

                        </tr>
                    </c:forEach>
                    </tbody>
                </table>
            </c:otherwise>
        </c:choose>

    </div>

    <div class="incidencias__acciones-inferiores">

        <button id="btn-ver-incidencia"
                class="incidencias__accion"
                type="button"
                disabled>
            Ver incidencia
        </button>

        <button id="btn-editar-incidencia"
                class="incidencias__accion"
                type="button"
                disabled>
            Modificar incidencia
        </button>

        <form id="form-borrar-incidencia"
              class="incidencias__form-borrar"
              method="post"
              action="${pageContext.request.contextPath}/incidencias/borrar">

            <input id="incidencia-id-borrar"
                   type="hidden"
                   name="id" />

            <button id="btn-borrar-incidencia"
                    class="incidencias__accion"
                    type="submit"
                    disabled>
                Eliminar incidencia
            </button>
        </form>

    </div>

</section>