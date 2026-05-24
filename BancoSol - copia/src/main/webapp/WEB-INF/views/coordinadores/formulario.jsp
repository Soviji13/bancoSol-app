<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>
        <c:choose>
            <c:when test="${modoEdicion}">
                Editar coordinador
            </c:when>
            <c:otherwise>
                Formulario coordinador
            </c:otherwise>
        </c:choose>
    </title>

    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/global.css" />
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/coordinadores/formularioCoordinador.css" />

    <script type="module"
            src="${pageContext.request.contextPath}/js/coordinadores/formularioCoordinador.js"
            defer></script>
</head>

<body>
<main class="pagina-formulario">
    <header class="pagina-formulario__header">
        <div>
            <h1 id="titulo-formulario">
                <c:choose>
                    <c:when test="${modoEdicion}">
                        Editar Coordinador
                    </c:when>
                    <c:otherwise>
                        Registrar Nuevo Coordinador
                    </c:otherwise>
                </c:choose>
            </h1>

            <p>Complete los datos del coordinador y sus campañas asociadas</p>
        </div>

        <a id="btn-volver"
           class="btn-volver"
           href="${pageContext.request.contextPath}/coordinadores">
            Volver
        </a>
    </header>

    <section class="tarjeta-formulario">
        <form id="form-registro-coordinador"
              action="<c:choose><c:when test='${modoEdicion}'>${pageContext.request.contextPath}/coordinadores/actualizar/${id}</c:when><c:otherwise>${pageContext.request.contextPath}/coordinadores/guardar</c:otherwise></c:choose>"
              method="post">

            <c:if test="${not empty error}">
                <div id="aviso-formulario" class="aviso-formulario">
                    <strong>No se pudo guardar el coordinador</strong>
                    <p>${error}</p>
                </div>
            </c:if>

            <input type="hidden"
                   name="id"
                   id="coordinador-id"
                   value="${id}" />

            <input type="hidden"
                   name="contactoId"
                   id="contacto-id"
                   value="${coordinador.contactoId}" />

            <input type="hidden"
                   name="usuarioId"
                   id="usuario-id"
                   value="${coordinador.usuarioId}" />

            <fieldset>
                <legend>Información general</legend>

                <div class="form-group">
                    <label for="nombre">Nombre del coordinador:</label>
                    <input
                            id="nombre"
                            type="text"
                            name="nombre"
                            required
                            placeholder="Ej: Ana García"
                            value="${coordinador.nombre}"
                    />
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="email">Correo:</label>
                        <input
                                id="email"
                                type="email"
                                name="email"
                                required
                                placeholder="coordinador@bancosol.es"
                                value="${coordinador.email}"
                        />
                    </div>

                    <div class="form-group">
                        <label for="telefono">Teléfono:</label>
                        <input
                                id="telefono"
                                type="tel"
                                name="telefono"
                                placeholder="600 00 00 00"
                                value="${coordinador.telefono}"
                        />
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
                            <option value="${zona.nombre}"
                                    <c:if test="${zona.nombre.toUpperCase() == coordinador.area}">
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
                                <c:if test="${coordinador.permisoModificar == null || coordinador.permisoModificar}">
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
                                    <c:if test="${idCampaniaSeleccionada == campania.id}">
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
                   href="${pageContext.request.contextPath}/coordinadores">
                    Cancelar
                </a>

                <button id="btn-guardar-coordinador"
                        type="submit"
                        class="btn-guardar">
                    <c:choose>
                        <c:when test="${modoEdicion}">
                            Guardar cambios
                        </c:when>
                        <c:otherwise>
                            Guardar Coordinador
                        </c:otherwise>
                    </c:choose>
                </button>
            </footer>
        </form>
    </section>
</main>
</body>
</html>