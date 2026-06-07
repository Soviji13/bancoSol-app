<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>

<section id="entidades" data-id-campania-actual="${campaniaId}" style="width: 100%;">
    <div id="modal-registro" class="modal-overlay">
        <div class="modal-content god-form">
            <header class="modal-header">
                <h2>Registrar Nueva Entidad Colaboradora</h2>
                <button type="button" class="btn-cerrar-modal">X</button>
            </header>

            <form id="form-registro-entidad">
                <fieldset>
                    <legend>Información General</legend>
                    <%-- Recolecta nombre --%>
                    <div class="form-group">
                        <label>Nombre de la Entidad:</label>
                        <input 
                            type="text" 
                            name="nombre" 
                            required 
                            placeholder="Ej: Asociación Alimentos para Todos"
                        >
                    </div>
                    <%-- Recolecta si está activo (por defecto sí) --%>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" name="estadoActivo" checked> ¿Estado Activo?
                        </label>
                        <textarea name="observaciones" placeholder="Observaciones adicionales..."></textarea>
                    </div>
                    <%-- Elige coordinador Responsable --%>
                    <div class="form-group">
                        <label>Coordinador Responsable:</label>
                        <select name="idCoordinador" id="select-coordinadores" required>

                            <option value="">Seleccione un coordinador...</option>

                            <c:if test="${coordinadores != null && coordinadores.size() > 0}">
                                <c:forEach var="c" items="${coordinadores}">
                                    <option value="${c.id}">${c.nombre}</option>
                                </c:forEach>
                            </c:if>
                        </select>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Localización</legend>
                    <%-- Calle y Número --%>
                    <div class="form-row">
                        <input type="text" name="calle" placeholder="Calle/Av" required>
                        <input type="number" name="numero" placeholder="Nº" required style="width: 80px;">
                    </div>
                    <div class="form-row">
                        <select id="lista-localidades" name="nombreLocalidad" required>
                            <option value="">Localidad...</option>
                        </select>

                        <select id="lista-cps" name="numeroCP" required>
                            <option value="">CP...</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <label>Zona Geográfica:</label>
                        <select id="lista-zonas" name="nombreZonaGeografica" required>
                            <option value="">Zona Geográfica...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label><input type="checkbox" id="check-es-capital" name="esCapital" onchange="toggleDistrito(this)"> ¿Es Capital?</label>
                        <div id="campo-distrito" style="display: none; margin-top: 10px;">
                            <select id="lista-distritos" name="nombreDistrito">
                                <option value="">Nombre del Distrito...</option>
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Responsables de la Entidad</legend>
                    <div id="contenedor-responsables"></div>
                    <button type="button" class="btn-secundario" onclick="agregarBloqueResponsable()">+ Añadir Responsable</button>
                </fieldset>

                <fieldset style="border: 1px solid #cbd5e1; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <legend style="font-weight: bold; color: var(--color-principal); padding: 0 10px;">Asignaciones por Campaña</legend>
                    
                    <div style="width: 100%; box-sizing: border-box;">
                        <span style="font-size: 0.9em; color: #475569; display: block; margin-bottom: 10px; font-weight: 500;">
                            Selecciona las campañas en las que participa la entidad y asigna sus respectivos puntos de recogida:
                        </span>
                        
                        <div id="check-campanias" style="width: 100%; box-sizing: border-box;"></div>
                    </div>
                </fieldset>

                <footer class="modal-footer">
                    <button type="button" class="btn-cancelar" onclick="cerrarModalRegistro()">Cancelar</button>
                    <button type="submit" class="btn-guardar">Guardar Entidad</button>
                </footer>
            </form>
        </div>
    </div>
</section>