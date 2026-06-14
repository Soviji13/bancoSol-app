<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<%-- Inyectamos los datos para JS --%>
<script>
    window.entidadesData = ${entidadesJson != null ? entidadesJson : '[]'};
    window.tiendasData = ${tiendasJson != null ? tiendasJson : '[]'};
    window.horasSueltasActivo = ${voluntarioSelec.horasSueltas ? 'true' : 'false'};
    window.turnosIniciales = [
        <c:forEach var="asig" items="${voluntarioSelec.asignaciones}">
        <c:forEach var="turno" items="${asig.turnos}">
        { tiendaId: "${asig.tiendaId}", tiendaNombre: "${asig.tiendaNombre}", dia: "${turno.dia}", franja: "${turno.franjaHoraria}" },
        </c:forEach>
        </c:forEach>
    ];
</script>

<aside class="panel-detalle-lateral panel-modo-edicion">
    <header class="panel-lateral-header header-edicion">
        <div class="panel-lateral-info">
            <h2 class="panel-lateral-titulo">Voluntario ID: <c:out value="${voluntarioSelec.id}" /></h2>
            <p class="panel-lateral-subtitulo subtitulo-edicion">Modificando datos del voluntario</p>
        </div>
        <div class="panel-lateral-acciones">
            <a href="${pageContext.request.contextPath}/voluntarios?campaniaId=${campaniaId}&voluntarioId=${voluntarioSelec.id}" class="btn-cerrar-lateral" style="text-decoration: none;" aria-label="Cerrar panel" title="Descartar cambios">X</a>
        </div>
    </header>

    <form id="form-modificar" action="${pageContext.request.contextPath}/voluntarios/actualizar" method="POST" class="panel-detalle-contenido">
        <input type="hidden" name="campaniaId" value="${campaniaId}">
        <input type="hidden" name="voluntarioId" value="${voluntarioSelec.id}">
        <input type="hidden" name="turnosJson" id="turnosJson" value="[]">

        <div class="detalle-bloque">
            <div class="campo-editable-bloque">
                <span class="texto-azul">Entidad colaboradora:</span>
                <select id="select-entidad" class="select-datos" required>
                    <option value="" disabled>Seleccione entidad...</option>
                </select>
            </div>
        </div>

        <div class="detalle-bloque">
            <div class="campo-editable-bloque mb-medio">
                <span class="texto-azul">Responsable:</span>
                <select id="select-responsable" name="responsableId" class="select-datos" data-selected="${voluntarioSelec.responsableId}" required disabled style="background: #f8f9fa;">
                    <option value="" disabled>Elija entidad primero</option>
                </select>
            </div>
            <div class="detalle-grupo-filas">
                <div><span class="texto-azul">Teléfono:</span> <span id="texto-telefono"><c:out value="${voluntarioSelec.telefono}" default="---"/></span></div>
                <div><span class="texto-azul">Email:</span> <span id="texto-email"><c:out value="${voluntarioSelec.email}" default="---"/></span></div>
            </div>
        </div>

        <div class="detalle-bloque">
            <span class="texto-azul">Turnos asignados:</span>
            <div class="contenedor-tablas-turnos">
                <p id="texto-sin-turnos" style="margin: 0; font-size: 0.9rem; color: #888; font-style: italic; display: none;">Sin turnos asignados</p>
                <ul id="lista-turnos-agregados" class="lista-turnos-agregados"></ul>

                <button type="button" id="btn-abrir-modal-turno" class="btn-turno-inline btn-nuevo-margen">
                    Añadir turno
                </button>
            </div>
        </div>

        <div class="detalle-bloque bloque-observaciones">
            <span class="texto-azul">Observaciones:</span>
            <textarea name="observaciones" class="textarea-datos" rows="5" placeholder="Añade notas del voluntario..."><c:out value="${voluntarioSelec.observaciones}" /></textarea>
        </div>

        <div class="acciones-tabla" style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; padding: 1rem; border-top: 1px solid #d0d0d0;">
            <a href="${pageContext.request.contextPath}/voluntarios?campaniaId=${campaniaId}&voluntarioId=${voluntarioSelec.id}" class="acciones-tabla__btn btn-cancelar" style="text-decoration: none;">Cancelar</a>
            <button type="submit" class="acciones-tabla__btn" style="background: #2c398b; color: white;">Guardar Cambios</button>
        </div>
    </form>

    <%-- MODAL DE TURNOS --%>
    <div id="modal-turno" class="modal-overlay oculto" style="position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); display:none; justify-content:center; align-items:center; z-index:9999;">
        <div class="modal-caja" style="background: white; border-radius: 8px; width: 90%; max-width: 400px; padding: 1.5rem;">
            <header class="modal-cabecera" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.8rem; margin-bottom: 1rem;">
                <h3 style="margin:0; font-size:1.2rem; color: #2c398b;">Añadir Turno</h3>
                <button type="button" id="btn-cerrar-turno" style="background:none; border:none; font-size:1.2rem; font-weight:bold; color:#a0aec0; cursor:pointer;">X</button>
            </header>

            <div class="modal-cuerpo" style="display: flex; flex-direction: column; gap: 1rem;">
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <label style="font-weight: bold; font-size: 0.85rem; color: #4a5568;">Tienda de destino:</label>
                    <select id="modal-select-tienda" class="select-datos" style="width: 100%;">
                        <option value="" disabled selected>Seleccione tienda...</option>
                    </select>
                </div>

                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <label style="font-weight: bold; font-size: 0.85rem; color: #4a5568;">Día de la semana:</label>
                    <select id="modal-select-dia" class="select-datos" style="width: 100%;">
                        <option value="" disabled selected>Seleccione día...</option>
                        <option value="Lunes">Lunes</option><option value="Martes">Martes</option>
                        <option value="Miércoles">Miércoles</option><option value="Jueves">Jueves</option>
                        <option value="Viernes">Viernes</option><option value="Sábado">Sábado</option>
                    </select>
                </div>

                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <label style="font-weight: bold; font-size: 0.85rem; color: #4a5568;">Franja u Horario:</label>
                    <select id="modal-select-franja" class="select-datos" style="width: 100%;">
                        <option value="" disabled selected>Seleccione franja...</option>
                        <option value="Mañana">Mañana</option>
                        <option value="Tarde">Tarde</option>
                    </select>

                    <div id="modal-info-horas" class="oculto" style="background: #f8f9fa; border: 1px dashed #d0d0d0; padding: 0.8rem; text-align: center; border-radius: 4px; font-weight: bold; color: #2b6cb0;">
                        El horario se asignará por las horas sueltas indicadas en el sistema.
                    </div>
                </div>
            </div>

            <footer style="display: flex; justify-content: flex-end; border-top: 1px solid #e2e8f0; padding-top: 1rem; margin-top: 1.5rem;">
                <button type="button" id="btn-guardar-turno" style="background: #2c398b; color: white; border: none; padding: 8px 16px; font-weight: bold; border-radius: 4px; cursor: pointer;">Añadir al listado</button>
            </footer>
        </div>
    </div>
</aside>