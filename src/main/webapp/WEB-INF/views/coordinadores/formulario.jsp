<%--Hecho por Jose González (90%), refactorizado finalmente con IA para  buscar eficiencia sin alterar la funcionalidad (10%) --%>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>

<c:url var="urlGuardarCoordinador" value="/coordinadores/guardar" />
<c:url var="urlVolverCoordinadores" value="/coordinadores" />

<c:set var="esEdicion" value="${not empty id}" />

<c:choose>
    <c:when test="${esEdicion}">
        <c:set var="tituloFormulario" value="Editar Coordinador" />
        <c:set var="textoBotonGuardar" value="Guardar cambios" />
    </c:when>

    <c:otherwise>
        <c:set var="tituloFormulario" value="Registrar Nuevo Coordinador" />
        <c:set var="textoBotonGuardar" value="Guardar Coordinador" />
    </c:otherwise>
</c:choose>

<main class="pagina-formulario">
    <header class="pagina-formulario__header">
        <div>
            <h1 id="titulo-formulario">${tituloFormulario}</h1>
            <p>Complete los datos del coordinador y sus campañas asociadas</p>
        </div>

        <a id="btn-volver"
           class="btn-volver"
           href="${urlVolverCoordinadores}">
            Volver
        </a>
    </header>

    <section class="tarjeta-formulario">
        <form id="form-registro-coordinador"
              action="${urlGuardarCoordinador}"
              method="post">

            <c:if test="${not empty error}">
                <div id="aviso-formulario" class="aviso-formulario">
                    <strong>No se pudo guardar el coordinador</strong>
                    <p>${error}</p>
                </div>
            </c:if>

            <c:if test="${esEdicion}">
                <input type="hidden"
                       name="id"
                       id="coordinador-id"
                       value="${id}" />
            </c:if>

            <input type="hidden"
                   name="contactoId"
                   id="contacto-id"
                   value="${coordinador.contactoId}" />

            <input type="hidden"
                   name="usuarioId"
                   id="usuario-id"
                   value="${coordinador.usuarioId}" />

            <input type="hidden"
                   name="entidadId"
                   id="entidad-id"
                   value="${coordinador.entidadId}" />

            <fieldset>
                <legend>Información general</legend>

                <div class="form-group">
                    <label for="nombre">Nombre del coordinador:</label>
                    <input id="nombre"
                           type="text"
                           name="nombre"
                           required
                           placeholder="Ej: Ana García"
                           value="${coordinador.nombre}" />
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="email">Correo:</label>
                        <input id="email"
                               type="email"
                               name="email"
                               required
                               placeholder="coordinador@bancosol.es"
                               value="${coordinador.email}" />
                    </div>

                    <div class="form-group">
                        <label for="telefono">Teléfono:</label>
                        <input id="telefono"
                               type="tel"
                               name="telefono"
                               placeholder="600 00 00 00"
                               value="${coordinador.telefono}" />
                    </div>
                </div>
            </fieldset>

            <fieldset>
                <legend>Asignación</legend>

                <div class="form-group">
                    <label for="select-zonas">Área asignada:</label>

                    <select name="area" id="select-zonas" required>
                        <option value="">Seleccione un área...</option>

                        <c:forEach var="zona" items="${zonas}">
                            <c:set var="zonaMayusculas" value="${fn:toUpperCase(zona.nombre)}" />

                            <option value="${zonaMayusculas}"
                                    <c:if test="${zonaMayusculas eq coordinador.area}">
                                        selected
                                    </c:if>>
                                    ${zona.nombre}
                            </option>
                        </c:forEach>
                    </select>
                </div>

                <div class="form-check">
                    <label>
                        <input type="checkbox"
                               name="permisoModificar"
                               value="true"
                                <c:if test="${coordinador.permisoModificar}">
                                    checked
                                </c:if> />
                        ¿Puede modificar datos?
                    </label>
                </div>
            </fieldset>

            <fieldset>
                <legend>Campañas</legend>

                <div id="check-campanias" class="scroll-checks">
                    <c:choose>
                        <c:when test="${empty campanias}">
                            <p>No hay campañas disponibles.</p>
                        </c:when>

                        <c:otherwise>
                            <c:forEach var="campania" items="${campanias}">
                                <c:set var="campaniaSeleccionada" value="false" />

                                <c:forEach var="idCampaniaSeleccionada" items="${coordinador.idsCampanias}">
                                    <c:if test="${idCampaniaSeleccionada eq campania.id}">
                                        <c:set var="campaniaSeleccionada" value="true" />
                                    </c:if>
                                </c:forEach>

                                <label class="check-item">
                                    <input type="checkbox"
                                           name="idsCampanias"
                                           value="${campania.id}"
                                            <c:if test="${campaniaSeleccionada}">
                                                checked
                                            </c:if> />

                                    <span>${campania.nombre}</span>
                                </label>
                            </c:forEach>
                        </c:otherwise>
                    </c:choose>
                </div>
            </fieldset>

            <footer class="formulario-acciones">
                <a id="btn-cancelar"
                   class="btn-cancelar"
                   href="${urlVolverCoordinadores}">
                    Cancelar
                </a>

                <button id="btn-guardar-coordinador"
                        type="submit"
                        class="btn-guardar">
                    ${textoBotonGuardar}
                </button>
            </footer>
        </form>
    </section>
</main>