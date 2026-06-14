<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>

<%-- Parte de Sofía Sí Villalba Jiménez --%>
<%-- Se han reutilizado recursos del proyecto por parte de clientes, pero refactorizados --%>

<section 
    id="entidades" 
    data-id-campania-actual="${campaniaSelec.id}"
    data-modificable="${modoEdicion}"
>

    <%-- Encabezado --%>
    <div class="encabezado">
        <div class="filtro-campania-container">
            <div class="boton-filtro">
                <button id="filtrar">&nbsp;</button>
            </div>
            <div class="cambiar-campania">
                <button>Seleccionar otra campaña</button>
            </div>
        </div>
        <h1>${campaniaSelec.nombre}</h1>
        <div class="help-container">
            <p>Para ver más información sobre la entidad colaboradora, haga doble click sobre su fila correspondiente</p>
            <div class="simbolo"><p>?</p></div>
        </div>
    </div>

    <%-- Tabla --%>
    <div class="contenedor-tabla-scroll">
        <table>
            <thead>
                <tr>
                    <td>Colaborador</td>
                    <td>Domicilio</td>
                    <td>Colabora en</td>
                    <td>Contacto Principal</td>
                    <td colspan="2">Tienda(s) asignada(s)</td>
                </tr>
            </thead>
            <tbody id="tabla-body">
                <%-- Iteramos sobre el Mapa que nos manda el Controller (Campania -> Lista de Entidades) --%>
                <c:forEach items="${mapaEntidadesFiltradas}" var="entry">
                    
                    <%-- Si estamos en modo 'Todas las campañas', pintamos la fila separadora --%>
                    <c:if test="${modoTodasCampanias}">
                        <tr class="fila-seccion-campania">
                            <td colspan="5" style="background-color: #e2e8f0; color: #1e3a8a; font-weight: bold; text-align: left; padding: 10px 20px;">
                                CAMPAÑA: ${entry.key.nombre}
                            </td>
                        </tr>
                    </c:if>

                    <%-- Iteramos sobre las entidades de esta campaña --%>
                    <c:forEach items="${entry.value}" var="e">
                        <tr data-id-entidad-detalle="${e.id}">
                            <td>${e.nombre}</td>
                            <td>${e.direccion != null ? e.direccion.calle : "-"}, ${e.direccion != null ? e.direccion.numero : "-"}</td>
                            <td>${e.direccion != null ? e.direccion.zonaGeografica : "-"}</td>
                            <td>
                                ${e.contactoPrincipal.contacto.nombre}
                                <br>
                                <c:choose>
                                    <c:when test="${e.contactoPrincipal.contacto.email != null}">
                                        <small>${e.contactoPrincipal.contacto.email}</small>
                                    </c:when>
                                    <c:when test="${e.contactoPrincipal.contacto.telefono != null}">
                                        <small>${e.contactoPrincipal.contacto.telefono}</small>
                                    </c:when>
                                    <c:otherwise>
                                        <small>No tiene ningún contacto asociado</small>
                                    </c:otherwise>
                                </c:choose>
                            </td>
                            <td>
                                <%-- Si tiene tiendas --%>
                                <c:choose>
                                    <c:when test="${e.nombresTiendas != null && e.nombresTiendas.size() > 0}">
                                        <div class="tiendas-resumen">
                                            ${e.nombresTiendas.get(0)}
                                            <c:if test="${e.nombresTiendas.size() > 1}">
                                                <b>(+${e.nombresTiendas.size() - 1})</b>
                                            </c:if>
                                        </div>
                                        <div class="tiendas-lista-completa" style="display: none;">
                                            <c:forEach var="tienda" items="${e.nombresTiendas}">
                                                <div style="margin-bottom: 10px;">- ${tienda}</div>
                                                <br>
                                            </c:forEach>
                                        </div>
                                    </c:when>
                                    <c:otherwise>
                                        <p>Sin Tiendas</p>
                                    </c:otherwise>
                                </c:choose>
                            </td>
                            <c:choose>
                                <c:when test="${e.nombresTiendas != null && e.nombresTiendas.size() > 1}">
                                    <td class="desplegar boton-desplegar-tiendas-js">&nbsp;</td>
                                </c:when>
                                <c:otherwise>
                                    <td class="desplegar">&nbsp;</td>
                                </c:otherwise>
                            </c:choose>
                        </tr>
                    </c:forEach>
                </c:forEach>
                
                <%-- Mensaje por si el filtro no devuelve nada --%>
                <c:if test="${empty mapaEntidadesFiltradas}">
                    <tr>
                        <td colspan="6" style="text-align: center; padding: 20px;">No se encontraron entidades con estos filtros.</td>
                    </tr>
                </c:if>
            </tbody>
        </table>
    </div>

    <%-- Botones inferiores --%>
    <div class="pie-pagina">
        <div class="container-interactuar">
            <div id="btn-eliminar-colaborador" class="${modoEdicion != null && modoEdicion ? 'activado' : 'desactivado'}" title="Debes primero seleccionar un colaborador" style="cursor: pointer;">Eliminar colaborador</div>
            <div id="btn-modificar-colaborador" class="${modoEdicion != null && modoEdicion ? 'activado' : 'desactivado'}" title="Debes primero seleccionar un colaborador">Modificar colaborador</div>
            <div id="btn-abrir-registro" class="activado" style="cursor: pointer;">Añadir colaborador</div>
        </div>
        <div class="csv activado">&nbsp;</div>
    </div>

    <%-- Interfaz de seleccionar otra campaña (oculta en principio) --%>
    <div id="modal-campanias" class="modal-overlay-campanias" style="display: none;">
        <div class="modal-content">
            <header class="modal-header">
                <h2>Seleccionar Campaña</h2>
                <button id="cerrar-selector" class="btn-cerrar-modal">X</button>
            </header>
            <div id="lista-campanias" class="campanias-grid"></div>
        </div>
    </div>
    

</section>