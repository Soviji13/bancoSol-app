<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<div id="datos-contexto" data-campania-id="${campaniaId}" style="display: none;"></div>

<div class="contenido">
    <div class="contenido__topbar">
        <div class="filtro">
            <button class="boton-icono" type="button" aria-label="Filtrar">
                <img src="${pageContext.request.contextPath}/assets/embudo.png" alt="Filtro" />
                <span class="boton-icono__contador" style="display:none;">0</span>
            </button>
        </div>

        <div class="seleccionar-campania">
            <button id="btn-seleccionar-campania" class="boton-secundario" type="button">
                Seleccionar otra campaña
            </button>
        </div>

        <div class="historial-tiendas">
            <span><h1 id="historial_titulo" class="historial_titulo">Listado de Tiendas en "<c:out value='${campaniaSelec.nombre}' />"</h1></span>
        </div>

        <div class="seccion-ayuda">
            <p class="contenido__ayuda">Para ver más información sobre la tienda, haga click sobre su fila correspondiente.</p>
            <button class="boton-ayuda">?</button>
        </div>
    </div>

    <div class="tabla-contenedor">
        <table class="tabla-tiendas">
            <thead>
            <tr>
                <th scope="col">Tienda</th>
                <th scope="col">Domicilio</th>
                <th scope="col">Localidad</th>
                <th scope="col" colspan="2">Resp. Entidad</th>
                <th scope="col">Participa</th>
                <th scope="col">Puntos</th>
            </tr>
            </thead>
            <tbody id="tabla-tiendas-body">
            <c:forEach var="tienda" items="${tiendasSelec}">
                <tr class="fila-tienda" data-id="${tienda.id}" style="cursor: pointer;">
                    <td><strong><c:out value="${tienda.nombre}" /></strong></td>
                    <td><c:out value="${tienda.calle} ${tienda.numero}" /></td>
                    <td><c:out value="${tienda.localidad}" /></td>

                        <%-- COLUMNA ACORDEÓN: Responsables y Entidades --%>
                    <td>
                        <c:choose>
                            <c:when test="${not empty tienda.responsablesLista}">
                                <div class="resp-resumen">
                                    <c:out value="${tienda.responsablesLista[0].nombreResponsable} (${tienda.responsablesLista[0].nombreEntidad})" />
                                    <c:if test="${tienda.responsablesLista.size() > 1}">
                                        <b>(+${tienda.responsablesLista.size() - 1})</b>
                                    </c:if>
                                </div>
                                <c:if test="${tienda.responsablesLista.size() > 1}">
                                    <div class="resp-lista-completa" style="display: none; font-size: 0.82rem; margin-top: 5px; color: #555555; text-align: center;">
                                        <c:forEach var="resp" items="${tienda.responsablesLista}">
                                            <div>• <c:out value="${resp.nombreResponsable}" />
                                                <span style="color:var(--color-principal, #2c398b); font-size:0.75rem;">(<c:out value="${resp.nombreEntidad}" />)</span>
                                            </div>
                                        </c:forEach>
                                    </div>
                                </c:if>
                            </c:when>
                            <c:otherwise>
                                <div class="resp-resumen">Sin responsable (Sin entidad)</div>
                            </c:otherwise>
                        </c:choose>
                    </td>

                        <%-- FLECHA DESPLEGABLE (Solo si hay más de 1) --%>
                    <td>
                        <c:if test="${tienda.responsablesLista.size() > 1}">
                            <img src="${pageContext.request.contextPath}/assets/keyboard_double_arrow_down.svg" class="btn-desplegar-resp" style="transition: transform 0.2s; cursor: pointer;">
                        </c:if>
                    </td>

                    <td>
                        <input type="checkbox" disabled <c:if test="${tienda.participaCampaniaActiva}">checked</c:if>>
                    </td>

                    <td><c:out value="${tienda.puntosRecogida}" /></td>
                </tr>
            </c:forEach>

            <c:if test="${empty tiendasSelec}">
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem; color: #666;">
                        No se han encontrado tiendas registradas para esta campaña.
                    </td>
                </tr>
            </c:if>
            </tbody>
        </table>
    </div>

    <%--BOTONES DE ACCIONES--%>
    <div class="acciones-tabla" id="acciones-normales">
        <button class="acciones-tabla__btn" id="btn-eliminar" type="button">Eliminar tienda</button>
        <button class="acciones-tabla__btn" id="btn-modificar" type="button">Modificar tienda</button>
        <button class="acciones-tabla__btn" id="btn-anadir" type="button">Añadir tienda</button>
        <button class="acciones-tabla__btn" id="btn-exportar" type="button">
            <img src="${pageContext.request.contextPath}/assets/file_export.svg" alt="Exportar">
        </button>
    </div>

    <%-- MODAL DE CAMPAÑAS--%>
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