<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>

<section class="gestion-campania">

    <header class="gestion-campania__cabecera">
        <div class="gestion-campania__volver">
            <a href="${pageContext.request.contextPath}/campanias"
               class="btn-classic">
                Volver
            </a>
        </div>

        <div class="gestion-campania__titulo">
            <h1>
                <c:choose>
                    <c:when test="${not empty campania.nombre}">
                        ${campania.nombre}
                    </c:when>
                    <c:otherwise>
                        Campaña sin nombre
                    </c:otherwise>
                </c:choose>
            </h1>

            <c:set var="estaActiva" value="${campania.activa != null && campania.activa}" />

            <form action="${pageContext.request.contextPath}/campanias/cambiar-estado"
                  method="post"
                  class="form-estado-campania">

                <input type="hidden" name="id" value="${campania.id}" />
                <input type="hidden" name="nuevoEstado" value="${!estaActiva}" />

                <button type="submit"
                        class="btn-status ${estaActiva ? 'btn-status--activa' : 'btn-status--terminada'}">
                    <c:choose>
                        <c:when test="${estaActiva}">
                            Campaña Activa (Dar por terminada)
                        </c:when>
                        <c:otherwise>
                            Campaña Terminada (Activar ahora)
                        </c:otherwise>
                    </c:choose>
                </button>
            </form>
        </div>

        <div class="gestion-campania__espaciador"></div>
    </header>

    <div class="gestion-campania__contenido">

        <section class="gestion-campania__bloque gestion-campania__bloque--cadenas">
            <table class="tabla-classic">
                <thead>
                <tr>
                    <th class="th-classic">Cadenas</th>
                </tr>
                </thead>

                <tbody>
                <tr>
                    <td>
                        <div class="list-container list-container--cadenas">

                            <c:choose>
                                <c:when test="${empty cadenas}">
                                    <p class="texto-vacio">No hay cadenas disponibles.</p>
                                </c:when>

                                <c:otherwise>
                                    <div class="cadenas-grid">
                                        <c:forEach var="cadena" items="${cadenas}">
                                            <label class="cadena-item">
                                                <input type="checkbox"
                                                       name="idsCadenasSeleccionadas"
                                                       value="${cadena.id}"
                                                       disabled
                                                       <c:if test="${campania.idsCadenas != null && campania.idsCadenas.contains(cadena.id)}">checked</c:if> />

                                                <span>
                                                    <c:choose>
                                                        <c:when test="${not empty cadena.nombre}">
                                                            ${cadena.nombre}
                                                        </c:when>
                                                        <c:otherwise>
                                                            Cadena sin nombre
                                                        </c:otherwise>
                                                    </c:choose>
                                                </span>
                                            </label>
                                        </c:forEach>
                                    </div>
                                </c:otherwise>
                            </c:choose>

                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </section>

        <section class="gestion-campania__bloque gestion-campania__bloque--acciones">

            <table class="tabla-classic tabla-classic--coordinadores">
                <thead>
                <tr>
                    <th class="th-classic">Coordinadores</th>
                </tr>
                </thead>

                <tbody>
                <tr>
                    <td>
                        <div class="list-container list-container--coordinadores">

                            <c:choose>
                                <c:when test="${empty coordinadores}">
                                    <p class="texto-vacio">No hay coordinadores asignados.</p>
                                </c:when>

                                <c:otherwise>
                                    <c:forEach var="coord" items="${coordinadores}">
                                        <div class="coordinador-item">
                                            <a href="${pageContext.request.contextPath}/campanias/gestion/coordinador?id=${coord.id}&campania=${campania.id}"
                                               class="link-classic">
                                                <c:choose>
                                                    <c:when test="${not empty coord.nombre}">
                                                        ${fn:toUpperCase(coord.nombre)}
                                                    </c:when>
                                                    <c:otherwise>
                                                        SIN DEFINIR
                                                    </c:otherwise>
                                                </c:choose>
                                            </a>
                                        </div>
                                    </c:forEach>
                                </c:otherwise>
                            </c:choose>

                        </div>
                    </td>
                </tr>
                </tbody>
            </table>

            <nav class="acciones-campania">
                <a href="${pageContext.request.contextPath}/campanias/gestion/modificar?id=${campania.id}"
                   class="btn-action-wide">
                    Modificar Campaña
                </a>

                <a href="${pageContext.request.contextPath}/campanias/gestion/cadenas?id=${campania.id}"
                   class="btn-action-wide">
                    Gestionar Cadenas
                </a>

                <a href="${pageContext.request.contextPath}/campanias/gestion/coordinadores?id=${campania.id}"
                   class="btn-action-wide">
                    Gestionar Coordinadores
                </a>
            </nav>

        </section>

    </div>

</section>