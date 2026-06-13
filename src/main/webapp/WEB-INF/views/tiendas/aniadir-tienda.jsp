<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<section class="contenido">
    <header class="cabecera-anadir">
        <p class="texto-instruccion">Rellene los datos de la tienda para añadir una nueva tienda:</p>
    </header>

    <div class="formulario-contenedor">
        <form id="form-anadir" class="form-tienda" action="${pageContext.request.contextPath}/tiendas/guardar" method="POST">

            <input type="hidden" name="campaniaId" value="${campaniaId}">

            <%--radio para indicar si participo en campanias anteriores--%>
            <div class="form-fila">
                <label>¿Ha participado en campañas anteriores?:</label>
                <div class="radio-grupo">
                    <input type="radio" id="participado-si" name="participadoAnterior" value="si">
                    <label for="participado-si">Sí</label>
                    <input type="radio" id="participado-no" name="participadoAnterior" value="no" checked>
                    <label for="participado-no">No</label>
                </div>
            </div>

            <%--bloque origen q se oculta por defecto--%>
            <div class="form-fila oculto" id="bloque-campania-origen">
                <label>Campaña de origen:</label>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <button type="button" id="btn-seleccionar-origen" class="btn-nuevo-inline" style="padding: 0.4rem 0.8rem; background: var(--color-principal); color: white; border-radius: var(--radio-sm); font-weight: bold; border:none; cursor:pointer;">Seleccionar campaña</button>
                    <span id="texto-campania-origen" style="font-weight: 500; color: var(--color-principal);">Ninguna seleccionada</span>
                </div>
            </div>

            <div class="form-fila oculto" id="bloque-tienda-existente">
                <label for="select-tienda-existente">Elija la tienda que desea añadir:</label>
                <select id="select-tienda-existente" name="tiendaExistenteId" class="select-caja">
                    <option value="" disabled selected>Seleccione una campaña primero...</option>
                </select>
            </div>

            <%-- 1.2 SELECT CON ACTIVA / INACTIVA --%>
            <div class="form-fila">
                <label for="select-campania-destino">Asociar a la Campaña:</label>
                <select id="select-campania-destino" name="campaniaIdTarget" class="select-caja" required>
                    <option value="" disabled selected>Seleccione campaña destino...</option>
                    <c:forEach items="${campanias}" var="camp">
                        <option value="${camp.id}" ${camp.id == campaniaId ? 'selected' : ''}>
                                ${camp.nombre} (${camp.activa ? 'ACTIVA' : 'INACTIVA'})
                        </option>
                    </c:forEach>
                </select>
            </div>

            <hr style="border: none; border-top: 1px solid var(--color-borde-suave); margin: 0.5rem 0;">

            <div class="form-fila">
                <label for="select-cadena">Cadena:</label>
                <select id="select-cadena" name="cadenaId" class="select-caja" required>
                    <option value="" disabled selected>Seleccione cadena...</option>
                    <c:forEach items="${cadenas}" var="cadena">
                        <option value="${cadena.id}">${cadena.nombre}</option>
                    </c:forEach>
                </select>
            </div>

            <div class="form-fila">
                <label for="input-nombre">Nombre:</label>
                <input type="text" id="input-nombre" name="nombre" class="input-linea" required>
            </div>

            <div class="form-fila">
                <label>¿Pertenece a una franquicia?:</label>
                <div class="radio-grupo">
                    <input type="radio" id="franq-si" name="esFranquicia" value="true">
                    <label for="franq-si">Sí</label>
                    <input type="radio" id="franq-no" name="esFranquicia" value="false" checked required>
                    <label for="franq-no">No</label>
                </div>
            </div>

            <div class="form-fila">
                <label for="select-localidad">Localidad:</label>
                <select id="select-localidad" name="localidadId" class="select-caja" required>
                    <option value="" disabled selected>Seleccione localidad...</option>
                    <c:forEach items="${localidades}" var="loc">
                        <option value="${loc.id}">${loc.nombre}</option>
                    </c:forEach>
                </select>
            </div>

            <div class="form-fila oculto" id="bloque-distrito">
                <label for="select-distrito">Distrito:</label>
                <select id="select-distrito" name="distritoId" class="select-caja">
                    <option value="" disabled selected>Seleccione distrito...</option>
                    <c:forEach items="${distritos}" var="dist">
                        <option value="${dist.id}">${dist.nombre}</option>
                    </c:forEach>
                </select>
            </div>

            <div class="form-fila">
                <label for="select-cp">Código postal:</label>
                <select id="select-cp" name="cpId" class="select-caja" required>
                    <option value="" disabled selected>Seleccione CP...</option>
                    <c:forEach items="${cps}" var="cp">
                        <option value="${cp.id}">${cp.codigo}</option>
                    </c:forEach>
                </select>
            </div>

            <div class="form-fila">
                <label for="input-calle">Calle:</label>
                <input type="text" id="input-calle" name="calle" class="input-linea" required>
            </div>

            <div class="form-fila">
                <label for="input-numero">Nº:</label>
                <input type="number" id="input-numero" name="numero" class="input-linea" style="max-width: 100px;" required>
            </div>

            <div class="form-fila">
                <label for="input-puntos">Puntos de recogida:</label>
                <input type="number" id="input-puntos" name="puntosRecogida" class="input-linea" value="0" min="0" style="max-width: 100px;" required>
            </div>

            <div class="form-fila">
                <label for="select-responsable">Responsable Tienda:</label>
                <div style="display: flex; align-items: center; width: 100%; gap: 0.5rem;">
                    <select id="select-responsable" name="responsableId" class="select-caja" required>
                        <option value="" disabled selected>Seleccione responsable...</option>
                        <c:forEach items="${responsables}" var="resp">
                            <option value="${resp.id}">${resp.nombre}</option>
                        </c:forEach>
                    </select>
                    <button type="button" id="btn-abrir-modal-resp" class="btn-nuevo-inline" style="padding: 0.4rem 0.8rem; background: var(--color-principal); color: white; border-radius: var(--radio-sm); font-weight: bold; border:none; cursor:pointer;">+ Nuevo</button>
                </div>
            </div>

            <%-- BOTONES CON LA ESTÉTICA DE LA TABLA --%>
            <div class="acciones-tabla">
                <button type="button" id="btn-cancelar" onclick="window.history.back();" class="acciones-tabla__btn">Cancelar</button>
                <button type="submit" id="btn-guardar-submit" class="acciones-tabla__btn">Guardar Tienda</button>
            </div>
        </form>
    </div>

    <%-- ================= 1.1 MODAL CAMPAÑA ORIGEN (CSS idéntico a Tiendas) ================= --%>
    <div id="modal-campanias" class="modal-overlay oculto">
        <div class="modal-caja modal-caja-campanias">
            <header class="modal-cabecera">
                <h3 style="margin:0; font-size:1.2rem;">Seleccionar Campaña de Origen</h3>
                <button type="button" id="btn-cerrar-campanias" class="modal-cerrar-x">X</button>
            </header>
            <div class="modal-cuerpo" id="lista-campanias">
            </div>
        </div>
    </div>

    <%--modal responsable usa ajax para no perder datos introducidos del form padre al recargar, sugerido por ia!!!!--%>
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
                <div class="form-fila">
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
</section>