<%--Hecho por Jose González (90%), refactorizado finalmente con IA para  buscar eficiencia sin alterar la funcionalidad (10%) --%>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<c:choose>
    <c:when test="${incidencia.responsableTiendaId != null}">
        <c:set var="tipoResponsableActual" value="TIENDA" />
    </c:when>

    <c:when test="${incidencia.responsableEntidadId != null}">
        <c:set var="tipoResponsableActual" value="ENTIDAD" />
    </c:when>

    <c:otherwise>
        <c:set var="tipoResponsableActual" value="" />
    </c:otherwise>
</c:choose>

<section class="formulario-incidencia">

    <header class="formulario-incidencia__cabecera">
        <div>
            <h1>
                <c:choose>
                    <c:when test="${incidencia.id != null}">
                        Editar incidencia
                    </c:when>
                    <c:otherwise>
                        Nueva incidencia
                    </c:otherwise>
                </c:choose>
            </h1>

            <p>Completa los datos de la incidencia</p>
        </div>

        <a class="btn-classic" href="${pageContext.request.contextPath}/incidencias">
            Volver
        </a>
    </header>

    <c:if test="${not empty error}">
        <div class="mensaje-error">
            <c:out value="${error}" />
        </div>
    </c:if>

    <form id="form-incidencia"
          class="form-incidencia"
          method="post"
          action="${pageContext.request.contextPath}/incidencias/guardar">

        <c:if test="${incidencia.id != null}">
            <input type="hidden"
                   name="id"
                   value="${incidencia.id}">
        </c:if>

        <div class="campo-formulario campo-formulario--completo">
            <label for="asunto">Asunto</label>

            <input id="asunto"
                   name="asunto"
                   type="text"
                   value="${incidencia.asunto}"
                   required>
        </div>

        <div class="campo-formulario campo-formulario--completo">
            <label for="descripcion">Descripción</label>

            <textarea id="descripcion"
                      name="descripcion"
                      rows="6"><c:out value="${incidencia.descripcion}" /></textarea>
        </div>

        <div class="campo-formulario">
            <label for="estado">Estado</label>

            <select id="estado" name="estado">
                <option value="PENDIENTE"
                        <c:if test="${incidencia.estado == null || incidencia.estado == 'PENDIENTE'}">selected</c:if>>
                    Pendiente
                </option>

                <option value="LEIDA"
                        <c:if test="${incidencia.estado == 'LEIDA'}">selected</c:if>>
                    Leída
                </option>

                <option value="RESUELTA"
                        <c:if test="${incidencia.estado == 'RESUELTA'}">selected</c:if>>
                    Resuelta
                </option>
            </select>
        </div>

        <div class="campo-formulario">
            <label for="tipo-responsable">Tipo de incidencia</label>

            <select id="tipo-responsable"
                    name="tipoResponsable"
                    required>
                <option value="">Selecciona un tipo</option>

                <option value="TIENDA"
                        <c:if test="${tipoResponsableActual == 'TIENDA'}">selected</c:if>>
                    Tienda
                </option>

                <option value="ENTIDAD"
                        <c:if test="${tipoResponsableActual == 'ENTIDAD'}">selected</c:if>>
                    Entidad
                </option>
            </select>
        </div>

        <div id="grupo-responsable-tienda"
             class="campo-formulario grupo-responsable">
            <label for="responsableTiendaId">Autor / responsable de tienda</label>

            <select id="responsableTiendaId"
                    name="responsableTiendaId">
                <option value="">Selecciona un responsable de tienda</option>

                <c:forEach var="responsableTienda" items="${responsablesTienda}">
                    <option value="${responsableTienda.id}"
                            <c:if test="${incidencia.responsableTiendaId == responsableTienda.id}">selected</c:if>>
                        <c:out value="${responsableTienda.nombre}" />
                    </option>
                </c:forEach>
            </select>
        </div>

        <div id="grupo-responsable-entidad"
             class="campo-formulario grupo-responsable">
            <label for="responsableEntidadId">Autor / responsable de entidad</label>

            <select id="responsableEntidadId"
                    name="responsableEntidadId">
                <option value="">Selecciona un responsable de entidad</option>

                <c:forEach var="responsableEntidad" items="${responsablesEntidad}">
                    <option value="${responsableEntidad.id}"
                            <c:if test="${incidencia.responsableEntidadId == responsableEntidad.id}">selected</c:if>>

                        <c:choose>
                            <c:when test="${responsableEntidad.contacto != null}">
                                <c:out value="${responsableEntidad.contacto.nombre}" />

                                <c:if test="${not empty responsableEntidad.contacto.email}">
                                    - <c:out value="${responsableEntidad.contacto.email}" />
                                </c:if>
                            </c:when>

                            <c:otherwise>
                                Responsable entidad ${responsableEntidad.id}
                            </c:otherwise>
                        </c:choose>

                    </option>
                </c:forEach>
            </select>
        </div>

        <div class="formulario-incidencia__acciones">
            <button type="submit" class="btn-classic">
                <c:choose>
                    <c:when test="${incidencia.id != null}">
                        Actualizar incidencia
                    </c:when>
                    <c:otherwise>
                        Guardar incidencia
                    </c:otherwise>
                </c:choose>
            </button>

            <a class="btn-classic" href="${pageContext.request.contextPath}/incidencias">
                Cancelar
            </a>
        </div>

    </form>

</section>