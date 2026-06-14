<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<%-- Inyectamos los datos para los select dinamicos!!!! --%>
<script>
    window.entidadesData = ${entidadesJson != null ? entidadesJson : '[]'};
    window.tiendasData = ${tiendasJson != null ? tiendasJson : '[]'};
</script>

<section class="aniadir-voluntario-contenedor" style="display: flex; flex-direction: column; height: 100%; background: #fff;">
    <header class="cabecera-anadir" style="padding: 1.5rem 2rem; border-bottom: 1px solid #d0d0d0;">
        <p class="texto-instruccion" style="color: #2c398b; font-size: 1.1rem; margin: 0; font-weight: 500;">
            Rellene los datos para añadir un nuevo voluntario:
        </p>
    </header>

    <div class="formulario-contenedor" style="flex: 1; overflow-y: auto; padding: 2rem;">
        <form id="form-anadir-voluntario" class="form-voluntario" action="${pageContext.request.contextPath}/voluntarios/guardar" method="POST" style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 750px;">
            <input type="hidden" name="campaniaId" value="${campaniaId}">
            <%-- Aqui guardaremos las asignaciones del modal en json texto plano --%>
            <input type="hidden" name="turnosJson" id="turnosJson" value="[]">

            <div class="form-fila" style="display: grid; grid-template-columns: 220px 1fr; align-items: center;">
                <label for="select-entidad" style="color: #2c398b; font-weight: 500;">Entidad colaboradora:</label>
                <select id="select-entidad" class="select-caja" required style="width: 100%; padding: 0.5rem; border: 1px solid #d0d0d0; border-radius: 4px;">
                    <option value="" disabled selected>Seleccione una entidad...</option>
                </select>
            </div>

            <div class="form-fila" style="display: grid; grid-template-columns: 220px 1fr; align-items: center;">
                <label for="select-responsable" style="color: #2c398b; font-weight: 500;">Responsable de entidad:</label>
                <select id="select-responsable" name="responsableId" class="select-caja" required disabled style="width: 100%; padding: 0.5rem; border: 1px solid #d0d0d0; border-radius: 4px; background: #f8f9fa;">
                    <option value="" disabled selected>Primero elija una entidad</option>
                </select>
            </div>

            <hr style="border: 0; border-top: 1px dashed #d0d0d0; width: 100%; margin: 0.5rem 0;" />

            <div class="form-fila" style="display: grid; grid-template-columns: 220px 1fr; align-items: center;">
                <label style="color: #2c398b; font-weight: 500;">¿Trabaja por horas sueltas?</label>
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
                        <input type="radio" name="horasSueltas" id="hs-si" value="si"> Sí
                    </label>
                    <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
                        <input type="radio" name="horasSueltas" id="hs-no" value="no" checked> No
                    </label>
                </div>
            </div>

            <div class="form-fila" style="display: grid; grid-template-columns: 220px 1fr; align-items: center;">
                <label id="label-intervalo" style="color: #a0a0a0; font-weight: 500;">Intervalo de horas:</label>
                <div style="display: flex; gap: 0.5rem; align-items: center; flex: 1;">
                    <input type="time" name="horaInicio" id="horaInicio" class="input-linea" disabled style="width: 100px; padding: 4px; border: 1px solid #d0d0d0; background: #f8f9fa;">
                    <span>-</span>
                    <input type="time" name="horaFin" id="horaFin" class="input-linea" disabled style="width: 100px; padding: 4px; border: 1px solid #d0d0d0; background: #f8f9fa;">
                </div>
            </div>

            <hr style="border: 0; border-top: 1px dashed #d0d0d0; width: 100%; margin: 0.5rem 0;" />

            <div class="form-fila" style="display: grid; grid-template-columns: 220px 1fr; align-items: start;">
                <label style="color: #2c398b; font-weight: 500;">Turnos:</label>
                <div style="display: flex; flex-direction: column; gap: 0.8rem; width: 100%;">
                    <p id="texto-sin-turnos" style="margin: 0; font-size: 0.9rem; color: #888; font-style: italic;">Aún no se han añadido turnos.</p>
                    <ul id="lista-turnos-agregados" style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;"></ul>

                    <button type="button" id="btn-abrir-modal-turno" style="width: max-content; padding: 0.4rem 1rem; background: #2c398b; color: #fff; border-radius: 4px; font-weight: bold; border: none; cursor: pointer;">
                        Añadir Turno
                    </button>
                </div>
            </div>

            <hr style="border: 0; border-top: 1px dashed #d0d0d0; width: 100%; margin: 0.5rem 0;" />

            <div class="form-fila" style="display: grid; grid-template-columns: 220px 1fr; align-items: start;">
                <label for="textarea-obs" style="color: #2c398b; font-weight: 500;">Observaciones:</label>
                <textarea id="textarea-obs" name="observaciones" placeholder="Añade notas..." style="width: 100%; resize: vertical; min-height: 80px; border: 1px solid #d0d0d0; border-radius: 4px; padding: 0.6rem;"></textarea>
            </div>

            <%-- BOTONES DE TABLA --%>
            <div class="acciones-tabla" style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; border-top: 1px solid #ddd; padding-top: 1rem;">
                <button type="button" onclick="window.history.back();" style="padding: 0.7rem 1.5rem; background: #eee; color: #333; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Cancelar</button>
                <button type="submit" style="padding: 0.7rem 1.5rem; background: #2c398b; color: #fff; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Crear nuevo voluntario</button>
            </div>
        </form>
    </div>

    <%-- MODAL DE TURNOS (Basado en React) --%>
    <div id="modal-turno" class="modal-overlay oculto" style="position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); display:none; justify-content:center; align-items:center; z-index:9999;">
        <div class="modal-caja" style="background: white; border-radius: 8px; width: 90%; max-width: 400px; padding: 1.5rem;">
            <header class="modal-cabecera" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.8rem; margin-bottom: 1rem;">
                <h3 style="margin:0; font-size:1.2rem; color: #2c398b;">Añadir Turno</h3>
                <button type="button" id="btn-cerrar-turno" style="background:none; border:none; font-size:1.2rem; font-weight:bold; color:#a0aec0; cursor:pointer;">X</button>
            </header>

            <div class="modal-cuerpo" style="display: flex; flex-direction: column; gap: 1rem;">
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <label style="font-weight: bold; font-size: 0.85rem; color: #4a5568;">Tienda de destino:</label>
                    <select id="modal-select-tienda" style="width: 100%; padding: 0.5rem; border: 1px solid #cbd5e0; border-radius: 4px;">
                        <option value="" disabled selected>Seleccione tienda...</option>
                    </select>
                </div>

                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <label style="font-weight: bold; font-size: 0.85rem; color: #4a5568;">Día de la semana:</label>
                    <select id="modal-select-dia" style="width: 100%; padding: 0.5rem; border: 1px solid #cbd5e0; border-radius: 4px;">
                        <option value="" disabled selected>Seleccione día...</option>
                        <option value="Lunes">Lunes</option><option value="Martes">Martes</option>
                        <option value="Miércoles">Miércoles</option><option value="Jueves">Jueves</option>
                        <option value="Viernes">Viernes</option><option value="Sábado">Sábado</option>
                    </select>
                </div>

                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <label style="font-weight: bold; font-size: 0.85rem; color: #4a5568;">Franja u Horario:</label>
                    <select id="modal-select-franja" style="width: 100%; padding: 0.5rem; border: 1px solid #cbd5e0; border-radius: 4px;">
                        <option value="" disabled selected>Seleccione franja...</option>
                        <option value="Mañana">Mañana</option>
                        <option value="Tarde">Tarde</option>
                    </select>

                    <div id="modal-info-horas" class="oculto" style="background: #f8f9fa; border: 1px dashed #d0d0d0; padding: 0.8rem; text-align: center; border-radius: 4px; font-weight: bold; color: #2b6cb0;">
                        El horario se asignará por las horas sueltas indicadas en el formulario.
                    </div>
                </div>
            </div>

            <footer style="display: flex; justify-content: flex-end; border-top: 1px solid #e2e8f0; padding-top: 1rem; margin-top: 1.5rem;">
                <button type="button" id="btn-guardar-turno" style="background: #2c398b; color: white; border: none; padding: 8px 16px; font-weight: bold; border-radius: 4px; cursor: pointer;">Añadir al listado</button>
            </footer>
        </div>
    </div>
</section>