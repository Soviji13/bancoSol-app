<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<div class="encabezado">
    <div class="filtro-campania-container">
        <div class="boton-filtro">
            <button id="filtrar" type="button" aria-label="Filtrar coordinadores">&nbsp;</button>
        </div>

        <div class="cambiar-campania">
            <button id="btn-seleccionar-campania" type="button">
                Seleccionar otra campaña
            </button>
        </div>
    </div>

    <c:choose>
        <c:when test="${not empty campaniaSeleccionada}">
            <h1>Coordinadores de ${campaniaSeleccionada.nombre}</h1>
        </c:when>
        <c:otherwise>
            <h1>Todos los coordinadores</h1>
        </c:otherwise>
    </c:choose>

    <div class="help-container">
        <p>Para ver más información sobre el coordinador, haga doble click sobre su fila correspondiente</p>
        <button id="btn-ayuda" class="simbolo" type="button" aria-label="Ayuda">?</button>
    </div>
</div>

<aside id="panel-filtros" class="panel-filtros" hidden>
    <header class="panel-filtros__cabecera">
        <div>
            <h2>Filtros de búsqueda</h2>

            <c:choose>
                <c:when test="${not empty campaniaSeleccionada}">
                    <span class="badge-id">
                        Campaña: ${campaniaSeleccionada.nombre}
                    </span>
                </c:when>

                <c:otherwise>
                    <span class="badge-id">
                        Ajuste de resultados
                    </span>
                </c:otherwise>
            </c:choose>
        </div>

        <button id="btn-cerrar-filtros"
                class="panel-filtros__cerrar"
                type="button"
                aria-label="Cerrar filtros">
            ←
        </button>
    </header>

    <div class="panel-filtros__contenido">
        <section class="panel-filtros__bloque border-bottom">
            <div class="panel-filtros__campo">
                <label for="filtro-nombre">Nombre:</label>
                <input id="filtro-nombre"
                       class="input-linea"
                       type="text"
                       placeholder="Buscar por nombre..." />
            </div>

            <div class="panel-filtros__campo">
                <label for="filtro-campania">Campaña:</label>

                <select id="filtro-campania" class="input-linea">
                    <option value=""
                            <c:if test="${empty campaniaIdSeleccionada}">selected</c:if>>
                        Todas las campañas
                    </option>

                    <c:forEach var="campania" items="${campanias}">
                        <option value="${campania.id}"
                                <c:if test="${campania.id == campaniaIdSeleccionada}">selected</c:if>>
                                ${campania.nombre}
                        </option>
                    </c:forEach>
                </select>
            </div>

            <div class="panel-filtros__campo">
                <label for="filtro-tiendas">Nº tiendas:</label>
                <input id="filtro-tiendas"
                       class="input-linea"
                       type="number"
                       min="0"
                       placeholder="Ej: 3" />
            </div>
        </section>

        <section class="panel-filtros__bloque">
            <button id="btn-aplicar-filtros"
                    class="btn-guardar-lateral"
                    type="button">
                Aplicar filtros
            </button>

            <button id="btn-limpiar-filtros"
                    class="btn-limpiar-filtros"
                    type="button">
                Limpiar todos los filtros
            </button>
        </section>
    </div>
</aside>

<main id="contenido-principal" class="contenido-principal">

    <c:if test="${not empty mensajeExito}">
        <div class="aviso-listado aviso-listado--exito">
                ${mensajeExito}
        </div>
    </c:if>

    <c:if test="${not empty mensajeError}">
        <div class="aviso-listado aviso-listado--error">
                ${mensajeError}
        </div>
    </c:if>

    <c:if test="${not empty campaniaSeleccionada}">
        <div class="aviso-listado aviso-listado--exito">
            Mostrando únicamente los coordinadores asociados a la campaña:
            <strong>${campaniaSeleccionada.nombre}</strong>
        </div>
    </c:if>

    <table>
        <thead>
        <tr>
            <td>Coordinador</td>
            <td>Campañas</td>
            <td>Tiendas</td>
            <td>Área asignada</td>
            <td>Contacto</td>
            <td>Permiso</td>
        </tr>
        </thead>

        <tbody id="tabla-body">
        <c:choose>
            <c:when test="${empty coordinadores}">
                <tr>
                    <td colspan="6">
                        No hay coordinadores registrados.
                    </td>
                </tr>
            </c:when>

            <c:otherwise>
                <c:forEach var="coordinador" items="${coordinadores}">
                    <tr data-id="${coordinador.id}"
                        data-contacto-id="${coordinador.contactoId}"
                        data-usuario-id="${coordinador.usuarioId}"
                        data-entidad-id="${coordinador.entidadId}"
                        data-permiso-modificar="${coordinador.permisoModificar}"
                        data-ids-campanias="${coordinador.idsCampanias}">

                        <td>
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
                                    <span class="badge">Sin campañas</span>
                                </c:when>

                                <c:otherwise>
                                    <c:forEach var="nombreCampania" items="${coordinador.nombresCampanias}">
                                        <span class="badge">${nombreCampania}</span>
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
                            <div>
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
                                    <span class="badge">Sí</span>
                                </c:when>
                                <c:otherwise>
                                    <span class="badge">No</span>
                                </c:otherwise>
                            </c:choose>
                        </td>
                    </tr>
                </c:forEach>
            </c:otherwise>
        </c:choose>
        </tbody>
    </table>
</main>

<div id="aviso-borrado" class="aviso-flotante" style="display: none;">
    ⚠️ Seleccione la fila correspondiente al coordinador que desee eliminar
</div>

<div class="pie-pagina">
    <div class="container-interactuar">

        <form id="form-eliminar-coordinador"
              action=""
              method="post"
              class="form-accion-pie">
            <button id="btn-eliminar-coordinador"
                    class="accion-pie activado"
                    type="submit">
                Eliminar coordinador
            </button>
        </form>

        <a id="btn-modificar-coordinador"
           class="accion-pie desactivado"
           href="#"
           title="Debes primero seleccionar un coordinador">
            Modificar coordinador
        </a>

        <a id="btn-abrir-registro"
           class="accion-pie activado"
           href="${pageContext.request.contextPath}/coordinadores/nuevo">
            Añadir coordinador
        </a>

    </div>

    <div class="csv activado" title="Exportar coordinadores">&nbsp;</div>
</div>

<div id="modal-campanias" class="modal-overlay" style="display: none;">
    <div class="modal-content">
        <header class="modal-header">
            <h2>Seleccionar Campaña</h2>
            <button id="cerrar-selector" class="btn-cerrar-modal" type="button">
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