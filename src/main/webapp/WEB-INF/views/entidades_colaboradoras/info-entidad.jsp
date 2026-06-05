<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>

<%-- Se comporta tanto como formulario como no --%>
<aside class="panel-colaborador" id="entidades" data-id-campania-actual="${campaniaSelec.id}">
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
                        <%-- Opción por defecto --%>
                        <option value="${entidadSelec != null && entidadSelec.direccion != null ? entidadSelec.direccion.localidad : ''}" selected>
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
                        <%-- Opción por defecto --%>
                        <option value="${entidadSelec != null && entidadSelec.direccion != null ? entidadSelec.direccion.codigoPostal : ''}" selected>
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
                        <%-- Opción por defecto --%>
                        <option value="${entidadSelec != null && entidadSelec.direccion != null ? entidadSelec.direccion.zonaGeografica : ''}" selected>
                            ${entidadSelec != null && entidadSelec.direccion != null ? entidadSelec.direccion.zonaGeografica : '-'}
                        </option>
                    </select>
                </div>


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
                <div class="fila-flex" id="campo-distrito-panel" style="display: none;">
                    <span class="etiqueta">Distrito:</span> 
                    <select id="edit-distrito" name="nombreDistrito" class="input-linea" disabled></select>
                </div>
            </section>

            <section class="bloque-seccion border-bottom p-0">
                <table class="tabla-contactos">
                    <tbody id="tabla-contactos-dinamica"></tbody>
                </table>
                <div id="btn-add-contacto-container" style="padding: 10px; text-align: center;">
                    <button type="button" id="btn-add-contacto" style="background: none; border: 1px dashed #ccc; padding: 5px 10px; cursor: pointer; width: 100%;">+ Añadir Contacto</button>
                </div>
            </section>

            <section class="bloque-seccion border-bottom">
                <span class="etiqueta" style="display: block; margin-bottom: 10px;">Tiendas Asignadas:</span>
                <div id="check-tiendas-panel" class="scroll-checks-panel"></div>
            </section>

            <section class="bloque-seccion border-bottom">
                <span class="etiqueta" style="display: block; margin-bottom: 10px;">Historial de Campañas:</span>
                <div id="check-campanias-panel" class="scroll-checks-panel"></div>
            </section>

            <section class="bloque-seccion border-bottom">
                <div class="fila-flex" style="margin-bottom: 15px;">
                    <span class="etiqueta" style="width: auto; margin-right: 10px;">Participa en campaña actual:</span> 
                    <input type="checkbox" id="check-campania" name="estadoActivo" class="check-inline" disabled>
                </div>
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

            <section class="bloque-seccion" id="btn-guardar-container">
                <button type="submit" class="btn-guardar-lateral">Guardar Cambios</button>
            </section>
        </form>
</aside>