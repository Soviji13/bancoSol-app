<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<aside class="panel-tienda">
    <form action="${pageContext.request.contextPath}/tiendas" method="GET" id="form-filtros-tiendas" style="display: flex; flex-direction: column; height: 100%;">

        <%-- Campos ocultos necesarios para mantener el estado de la vista principal --%>
        <input type="hidden" name="campaniaId" value="${campaniaId}" />
        <input type="hidden" name="verFiltros" value="true" />

        <header class="panel-tienda__cabecera" style="padding: 10px 1.5rem; background-color: #f8f9fa;">
            <div class="panel-tienda__info-principal" style="padding: 0;">
                <h2 class="panel-tienda__titulo" style="font-size: 1.2rem; font-weight: bold; margin-bottom: 5px;">Filtros de tiendas</h2>
                <p class="panel-tienda__subtitulo" style="font-size: 0.9rem; color: #666;">Búsqueda avanzada</p>
            </div>
            <div class="panel-tienda__acciones" style="align-items: flex-start;">
                <a href="${pageContext.request.contextPath}/tiendas?campaniaId=${campaniaId}" id="btn-cerrar-filtros" class="panel-tienda__cerrar" style="display:flex; align-items:center; justify-content:center; text-decoration:none; color: #888;" aria-label="Cerrar panel" title="Cerrar filtros">X</a>
            </div>
        </header>

        <div class="panel-tienda__scroll">
            <div class="caja-datos">

                <div class="fila">
                    <div class="col-completa celda" style="flex-direction: column; align-items: flex-start;">
                        <span class="etiqueta-azul" style="margin-bottom: 5px; width: 100%;">Nombre:</span>
                        <input type="text" name="nombreFiltro" value="${nombreFiltro}" class="input-datos" style="width: 100%; max-width: 100%;" placeholder="Escribe el nombre...">
                    </div>
                </div>

                <div class="fila">
                    <div class="col-completa celda" style="flex-direction: column; align-items: flex-start;">
                        <span class="etiqueta-azul" style="margin-bottom: 5px; width: 100%;">Cadena:</span>
                        <select name="cadenaIdFiltro" class="select-datos" style="width: 100%; max-width: 100%;">
                            <option value="">Todas las cadenas</option>
                            <c:forEach var="cad" items="${cadenas}">
                                <option value="${cad.id}" <c:if test="${cad.id == cadenaIdFiltro}">selected</c:if>>${cad.nombre}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>

                <div class="fila">
                    <div class="col-completa celda" style="flex-direction: column; align-items: flex-start;">
                        <span class="etiqueta-azul" style="margin-bottom: 5px; width: 100%;">Localidad:</span>
                        <select name="localidadIdFiltro" id="filtro-localidad" class="select-datos" style="width: 100%; max-width: 100%;">
                            <option value="">Todas las localidades</option>
                            <c:forEach var="loc" items="${localidades}">
                                <option value="${loc.id}" data-nombre="${loc.nombre}" <c:if test="${loc.id == localidadIdFiltro}">selected</c:if>>${loc.nombre}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>

                <div class="fila" id="bloque-distrito">
                    <div class="col-completa celda" style="flex-direction: column; align-items: flex-start;">
                        <span class="etiqueta-azul" style="margin-bottom: 5px; width: 100%;">Distrito:</span>
                        <select name="distritoIdFiltro" id="filtro-distrito" class="select-datos" style="width: 100%; max-width: 100%;">
                            <option value="">Todos los distritos</option>
                            <c:forEach var="dist" items="${distritos}">
                                <option value="${dist.id}" <c:if test="${dist.id == distritoIdFiltro}">selected</c:if>>${dist.nombre}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>

                <div class="fila">
                    <div class="col-completa celda" style="flex-direction: column; align-items: flex-start;">
                        <span class="etiqueta-azul" style="margin-bottom: 5px; width: 100%;">Zona Geográfica:</span>
                        <select name="zonaGeoIdFiltro" class="select-datos" style="width: 100%; max-width: 100%;">
                            <option value="">Todas las zonas</option>
                            <c:forEach var="zona" items="${zonas}">
                                <option value="${zona.id}" <c:if test="${zona.id == zonaGeoIdFiltro}">selected</c:if>>${zona.nombre}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>

                <div class="fila">
                    <div class="col-completa celda" style="flex-direction: column; align-items: flex-start;">
                        <span class="etiqueta-azul" style="margin-bottom: 5px; width: 100%;">Colaborador:</span>
                        <select name="colaboradorIdFiltro" class="select-datos" style="width: 100%; max-width: 100%;">
                            <option value="">Todas las entidades</option>
                            <c:forEach var="colab" items="${colaboradores}">
                                <option value="${colab.id}" <c:if test="${colab.id == colaboradorIdFiltro}">selected</c:if>>${colab.nombre}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>

                <div class="fila">
                    <div class="col-completa celda" style="flex-direction: column; align-items: flex-start;">
                        <span class="etiqueta-azul" style="margin-bottom: 5px; width: 100%;">¿Es Franquicia?:</span>
                        <div class="radio-grupo-filtros" style="display: flex; gap: 15px; width: 100%;">
                            <label class="radio-label-filtros">
                                <input type="radio" name="esFranquiciaFiltro" value="TODAS" <c:if test="${empty esFranquiciaFiltro || esFranquiciaFiltro == 'TODAS'}">checked</c:if>> Todas
                            </label>
                            <label class="radio-label-filtros">
                                <input type="radio" name="esFranquiciaFiltro" value="SI" <c:if test="${esFranquiciaFiltro == 'SI'}">checked</c:if>> Sí
                            </label>
                            <label class="radio-label-filtros">
                                <input type="radio" name="esFranquiciaFiltro" value="NO" <c:if test="${esFranquiciaFiltro == 'NO'}">checked</c:if>> No
                            </label>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div style="padding: 15px; display: flex; flex-direction: column; gap: 10px; border-top: 1px solid var(--color-borde-panel); background-color: #f8f9fa;">
            <button type="submit" id="btn-aplicar-filtros" class="btn-filtrar-principal" style="width: 100%; padding: 10px; border-radius: 4px;">Aplicar Filtros</button>
            <a href="${pageContext.request.contextPath}/tiendas?campaniaId=${campaniaId}&verFiltros=true" id="btn-limpiar-filtros" class="btn-filtrar-limpiar" style="width: 100%; padding: 10px; border-radius: 4px; display:block; text-align:center; text-decoration:none; box-sizing:border-box;">Limpiar filtros</a>
        </div>
    </form>
</aside>