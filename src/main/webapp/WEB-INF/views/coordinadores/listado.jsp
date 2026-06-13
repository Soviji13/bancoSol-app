<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<section class="coordinadores">

    <div class="coordinadores__superior">

        <div class="coordinadores__acciones-superiores">
            <a id="btn-filtro-coordinadores"
               class="coordinadores__btn-icono"
               href="${pageContext.request.contextPath}/coordinadores?mostrarFiltros=true"
               aria-label="Mostrar filtros">
                <img src="${pageContext.request.contextPath}/assets/embudo.png"
                     alt="" />
            </a>

            <button id="btn-seleccionar-campania"
                    class="coordinadores__btn-campania"
                    type="button">
                Seleccionar otra campaña
            </button>
        </div>

        <div class="coordinadores__titulo">
            <c:choose>
                <c:when test="${not empty campaniaSeleccionada}">
                    <h1>Coordinadores de ${campaniaSeleccionada.nombre}</h1>
                </c:when>

                <c:otherwise>
                    <h1>Todos los coordinadores</h1>
                </c:otherwise>
            </c:choose>

            <p>Para ver más información sobre el coordinador, haga doble click sobre su fila correspondiente</p>
        </div>

        <button id="btn-ayuda"
                class="coordinadores__ayuda"
                type="button"
                aria-label="Ayuda">
            ?
        </button>

    </div>

    <div class="coordinadores__tabla-contenedor">

        <c:if test="${not empty mensajeExito}">
            <div class="coordinadores__aviso coordinadores__aviso--exito">
                    ${mensajeExito}
            </div>
        </c:if>

        <c:if test="${not empty mensajeError}">
            <div class="coordinadores__aviso coordinadores__aviso--error">
                    ${mensajeError}
            </div>
        </c:if>

        <c:if test="${not empty campaniaSeleccionada}">
            <div class="coordinadores__aviso coordinadores__aviso--exito">
                Mostrando únicamente los coordinadores asociados a la campaña:
                <strong>${campaniaSeleccionada.nombre}</strong>
            </div>
        </c:if>

        <c:choose>
            <c:when test="${empty coordinadores}">
                <div class="coordinadores__vacio">
                    No hay coordinadores registrados.
                </div>
            </c:when>

            <c:otherwise>
                <table class="coordinadores__tabla">
                    <thead>
                    <tr>
                        <th>Coordinador</th>
                        <th>Campañas</th>
                        <th>Tiendas</th>
                        <th>Área asignada</th>
                        <th>Contacto</th>
                        <th>Permiso</th>
                    </tr>
                    </thead>

                    <tbody id="tabla-body">
                    <c:forEach var="coordinador" items="${coordinadores}">
                        <tr class="fila-coordinador coordinadores__fila"
                            data-id="${coordinador.id}"
                            data-contacto-id="${coordinador.contactoId}"
                            data-usuario-id="${coordinador.usuarioId}"
                            data-entidad-id="${coordinador.entidadId}"
                            data-permiso-modificar="${coordinador.permisoModificar}"
                            data-ids-campanias="${coordinador.idsCampanias}">

                            <td class="coordinadores__nombre">
                                <c:choose>
                                    <c:when test="${not empty coordinador.nombre}">
                                        ${coordinador.nombre}
                                    </c:when>

                                    <c:otherwise>
                                        Sin nombre
                                    </c:otherwise>
                                </c:choose>
                            </td>

                            <td>
                                <c:choose>
                                    <c:when test="${empty coordinador.nombresCampanias}">
                                        <span class="coordinadores__badge">Sin campañas</span>
                                    </c:when>

                                    <c:otherwise>
                                        <c:forEach var="nombreCampania" items="${coordinador.nombresCampanias}">
                                            <span class="coordinadores__badge">${nombreCampania}</span>
                                        </c:forEach>
                                    </c:otherwise>
                                </c:choose>
                            </td>

                            <td>
                                <c:choose>
                                    <c:when test="${not empty coordinador.tiendas}">
                                        ${coordinador.tiendas}
                                    </c:when>

                                    <c:otherwise>
                                        0
                                    </c:otherwise>
                                </c:choose>
                            </td>

                            <td>
                                <c:choose>
                                    <c:when test="${not empty coordinador.area}">
                                        ${coordinador.area}
                                    </c:when>

                                    <c:otherwise>
                                        Sin área
                                    </c:otherwise>
                                </c:choose>
                            </td>

                            <td>
                                <div class="coordinadores__contacto">
                                    <div>
                                        <c:choose>
                                            <c:when test="${not empty coordinador.email}">
                                                ${coordinador.email}
                                            </c:when>

                                            <c:otherwise>
                                                Sin email
                                            </c:otherwise>
                                        </c:choose>
                                    </div>

                                    <div>
                                        <c:choose>
                                            <c:when test="${not empty coordinador.telefono}">
                                                ${coordinador.telefono}
                                            </c:when>

                                            <c:otherwise>
                                                Sin teléfono
                                            </c:otherwise>
                                        </c:choose>
                                    </div>
                                </div>
                            </td>

                            <td>
                                <c:choose>
                                    <c:when test="${coordinador.permisoModificar}">
                                        <span class="coordinadores__badge">Sí</span>
                                    </c:when>

                                    <c:otherwise>
                                        <span class="coordinadores__badge">No</span>
                                    </c:otherwise>
                                </c:choose>
                            </td>
                        </tr>
                    </c:forEach>
                    </tbody>
                </table>
            </c:otherwise>
        </c:choose>

    </div>

    <div id="aviso-borrado"
         class="coordinadores__aviso-flotante"
         style="display: none;">
        ⚠️ Seleccione la fila correspondiente al coordinador que desee eliminar
    </div>

    <div class="coordinadores__acciones-inferiores">

        <form id="form-eliminar-coordinador"
              class="coordinadores__form-borrar"
              action="${pageContext.request.contextPath}/coordinadores/borrar"
              method="post">

            <input id="input-id-eliminar"
                   type="hidden"
                   name="id"
                   value="" />

            <button id="btn-eliminar-coordinador"
                    class="coordinadores__accion"
                    type="submit"
                    disabled>
                Eliminar coordinador
            </button>
        </form>

        <button id="btn-modificar-coordinador"
                class="coordinadores__accion"
                type="button"
                disabled>
            Modificar coordinador
        </button>

        <a id="btn-abrir-registro"
           class="coordinadores__accion coordinadores__accion--enlace"
           href="${pageContext.request.contextPath}/coordinadores/nuevo">
            Añadir coordinador
        </a>

        <button id="btn-exportar-coordinadores"
                class="coordinadores__accion coordinadores__accion--icono"
                type="button"
                title="Exportar coordinadores"
                aria-label="Exportar coordinadores">
            <img src="${pageContext.request.contextPath}/assets/file_export.svg"
                 alt="" />
        </button>

    </div>

</section>

<div id="modal-campanias" class="modal-overlay" style="display: none;">
    <div class="modal-content">
        <header class="modal-header">
            <h2>Seleccionar Campaña</h2>

            <button id="cerrar-selector"
                    class="btn-cerrar-modal"
                    type="button">
                X
            </button>
        </header>

        <div id="lista-campanias" class="campanias-grid">
            <button class="campania-card"
                    type="button"
                    data-id="">
                Todas las campañas
            </button>

            <c:forEach var="campania" items="${campanias}">
                <button class="campania-card"
                        type="button"
                        data-id="${campania.id}">
                        ${campania.nombre}
                </button>
            </c:forEach>
        </div>
    </div>
</div>