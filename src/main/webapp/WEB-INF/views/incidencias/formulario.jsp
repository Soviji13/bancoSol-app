<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<link rel="stylesheet" href="${pageContext.request.contextPath}/css/incidencias/formIncidencia.css">
<script src="${pageContext.request.contextPath}/js/incidencias/formIncidencia.js" defer></script>

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

    <form class="form-incidencia"
          method="post"
          action="${pageContext.request.contextPath}/incidencias/guardar">

        <c:if test="${incidencia.id != null}">
            <input type="hidden" name="id" value="${incidencia.id}">
        </c:if>

        <div class="campo-formulario">
            <label for="asunto">Asunto</label>
            <input id="asunto"
                   name="asunto"
                   type="text"
                   value="<c:out value='${incidencia.asunto}' />"
                   required>
        </div>

        <div class="campo-formulario">
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
            <label for="tipo-responsable">Tipo de responsable</label>

            <select id="tipo-responsable" name="tipoResponsable">
                <option value="">Selecciona un tipo</option>

                <option value="TIENDA"
                        <c:if test="${incidencia.responsableTiendaId != null}">selected</c:if>>
                    Responsable de tienda
                </option>

                <option value="ENTIDAD"
                        <c:if test="${incidencia.responsableEntidadId != null}">selected</c:if>>
                    Responsable de entidad
                </option>
            </select>
        </div>

        <div id="grupo-responsable-tienda" class="campo-formulario grupo-responsable">
            <label for="responsableTiendaId">Responsable de tienda</label>

            <select id="responsableTiendaId" name="responsableTiendaId">
                <option value="">Selecciona un responsable de tienda</option>

                <c:forEach var="responsableTienda" items="${responsablesTienda}">
                    <option value="${responsableTienda.id}"
                            <c:if test="${incidencia.responsableTiendaId == responsableTienda.id}">selected</c:if>>
                        <c:out value="${responsableTienda.nombre}" />
                    </option>
                </c:forEach>
            </select>
        </div>

        <div id="grupo-responsable-entidad" class="campo-formulario grupo-responsable">
            <label for="responsableEntidadId">Responsable de entidad</label>

            <select id="responsableEntidadId" name="responsableEntidadId">
                <option value="">Selecciona un responsable de entidad</option>

                <c:forEach var="responsableEntidad" items="${responsablesEntidad}">
                    <option value="${responsableEntidad.id}"
                            <c:if test="${incidencia.responsableEntidadId == responsableEntidad.id}">selected</c:if>>
                        <c:out value="${responsable.nombreContacto}" />
                        <c:if test="${not empty responsable.emailContacto}">
                            - <c:out value="${responsable.emailContacto}" />
                        </c:if>
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