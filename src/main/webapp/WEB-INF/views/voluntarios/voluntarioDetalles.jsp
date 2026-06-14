<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<aside class="panel-detalle-lateral">
    <header class="panel-lateral-header">
        <div class="panel-lateral-info">
            <h2 class="panel-lateral-titulo">Voluntario ID: <c:out value="${voluntarioSelec.id}" /></h2>
            <p class="panel-lateral-subtitulo">Información detallada</p>
        </div>
        <div class="panel-lateral-acciones">
            <%--enlace nativo para cerrar recargando lista limpia!!!!--%>
            <a href="${pageContext.request.contextPath}/voluntarios?campaniaId=${campaniaId}" class="btn-cerrar-lateral" style="text-decoration: none;" aria-label="Cerrar panel" title="Cerrar panel">X</a>
        </div>
    </header>

    <div class="panel-detalle-contenido">

        <div class="detalle-bloque">
            <span class="texto-azul">Entidad colaboradora:</span>
            <c:out value="${voluntarioSelec.perteneceA}" default="Sin entidad"/>
        </div>

        <div class="detalle-bloque">
            <div class="mb-medio">
                <span class="texto-azul">Responsable:</span>
                <c:out value="${voluntarioSelec.nombreResponsable}" default="Sin responsable asignado"/>
            </div>
            <div class="detalle-grupo-filas">
                <div>
                    <span class="texto-azul">Teléfono:</span>
                    <c:out value="${voluntarioSelec.telefono}" default="---"/>
                </div>
                <div>
                    <span class="texto-azul">Email:</span>
                    <c:out value="${voluntarioSelec.email}" default="---"/>
                </div>
            </div>
        </div>

        <%--eliminados bloques de direccion y distrito q no usamos!!!!--%>

        <div class="detalle-bloque">
            <span class="texto-azul">Turnos asignados:</span>
            <div class="contenedor-tablas-turnos">
                <c:choose>
                    <c:when test="${not empty voluntarioSelec.asignaciones}">
                        <c:forEach var="asig" items="${voluntarioSelec.asignaciones}">
                            <div class="grupo-tienda-turnos">
                                <div class="titulo-tienda-turnos">
                                    Tienda: <c:out value="${asig.tiendaNombre}" />
                                </div>
                                <table class="tabla-turnos-detalle">
                                    <tbody>
                                    <c:forEach var="turno" items="${asig.turnos}">
                                        <tr>
                                            <td class="celda-dia texto-azul"><c:out value="${turno.dia}" /></td>
                                            <td class="celda-franja"><c:out value="${turno.franjaHoraria}" /></td>
                                        </tr>
                                    </c:forEach>
                                    </tbody>
                                </table>
                            </div>
                        </c:forEach>
                    </c:when>
                    <c:otherwise>
                        <div class="texto-sin-turnos">Sin turnos asignados</div>
                    </c:otherwise>
                </c:choose>
            </div>
        </div>

        <div class="detalle-bloque bloque-observaciones">
            <span class="texto-azul">Observaciones:</span>
            <div class="caja-observaciones">
                <c:out value="${not empty voluntarioSelec.observaciones ? voluntarioSelec.observaciones : 'Sin observaciones.'}" />
            </div>
        </div>

    </div>
</aside>