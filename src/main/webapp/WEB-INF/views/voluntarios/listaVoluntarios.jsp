<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<%--guardamos json para exportar a csv--%>
<script>
    window.voluntariosParaExportar = ${voluntariosJson != null ? voluntariosJson : '[]'};
</script>

<div class="contenido">
    <div class="contenido__topbar">
        <div class="filtro">
            <button class="boton-icono" id="btn-filtro-voluntarios" type="button" aria-label="Filtrar">
                <img src="${pageContext.request.contextPath}/assets/embudo.png" alt="Filtro" />
                <span class="boton-icono__contador" style="display:none;">0</span>
            </button>
        </div>

        <div class="historial-tiendas" style="flex-grow: 1; text-align: center;">
            <span><h1 class="historial_titulo">Listado de Voluntarios</h1></span>
        </div>

        <div class="seccion-ayuda">
            <p class="contenido__ayuda">Haga click en una fila para más información.</p>
            <button class="boton-ayuda">?</button>
        </div>
    </div>

    <div class="tabla-contenedor">
        <table class="tabla-voluntarios">
            <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Responsable</th>
                <th scope="col">Pertenecen a</th>
                <th scope="col" class="col-tiendas-turnos">Tiendas y Turnos</th>
            </tr>
            </thead>
            <tbody id="tabla-voluntarios-body">
            <c:forEach var="vol" items="${voluntariosSelec}">
                <tr class="fila-voluntario" data-id="${vol.id}" style="cursor: pointer;">
                    <td><strong><c:out value="${vol.id}" /></strong></td>
                    <td><c:out value="${vol.nombreResponsable}" /></td>
                    <td><c:out value="${vol.perteneceA}" /></td>

                        <%--celda con desplegable de asignaciones igual a tu componente PopoverAsignaciones de react!!!!--%>
                    <td class="celda-asignaciones">
                        <c:choose>
                            <c:when test="${empty vol.asignaciones}">
                                <span class="texto-sin-asignaciones" style="color: #888; font-style: italic;">Sin asignaciones</span>
                            </c:when>
                            <c:otherwise>
                                <button type="button" class="btn-desplegar-asignaciones" data-vol-id="${vol.id}">
                                    <span>${vol.asignaciones.size()} Tienda/s asignadas</span>
                                    <span class="flecha-desplegable">▾</span>
                                </button>

                                <%--popover q se mostrara con js--%>
                                <div class="popover-asignaciones oculto" id="popover-${vol.id}">
                                    <div class="popover-flecha"></div>
                                    <div class="popover-contenido">
                                        <c:forEach var="asig" items="${vol.asignaciones}">
                                            <div class="popover-item">
                                                <strong><c:out value="${asig.tiendaNombre}" /></strong>
                                                <ul>
                                                    <c:forEach var="turno" items="${asig.turnos}">
                                                        <li><c:out value="${turno.dia} - ${turno.franjaHoraria}" /></li>
                                                    </c:forEach>
                                                </ul>
                                            </div>
                                        </c:forEach>
                                    </div>
                                </div>
                            </c:otherwise>
                        </c:choose>
                    </td>
                </tr>
            </c:forEach>

            <c:if test="${empty voluntariosSelec}">
                <tr>
                    <td colspan="4" style="text-align: center; padding: 2rem; color: #666;">
                        No hay voluntarios registrados.
                    </td>
                </tr>
            </c:if>
            </tbody>
        </table>
    </div>

    <%--botones inferiores--%>
    <div class="acciones-tabla" id="acciones-normales">
        <button class="acciones-tabla__btn" id="btn-eliminar-voluntario" type="button">Eliminar</button>
        <button class="acciones-tabla__btn" id="btn-modificar-voluntario" type="button">Modificar</button>
        <button class="acciones-tabla__btn" id="btn-anadir-voluntario" type="button">Añadir voluntario</button>
        <button class="acciones-tabla__btn" id="btn-exportar-voluntarios" type="button">
            <img src="${pageContext.request.contextPath}/assets/file_export.svg" alt="Exportar">
        </button>
    </div>
</div>