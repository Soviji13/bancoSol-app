<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<aside class="panel-tienda" aria-labelledby="titulo-tienda">
    <header class="panel-tienda__cabecera">
        <div class="panel-tienda__info-principal">
            <h1 id="titulo-tienda" class="panel-tienda__titulo"><c:out value="${tiendaSelec.nombre}" default="Sin nombre"/></h1>
            <p class="panel-tienda__subtitulo">Puntuación: <span id="detalle-puntuacion"><c:out value="${tiendaSelec.puntosRecogida}" default="0"/></span></p>
        </div>
        <div class="panel-tienda__acciones">
            <button id="btn-cerrar-panel" class="panel-tienda__cerrar" type="button" aria-label="Cerrar panel" title="Cerrar panel">X</button>
        </div>
    </header>

    <div class="panel-tienda__scroll">
        <div class="caja-datos">
            <div class="fila">
                <div class="col-mitad celda"><span class="etiqueta-azul">CP:</span>
                    <span id="detalle-cp" class="valor-dato"><c:out value="${tiendaSelec.codigoPostal}" default="---"/></span>
                </div>
                <div class="col-mitad celda"><span class="etiqueta-azul">Localidad:</span>
                    <span id="detalle-localidad" class="valor-dato"><c:out value="${tiendaSelec.localidad}" default="---"/></span>
                </div>
            </div>

            <div class="fila">
                <div class="col-completa celda"><span class="etiqueta-azul">Distrito:</span>
                    <span id="detalle-distrito" class="valor-dato"><c:out value="${tiendaSelec.distrito}" default="---"/></span>
                </div>
            </div>

            <div class="fila">
                <div class="col-completa celda"><span class="etiqueta-azul">Domicilio:</span>
                    <span id="detalle-domicilio" class="valor-dato">
                        <c:out value="${tiendaSelec.calle} ${tiendaSelec.numero}" default="---"/>
                    </span>
                </div>
            </div>

            <div class="fila">
                <div class="col-completa celda"><span class="etiqueta-azul">Zona geográfica:</span>
                    <span id="detalle-zona" class="valor-dato"><c:out value="${tiendaSelec.zonaGeografica}" default="---"/></span>
                </div>
            </div>

            <div class="fila">
                <div class="col-completa celda">
                    <span class="etiqueta-azul" id="label-participa">Participa en la campaña activa global:</span>
                    <input type="checkbox" id="detalle-participa" class="checkbox-personalizado" disabled <c:if test="${tiendaSelec.participaCampaniaActiva}">checked</c:if>>
                </div>
            </div>

            <div class="fila">
                <div class="col-completa celda">
                    <span class="etiqueta-azul">Entidades colaboradoras:</span>
                    <div class="valor-dato" style="width: 100%;">
                        <c:choose>
                            <c:when test="${not empty tiendaSelec.responsablesLista}">
                                <ul style="margin: 0; padding-left: 20px;">
                                    <c:forEach var="resp" items="${tiendaSelec.responsablesLista}">
                                        <li><c:out value="${resp.nombreEntidad}" /></li>
                                    </c:forEach>
                                </ul>
                            </c:when>
                            <c:otherwise>
                                <c:out value="${tiendaSelec.nombreEntidad}" default="---"/>
                            </c:otherwise>
                        </c:choose>
                    </div>
                </div>
            </div>

            <div class="fila">
                <div class="col-completa celda"><span class="etiqueta-azul">Responsable de tienda:</span>
                    <span id="detalle-responsable" class="valor-dato"><c:out value="${tiendaSelec.nombreResponsable}" default="No asignado"/></span>
                </div>
            </div>

            <div class="fila">
                <div class="col-mitad celda"><span class="etiqueta-azul">Cadena:</span>
                    <span id="detalle-cadena" class="valor-dato"><c:out value="${tiendaSelec.cadenaId} - ${tiendaSelec.nombreCadena}" default="---"/></span>
                </div>
                <div class="col-mitad celda"><span class="etiqueta-azul">ID_Tienda:</span>
                    <span id="detalle-id-tienda" class="valor-dato"><c:out value="${tiendaSelec.id}" default="--"/></span>
                </div>
            </div>

            <div class="fila">
                <div class="col-completa celda"><span class="etiqueta-azul">Franq.:</span>
                    <input type="checkbox" id="detalle-franquicia" class="checkbox-personalizado" disabled <c:if test="${tiendaSelec.esFranquicia}">checked</c:if>>
                </div>
            </div>

            <div class="fila fila-campana">
                <h2 class="titulo-seccion" id="label-turnos">Turnos de la campaña</h2>
                <table class="tabla-turnos">
                    <tbody id="tabla-turnos-body">
                    <tr><td colspan="2" style="text-align:center; color:#777;">Turnos (En desarrollo)</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</aside>