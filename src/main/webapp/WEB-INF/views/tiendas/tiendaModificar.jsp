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
                        <select name="cpId" style="width: 100%; padding: 6px; border: 1px solid var(--color-borde-suave); border-radius: 4px;" required>
                            <option value="" disabled <c:if test="${empty tiendaSelec.codigoPostal}">selected</c:if>>Seleccione CP...</option>
                            <c:forEach var="cp" items="${cps}">
                                <option value="${cp.id}" <c:if test="${cp.codigo == tiendaSelec.codigoPostal}">selected</c:if>>
                                        ${cp.codigo}
                                </option>
                            </c:forEach>
                        </select>
                    </div>
                    <div class="col-mitad celda">
                        <span class="etiqueta-azul" style="display:block; margin-bottom: 5px;">Localidad:</span>
                        <select name="localidadId" id="select-localidad" style="width: 100%; padding: 6px; border: 1px solid var(--color-borde-suave); border-radius: 4px;" required>
                            <option value="" disabled <c:if test="${empty tiendaSelec.localidad}">selected</c:if>>Seleccione Localidad...</option>
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
                        <%-- Aquí hemos implementado el bucle para los Distritos --%>
                        <select name="distritoId" id="select-distrito" disabled style="width: 100%; padding: 6px; border: 1px solid var(--color-borde-suave); border-radius: 4px; background-color: #eee;">
                            <option value="" disabled selected>(Solo válido si es Málaga capital)</option>
                            <c:forEach var="distrito" items="${distritos}">
                                <option value="${distrito.id}" <c:if test="${distrito.nombre == tiendaSelec.distrito}">selected</c:if>>
                                        ${distrito.nombre}
                                </option>
                            </c:forEach>
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
                            <%-- Ojo: Esta opción NO tiene disabled, para permitir dejar la tienda sin responsable --%>
                            <select name="responsableId" id="select-responsable" style="flex-grow:1; padding: 6px; border: 1px solid var(--color-borde-suave); border-radius: 4px;">
                                <option value="" <c:if test="${empty tiendaSelec.responsableTiendaId}">selected</c:if>>Sin asignar...</option>
                                <c:forEach var="resp" items="${responsables}">
                                    <option value="${resp.id}" <c:if test="${resp.id == tiendaSelec.responsableTiendaId}">selected</c:if>>
                                            ${resp.nombre}
                                    </option>
                                </c:forEach>
                            </select>
                            <button type="button" id="btn-abrir-modal-resp" style="padding: 0 12px; background-color: var(--color-etiqueta-azul); color: white; border: none; border-radius: 4px; cursor:pointer; font-weight:bold;">
                                +
                            </button>
                        </div>
                    </div>
                </div>

                <div class="fila">
                    <div class="col-completa celda">
                        <span class="etiqueta-azul" style="display:block; margin-bottom: 5px;">Cadena:</span>
                        <select name="cadenaId" style="width: 100%; padding: 6px; border: 1px solid var(--color-borde-suave); border-radius: 4px;" required>
                            <option value="" disabled <c:if test="${empty tiendaSelec.cadenaId}">selected</c:if>>Seleccione Cadena...</option>
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

<%-- MODAL NUEVO RESPONSABLE (Con tu HTML exacto) --%>
<div id="modal-responsable" class="modal-overlay oculto">
    <div class="modal-caja" style="max-width: 500px;">
        <header class="modal-cabecera">
            <h3 style="margin:0; font-size:1.2rem;">Añadir Nuevo Responsable</h3>
            <button type="button" id="btn-cerrar-responsable" class="modal-cerrar-x">X</button>
        </header>
        <div class="modal-cuerpo" style="padding-top:1rem;">
            <div class="form-fila">
                <div class="modal-campo">
                    <label>Nombre y Apellidos:</label>
                    <input type="text" id="modal-nombre-resp" placeholder="Ej. Juan Pérez">
                </div>
                <div class="modal-campo">
                    <label>Email:</label>
                    <input type="email" id="modal-email" placeholder="juan@ejemplo.com">
                </div>
            </div>
            <div class="form-fila" style="margin-top: 1rem;">
                <div class="modal-campo">
                    <label>Teléfono Móvil:</label>
                    <input type="text" id="modal-telefono" placeholder="600111222">
                </div>
                <div class="modal-campo">
                    <label>Contraseña Acceso:</label>
                    <input type="password" id="modal-password">
                </div>
            </div>
            <footer class="modal-pie" style="margin-top: 1.5rem; text-align: right;">
                <button type="button" id="btn-guardar-responsable" class="btn-modal-guardar">Guardar Responsable</button>
            </footer>
        </div>
    </div>
</div>