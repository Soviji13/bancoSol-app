<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<link rel="stylesheet" href="${pageContext.request.contextPath}/css/incidencias/incidenciaSeleccionada.css">

<section class="detalle-incidencia">

    <header class="detalle-incidencia__cabecera">
        <div>
            <h1>Detalle de incidencia</h1>
            <p>Información completa de la incidencia seleccionada</p>
        </div>

        <a class="btn-classic" href="${pageContext.request.contextPath}/incidencias">
            Volver
        </a>
    </header>

    <c:choose>
        <c:when test="${incidencia == null}">
            <div class="mensaje-vacio">
                No se ha encontrado la incidencia solicitada.
            </div>
        </c:when>

        <c:otherwise>
            <article class="tarjeta-detalle-incidencia">

                <div class="detalle-incidencia__fila">
                    <span class="detalle-incidencia__etiqueta">Asunto</span>
                    <span class="detalle-incidencia__valor">
                        <c:out value="${incidencia.asunto}" />
                    </span>
                </div>

                <div class="detalle-incidencia__fila">
                    <span class="detalle-incidencia__etiqueta">Estado</span>
                    <span class="estado-incidencia estado-incidencia--${incidencia.estado}">
                        <c:out value="${incidencia.estado}" />
                    </span>
                </div>

                <div class="detalle-incidencia__fila">
                    <span class="detalle-incidencia__etiqueta">Fecha y hora</span>
                    <span class="detalle-incidencia__valor">
                        <c:out value="${incidencia.fechaHora}" />
                    </span>
                </div>

                <div class="detalle-incidencia__fila">
                    <span class="detalle-incidencia__etiqueta">Reportado por</span>
                    <span class="detalle-incidencia__valor">
                        <c:out value="${incidencia.reportadoPorNombre}" />
                    </span>
                </div>

                <div class="detalle-incidencia__fila">
                    <span class="detalle-incidencia__etiqueta">Tipo de responsable</span>
                    <span class="detalle-incidencia__valor">
                        <c:choose>
                            <c:when test="${incidencia.reportadoPorTipo == 'RESPONSABLE_TIENDA'}">
                                Responsable de tienda
                            </c:when>

                            <c:when test="${incidencia.reportadoPorTipo == 'RESPONSABLE_ENTIDAD'}">
                                Responsable de entidad
                            </c:when>

                            <c:otherwise>
                                No indicado
                            </c:otherwise>
                        </c:choose>
                    </span>
                </div>

                <div class="detalle-incidencia__bloque">
                    <span class="detalle-incidencia__etiqueta">Descripción</span>

                    <div class="detalle-incidencia__descripcion">
                        <c:choose>
                            <c:when test="${empty incidencia.descripcion}">
                                Sin descripción.
                            </c:when>

                            <c:otherwise>
                                <c:out value="${incidencia.descripcion}" />
                            </c:otherwise>
                        </c:choose>
                    </div>
                </div>

                <div class="detalle-incidencia__acciones">
                    <a class="btn-classic"
                       href="${pageContext.request.contextPath}/incidencias/editar?id=${incidencia.id}">
                        Editar
                    </a>

                    <form method="post"
                          action="${pageContext.request.contextPath}/incidencias/eliminar"
                          class="form-eliminar-incidencia">

                        <input type="hidden" name="id" value="${incidencia.id}">

                        <button type="submit" class="btn-classic btn-danger">
                            Eliminar
                        </button>
                    </form>
                </div>

            </article>
        </c:otherwise>
    </c:choose>

</section>