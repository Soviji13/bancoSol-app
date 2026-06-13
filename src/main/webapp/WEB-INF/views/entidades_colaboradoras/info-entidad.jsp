<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>

<%-- Se comporta tanto como formulario como no --%>
<aside class="panel-colaborador" id="entidades" 
        data-id-campania-actual="${campaniaSelec.id}"
        data-modificable="${modoEdicion}"
>
        <header class="panel-cabecera">
            <div style="flex: 1;">
                <input 
                    type="text" 
                    id="titulo-colaborador" 
                    name="nuevo-nombre" 
                    class="input-linea" 
                    readonly 
                    style="font-size: 15px; font-weight: bold; color: #2e1065; width: 100%;"
                    value="${entidadSelec != null ? entidadSelec.nombre : "-"}"
                >
                <div style="margin-top: 5px;">
                    <span class="badge-id">ID Sistema: <span id="detalle-id-display">${entidadSelec != null ? entidadSelec.id : "-"}</span></span>
                </div>
            </div>
            <button id="btn-cerrar-panel" class="btn-cerrar" type="button">X</button>
        </header>

        <form id="form-edicion-lateral" class="panel-contenido modo-lectura">

            <section class="bloque-seccion border-bottom">
                <div class="fila-flex">
                    <span class="etiqueta">Calle/Av:</span> 
                    <input 
                        type="text" 
                        id="edit-calle" 
                        name="nueva-calle" 
                        class="input-linea" 
                        required 
                        readonly
                        value="${entidadSelec != null && entidadSelec.direccion != null ? entidadSelec.direccion.calle : "-"}"
                    >
                </div>
                <div class="fila-flex">
                    <span class="etiqueta">Número:</span> 
                    <input 
                        type="number" 
                        id="edit-numero"
                        name="nuevo-numero" 
                        class="input-linea" 
                        required 
                        readonly
                        value="${entidadSelec != null && entidadSelec.direccion != null ? entidadSelec.direccion.numero : "-"}"
                    >
                </div>
                <div class="fila-flex">
                    <span class="etiqueta">Localidad:</span> 
                    <select 
                        id="edit-localidad" 
                        name="nueva-localidad" 
                        class="input-linea" 
                        required 
                        disabled
                    >
                        <%-- Opción por defecto (Localidad) --%>
                        <option value="${entidadSelec != null && entidadSelec.direccion != null ? entidadSelec.direccion.localidadId : ''}" selected>
                            ${entidadSelec != null && entidadSelec.direccion != null ? entidadSelec.direccion.localidad : '-'}
                        </option>
                    </select>
                </div>
                <div class="fila-flex">
                    <span class="etiqueta">Cód. postal:</span> 
                    <select 
                        id="edit-cp" 
                        name="nuevo-cp" 
                        class="input-linea" 
                        required 
                        disabled
                    >
                        <%-- Opción por defecto (CP) --%>
                        <option value="${entidadSelec != null && entidadSelec.direccion != null ? entidadSelec.direccion.codigoPostalId : ''}" selected>
                            ${entidadSelec != null && entidadSelec.direccion != null ? entidadSelec.direccion.codigoPostal : '-'}
                        </option>
                    </select>
                </div>
                

                <div class="fila-flex">
                    <span class="etiqueta">Zona Geo:</span> 
                    <select 
                        id="edit-zona" 
                        name="nueva-zona" 
                        class="input-linea" 
                        disabled
                    >
                        <%-- Opción por defecto (Zona Geográfica) --%>
                        <option value="${entidadSelec != null && entidadSelec.direccion != null ? entidadSelec.direccion.zonaGeoId : ''}" selected>
                            ${entidadSelec != null && entidadSelec.direccion != null ? entidadSelec.direccion.zonaGeografica : '-'}
                        </option>
                    </select>
                </div>


                <%-- Es Capital --%>
                <div class="fila-flex">
                    <label style="cursor:pointer; display: flex; align-items: center;">
                        <span class="etiqueta" style="width: auto; margin-right: 10px;">¿Es Capital?</span>
                        <input 
                            type="checkbox" 
                            id="check-es-capital-panel" 
                            name="esCapital" 
                            class="check-inline" 
                            disabled
                            ${entidadSelec != null && entidadSelec.direccion != null && entidadSelec.direccion.esCapital ? "checked": ''}
                        >
                    </label>
                </div>
                <%-- Distritos si es capital --%>
                <c:choose>
                    <c:when test="${entidadSelec != null && entidadSelec.direccion != null && entidadSelec.direccion.esCapital}">
                        <div class="fila-flex" id="campo-distrito-panel" style="display: flex;">
                    </c:when>
                    <c:otherwise>
                        <div class="fila-flex" id="campo-distrito-panel" style="display: none;">
                    </c:otherwise>
                </c:choose>
                    <span class="etiqueta">Distrito:</span> 
                    <select id="edit-distrito" name="nombreDistrito" class="input-linea" disabled>
                        <option value="">Seleccione un distrito...</option>
                        
                        <%-- Los datos (opciones) sí se traen por SSR condicionalmente --%>
                        <c:if test="${distritos != null && distritos.size() > 0}">
                            <c:forEach var="d" items="${distritos}">
                                <option value="${d.id}" 
                                    ${entidadSelec != null && entidadSelec.direccion != null && entidadSelec.direccion.distritoId != null && entidadSelec.direccion.distritoId == d.id ? 'selected' : ''}>
                                    ${d.nombre}
                                </option>
                            </c:forEach>
                        </c:if>
                    </select>
                </div>
            </section>

            <%-- Mostrar responsables de entidad --%>
            <section class="bloque-seccion border-bottom p-0">
                <table class="tabla-contactos">
                    <tbody id="tabla-contactos-dinamica">
                        <c:if test="${entidadSelec != null && entidadSelec.responsablesEntidad != null && entidadSelec.responsablesEntidad.size() > 0}">
                            <c:forEach var="res" items="${entidadSelec.responsablesEntidad}">
                                <tr class="contacto-header">
                                    <td
                                        class="js-logica-td-form"
                                        rowspan="3"
                                        style="width: 90px; text-align: center; vertical-align: top; background-color: #f8fafc;"
                                    >
                                        <strong style="color: #1e3a8a;">Contacto ${entidadSelec.responsablesEntidad.indexOf(res)}</strong>
                                        <br>
                                        <label for="esPrincipalIdResp">
                                            <span style="color: #dc2626; font-size: 12px; display: block; margin-bottom: 2px;">Principal</span>
                                            <input 
                                                type="radio" 
                                                name="nuevo-contacto-principal" 
                                                class="check-inline r-principal" 
                                                disabled
                                                ${res.esContactoPrincipal ? "checked" : ""}
                                            >
                                        </label>
                                    </td>
                                    <td>
                                        <span class="etiqueta-tabla">Nombre</span>
                                        <input type="text" class="input-linea r-nombre" value="${res.contacto.nombre}">
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span span class="etiqueta-tabla">Email</span>
                                        <input type="email" class="input-linea r-email" value="${res.contacto.email}">
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span span class="etiqueta-tabla">Teléfono</span>
                                        <input type="tel" class="input-linea r-telefono" value="${res.contacto.telefono}">
                                    </td>
                                </tr>
                                <%-- Ayuda IA para recolectar correctamente Ids de responsables que ya existían y se van a eliminar --%>
                                <tr class="eliminar-responsable-js" style="display: none;">
                                    <td>
                                        <%-- Input oculto para que el recolector de JS sepa el ID exacto al guardar --%>
                                        <input type="hidden" class="r-id" value="${res.id}">
                                        
                                        <%-- Botón con la clase exacta y el data-id para la delegación de eventos al borrar --%>
                                        <button type="button" class="btn-eliminar-contacto-existente" data-id="${res.id}" style="color: #e21111; background: none; border: none; cursor: pointer;">
                                            Eliminar responsable
                                        </button>
                                    </td>
                                </tr>
                            </c:forEach>
                        </c:if>
                    </tbody>
                </table>
                <div id="btn-add-contacto-container" style="padding: 10px; text-align: center;">
                    <button type="button" id="btn-add-contacto" style="background: none; border: 1px dashed #ccc; padding: 5px 10px; cursor: pointer; width: 100%;">+ Añadir Contacto</button>
                </div>
            </section>

            <%-- Ver todas sus tiendas (no se puede modificar desde aquí) --%>
            <section class="bloque-seccion border-bottom">
                <span class="etiqueta" style="display: block; margin-bottom: 10px;">Tiendas Asignadas:</span>
                <div id="check-tiendas-panel" class="scroll-checks-panel">
                    <c:if test="${tiendas != null && tiendas.size() > 0 && tiendasColab != null && tiendasColab.size() > 0}">
                        <c:forEach var="tienda" items="${tiendas}">
                            <label>
                                <input 
                                    name="nueva-tienda"
                                    type="checkbox" 
                                    class="check-tienda-panel" 
                                    disabled
                                    ${tiendasColab.contains(tienda) ? "checked" : ""}
                                > 
                                ${tienda.nombre}
                            </label>
                        </c:forEach>
                    </c:if>
                </div>
            </section>

            <%-- Ver todas sus campañas con tiendas respectivas y coordinador --%>
            <section class="bloque-seccion border-bottom">
                <%-- Nombre coordinador --%>
                <div class="fila-flex">
                    <span class="etiqueta" style="width: auto; margin-right: 10px;">Coordinador Responsable:</span>
                    <p style="color:#1e3a8a; font-size: smaller;">${coordinadorNombre}</p>
                </div>

                <%-- Campañas del coordinador y tiendas respectivas (refactorización HTML original y de la IA) --%>
                <span class="etiqueta" style="display: block; margin-bottom: 10px;">Asignaciones por Campaña:</span>
                <div id="check-campanias-panel" class="scroll-checks-panel">
                    
                    <c:if test="${campaniasCoordinador != null && campaniasCoordinador.size() > 0}">
                        <c:forEach var="entry" items="${campaniasCoordinador}">
                            <c:set var="campania" value="${entry.key}" />
                            <c:set var="tiendasCord" value="${entry.value}" />

                            <div class="campania-panel-item" style="margin-bottom: 15px;">
                                <label style="font-weight: bold; color: var(--color-principal); cursor: pointer; display: flex; align-items: center; gap: 10px; width: 100%;">
                                    <input 
                                        type="checkbox" 
                                        value="${campania.id}"
                                        name="nueva-campania"
                                        class="check-campania-master panel-cb" 
                                        disabled 
                                        style="flex-shrink: 0; width: 16px; height: 16px; margin: 0;"
                                        ${tiendasCampaniaEntidad.containsKey(campania.id) ? "checked" : ""}
                                    >
                                    <span style="line-height: 1.4; flex: 1; white-space: normal; text-align: left; word-break: break-word;">${campania.nombre}</span>
                                </label>
                                
                                <c:choose>
                                    <c:when test="${tiendasCampaniaEntidad.containsKey(campania.id)}">
                                        <div id="tiendas-campania-${campania.id}" class="campania-panel-item-tiendas" 
                                            style="display: 'block'; margin-left: 20px; border-left: 2px solid #cbd5e1; padding-left: 14px; margin-top: 10px;">
                                    </c:when>
                                    <c:otherwise>
                                        <div id="tiendas-campania-${campania.id}" class="campania-panel-item-tiendas" 
                                            style="display: 'none'; margin-left: 20px; border-left: 2px solid #cbd5e1; padding-left: 14px; margin-top: 10px;">
                                    </c:otherwise>
                                </c:choose>   
                                    <span style="font-size: 0.85em; color: #64748b; margin-bottom: 8px; display: block; font-weight: 500;">Tiendas asignadas:</span>
                                    
                                    <c:forEach var="tienda" items="${tiendasCord}">
                                        <label style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 6px; font-size: 0.9em; cursor: pointer; color: #334155;">
                                            <input 
                                                name="nueva-tienda-campania"
                                                type="checkbox" 
                                                value="${tienda.id}-${campania.id}" 
                                                class="check-tienda-sub panel-cb" 
                                                disabled 
                                                style="margin-top: 3px; flex-shrink: 0; width: 14px; height: 14px; margin-left: 0;"
                                                ${tiendasCampaniaEntidad.containsKey(campania.id) && tiendasCampaniaEntidad[campania.id].contains(tienda) ? "checked" : ""}
                                            >
                                            <span style="flex: 1; white-space: normal; text-align: left; line-height: 1.3;">${tienda.nombre}</span>
                                        </label>
                                    </c:forEach>
                                </div>
                            </div>
                        </c:forEach>
                    </c:if>
                    <c:if test="${campaniasCoordinador == null || campaniasCoordinador.size() == 0}">
                        <p style="color: #64748b; font-size: 0.9em;">Este coordinador no tiene campañas asociadas.</p>
                    </c:if>
                </div>
            </section>

            <%-- Observaciones y si participa en la campaña actual --%>
            <section class="bloque-seccion border-bottom">
                <div>
                    <span class="etiqueta" style="margin-bottom: 5px; display: block;">Observaciones:</span>
                    <textarea 
                        id="edit-observaciones" 
                        name="observations" 
                        class="input-linea" 
                        readonly 
                        style="width: 100%; min-height: 80px; padding: 10px; background: #f8fafc;"
                    >
                        ${entidadSelec != null ? entidadSelec.observaciones : ""}
                    </textarea>
                </div>
            </section>

            <%-- Campos de ultima campaña, participa en campaña actual, nTiendas, nTurnos y si está activo --%>
            <section class="bloque-seccion border-bottom">
                <div class="fila-flex" style="margin-bottom: 15px;">
                    <span class="etiqueta" style="width: auto; margin-right: 10px;">Participa en campaña actual:</span> 
                    <input 
                        type="checkbox" 
                        id="check-campania" 
                        name="estadoActivo" 
                        class="check-inline" 
                        disabled
                        ${tiendasCampaniaEntidad.containsKey(idCampaniaActual) ? "checked" : ""}
                    >
                </div>
                <div class="fila-flex" style="margin-bottom: 15px;">
                    <span class="etiqueta" style="margin-bottom: 5px; display: block;">Última campaña:</span>
                    <p style="color:#1e3a8a">${ultimaCampania != null ? ultimaCampania : "-"}</p> 
                </div>
                <div class="fila-flex" style="margin-bottom: 15px;">
                    <span class="etiqueta" style="width: auto; margin-right: 10px;">Número de tiendas:</span> 
                    <p style="color:#1e3a8a">${tiendasColab.size()}</p> 
                </div>
                <div class="fila-flex" style="margin-bottom: 15px;">
                    <span class="etiqueta" style="margin-bottom: 5px; display: block;">Número de voluntarios:</span>
                    <p>Cuando las tiendas estén completas lo meteré, para el principio DRY</p>
                </div>
                <div class="fila-flex" style="margin-bottom: 15px;">
                    <span class="etiqueta" style="margin-bottom: 5px; display: block;">Entidad activa:</span>
                    <input 
                        type="checkbox" 
                        name="estaActiva" 
                        ${entidadSelec.estadoActivo ? "checked" : ""}
                    >
                </div>
            </section>

            <%-- Botó guardar, solo se ve en modo edición --%>
            <section class="bloque-seccion" id="btn-guardar-container">
                <button type="submit" class="btn-guardar-lateral">Guardar Cambios</button>
            </section>
        </form>
        <%-- Para mostrar mensaje de error --%>
        <div id="modal-error-aniadir" class="modal-overlay-campanias" style="display: none; padding-top: 400px; padding-left: 800px; box-sizing: border-box; justify-content: center;">
            <div class="modal-content" style="width: 500px;">
                <header class="modal-header">
                    <h2>Ha ocurrido un error:</h2>
                    <button id="cerrar-fallo-aniadir" class="btn-cerrar-modal">X</button>
                </header>
                <p id="mensaje-error-aniadir" style="color: rgb(197, 13, 13);"></p>
            </div>
        </div>
</aside>