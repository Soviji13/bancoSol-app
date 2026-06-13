<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<%--datos invisibles para el js!!!!--%>
<div id="datos-contexto" data-campania-id="${campaniaId}" style="display: none;"></div>

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

        <%--este es el boton de seleccionar campaña q te faltaba!!!!--%>
        <div class="seleccionar-campania">
            <button id="btn-seleccionar-campania" class="boton-secundario" type="button">
                Seleccionar otra campaña
            </button>
        </div>

        <div class="historial-tiendas">
            <span><h1 id="historial_titulo" class="historial_titulo">Listado de Voluntarios en "<c:out value='${campaniaSelec.nombre}' />"</h1></span>
        </div>

        <div class="seccion-ayuda">
            <p class="contenido__ayuda">Haga click en una fila para más información.</p>
            <button class="boton-ayuda">?</button>
        </div>
    </div>

    <div class="tabla-contenedor">
        <%--usamos clase tabla-tiendas para heredar el css q ya tenemos perfecto!!!!--%>
        <table class="tabla-tiendas">
            <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Responsable</th>
                <th scope="col">Pertenecen a</th>
                <th scope="col" colspan="2">Tiendas y Turnos</th>
            </tr>
            </thead>
            <tbody id="tabla-voluntarios-body">
            <c:forEach var="vol" items="${voluntariosSelec}">
                <tr class="fila-voluntario" data-id="${vol.id}" style="cursor: pointer;">
                    <td><strong><c:out value="${vol.id}" /></strong></td>
                    <td><c:out value="${vol.nombreResponsable}" /></td>
                    <td><c:out value="${vol.perteneceA}" /></td>

                        <%--acordeon integrado al estilo tiendas, mucho mas limpio!!!!--%>
                    <td>
                        <c:choose>
                            <c:when test="${not empty vol.asignaciones}">
                                <div class="resp-resumen">
                                    <c:out value="${vol.asignaciones[0].tiendaNombre}" />
                                    <c:if test="${vol.asignaciones.size() > 1}">
                                        <b>(+${vol.asignaciones.size() - 1})</b>
                                    </c:if>
                                </div>

                                <div class="resp-lista-completa" style="display: none; font-size: 0.82rem; margin-top: 5px; color: #555555; text-align: left;">
                                    <c:forEach var="asig" items="${vol.asignaciones}">
                                        <div style="margin-bottom: 6px;">
                                            <strong>• <c:out value="${asig.tiendaNombre}" /></strong>
                                            <ul style="margin: 2px 0 2px 15px; padding: 0; list-style-type: circle;">
                                                <c:forEach var="turno" items="${asig.turnos}">
                                                    <li><c:out value="${turno.dia} - ${turno.franjaHoraria}" /></li>
                                                </c:forEach>
                                            </ul>
                                        </div>
                                    </c:forEach>
                                </div>
                            </c:when>
                            <c:otherwise>
                                <div class="resp-resumen" style="color: #888; font-style: italic;">Sin asignaciones</div>
                            </c:otherwise>
                        </c:choose>
                    </td>

                        <%--celda ENTERA clicable para q sea facilisimo darle!!!!--%>
                    <td class="celda-desplegar" style="width: 50px; text-align: center; cursor: pointer;">
                        <c:if test="${not empty vol.asignaciones}">
                            <img src="${pageContext.request.contextPath}/assets/keyboard_double_arrow_down.svg" class="icono-flecha" style="transition: transform 0.2s; width: 24px; pointer-events: none;">
                        </c:if>
                    </td>
                </tr>
            </c:forEach>

            <c:if test="${empty voluntariosSelec}">
                <tr>
                    <td colspan="5" style="text-align: center; padding: 2rem; color: #666;">
                        No se han encontrado voluntarios registrados en esta campaña.
                    </td>
                </tr>
            </c:if>
            </tbody>
        </table>
    </div>

    <%--botones de accion calcados de tiendas--%>
    <div class="acciones-tabla" id="acciones-normales">
        <button class="acciones-tabla__btn" id="btn-eliminar-voluntario" type="button">Eliminar voluntario</button>
        <button class="acciones-tabla__btn" id="btn-modificar-voluntario" type="button" disabled>Modificar voluntario</button>
        <button class="acciones-tabla__btn" id="btn-anadir-voluntario" type="button">Añadir voluntario</button>
        <button class="acciones-tabla__btn" id="btn-exportar-voluntarios" type="button">
            <img src="${pageContext.request.contextPath}/assets/file_export.svg" alt="Exportar">
        </button>
    </div>

    <%--modal para saltar de campania q estaba perdido--%>
    <div id="modal-campanias" class="modal-overlay oculto">
        <div class="modal-caja modal-caja-campanias">
            <header class="modal-cabecera">
                <h3 style="margin:0; font-size:1.2rem;">Seleccionar Campaña</h3>
                <button type="button" id="btn-cerrar-campanias" class="modal-cerrar-x">X</button>
            </header>
            <div class="modal-cuerpo" id="lista-campanias">
            </div>
        </div>
    </div>
</div>