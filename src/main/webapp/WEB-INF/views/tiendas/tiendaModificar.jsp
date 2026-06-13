<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<aside class="panel-tienda" aria-labelledby="titulo-tienda">
    <form action="${pageContext.request.contextPath}/tiendas/actualizar" method="POST" id="form-modificar-tienda" style="display: flex; flex-direction: column; height: 100%;">

        <input type="hidden" name="tiendaId" value="${tiendaSelec.id}" />
        <input type="hidden" name="campaniaId" value="${campaniaId}" />

        <header class="panel-tienda__cabecera" style="padding: 10px 1.5rem; background-color: #f8f9fa;">
            <div class="panel-tienda__info-principal" style="padding: 0;">
                <input type="text" name="nombre" value="${tiendaSelec.nombre}" required
                       style="font-size: 1.2rem; font-weight: bold; border: 1px solid var(--color-borde-suave); padding: 4px; width: 100%; border-radius: 4px; color: var(--color-etiqueta-azul); margin-bottom: 5px;" placeholder="Nombre de la tienda"/>

                <div style="display:flex; align-items:center; gap: 5px; font-size: 0.9rem; color: #666;">
                    Puntuación:
                    <input type="number" name="puntosRecogida" value="${tiendaSelec.puntosRecogida}" min="0"
                           style="width: 70px; padding: 2px 5px; border: 1px solid var(--color-borde-suave); border-radius: 4px;" />
                </div>
            </div>
            <div class="panel-tienda__acciones" style="align-items: flex-start;">
                <button type="button" id="btn-cerrar-panel" class="panel-tienda__cerrar" aria-label="Cerrar panel" title="Cancelar edición">X</button>
            </div>
        </header>

        <div class="panel-tienda__scroll">
            <div class="caja-datos">

                <div class="fila">
                    <div class="col-mitad celda">
                        <span class="etiqueta-azul" style="display:block; margin-bottom: 5px;">CP:</span>
                        <select name="cpId" style="width: 100%; padding: 6px; border: 1px solid var(--color-borde-suave); border-radius: 4px;">
                            <option value="">Seleccione CP...</option>
                            <c:forEach var="cp" items="${cps}">
                                <option value="${cp.id}" <c:if test="${cp.codigo == tiendaSelec.codigoPostal}">selected</c:if>>
                                        ${cp.codigo}
                                </option>
                            </c:forEach>
                        </select>
                    </div>
                    <div class="col-mitad celda">
                        <span class="etiqueta-azul" style="display:block; margin-bottom: 5px;">Localidad:</span>
                        <select name="localidadId" id="select-localidad" style="width: 100%; padding: 6px; border: 1px solid var(--color-borde-suave); border-radius: 4px;">
                            <option value="">Seleccione Localidad...</option>
                            <c:forEach var="loc" items="${localidades}">
                                <option value="${loc.id}" data-nombre="${loc.nombre}" <c:if test="${loc.nombre == tiendaSelec.localidad}">selected</c:if>>
                                        ${loc.nombre}
                                </option>
                            </c:forEach>
                        </select>
                    </div>
                </div>

                <div class="fila">
                    <div class="col-completa celda">
                        <span class="etiqueta-azul" style="display:block; margin-bottom: 5px;">Distrito:</span>
                        <select name="distritoId" id="select-distrito" disabled style="width: 100%; padding: 6px; border: 1px solid var(--color-borde-suave); border-radius: 4px; background-color: #eee;">
                            <option value="">(Solo válido si es Málaga capital)</option>
                            <%-- Cuando integres los distritos, añade aquí el bucle c:forEach --%>
                        </select>
                    </div>
                </div>

                <div class="fila">
                    <div class="col-completa celda">
                        <span class="etiqueta-azul" style="display:block; margin-bottom: 5px;">Calle:</span>
                        <input type="text" name="calle" value="${tiendaSelec.calle}" style="width: 100%; padding: 6px; border: 1px solid var(--color-borde-suave); border-radius: 4px;" />
                    </div>
                </div>

                <div class="fila">
                    <div class="col-mitad celda">
                        <span class="etiqueta-azul" style="display:block; margin-bottom: 5px;">Número:</span>
                        <input type="number" name="numero" value="${tiendaSelec.numero}" min="0" style="width: 100%; padding: 6px; border: 1px solid var(--color-borde-suave); border-radius: 4px;" />
                    </div>
                    <div class="col-mitad celda">
                        <span class="etiqueta-azul" style="display:block; margin-bottom: 5px;">Franq.:</span>
                        <input type="checkbox" name="esFranquicia" value="true" class="checkbox-personalizado" style="cursor:pointer;" <c:if test="${tiendaSelec.esFranquicia}">checked</c:if>>
                    </div>
                </div>

                <div class="fila">
                    <div class="col-completa celda">
                        <span class="etiqueta-azul" style="display:block; margin-bottom: 5px;">Responsable de tienda:</span>
                        <div style="display:flex; gap:10px; width:100%;">
                            <select name="responsableId" style="flex-grow:1; padding: 6px; border: 1px solid var(--color-borde-suave); border-radius: 4px;">
                                <option value="">Sin asignar...</option>
                                <c:forEach var="resp" items="${responsables}">
                                    <option value="${resp.id}" <c:if test="${resp.id == tiendaSelec.responsableTiendaId}">selected</c:if>>
                                            ${resp.nombre}
                                    </option>
                                </c:forEach>
                            </select>
                            <button type="button" id="btn-nuevo-resp" style="padding: 0 12px; background-color: var(--color-etiqueta-azul); color: white; border: none; border-radius: 4px; cursor:pointer; font-weight:bold;">
                                +
                            </button>
                        </div>
                    </div>
                </div>

                <div class="fila">
                    <div class="col-completa celda">
                        <span class="etiqueta-azul" style="display:block; margin-bottom: 5px;">Cadena:</span>
                        <select name="cadenaId" style="width: 100%; padding: 6px; border: 1px solid var(--color-borde-suave); border-radius: 4px;">
                            <option value="">Seleccione Cadena...</option>
                            <c:forEach var="cadena" items="${cadenas}">
                                <option value="${cadena.id}" <c:if test="${cadena.id == tiendaSelec.cadenaId}">selected</c:if>>
                                        ${cadena.id} - ${cadena.nombre}
                                </option>
                            </c:forEach>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div style="padding: 15px; text-align: center; border-top: 1px solid var(--color-borde-panel); background-color: #f8f9fa;">
            <button type="submit" style="padding: 10px 25px; background-color: #2c398b; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; width: 100%;">
                Guardar Cambios
            </button>
        </div>
    </form>
</aside>