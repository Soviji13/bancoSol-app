<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Gestionar coordinadores</title>

    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/global.css" />

    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/coordinadores/encabezado.css" />
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/coordinadores/panelFiltro.css" />
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/coordinadores/tabla.css" />
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/coordinadores/pie.css" />
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/coordinadores/badges.css" />
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/coordinadores/coordinadores.css" />
    <script type="module" src="${pageContext.request.contextPath}/js/coordinadores/coordinadores.js" defer></script>
</head>

<body data-context-path="${pageContext.request.contextPath}">
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

    <h1>Gran recogida</h1>

    <div class="help-container">
        <p>Para ver más información sobre el coordinador, haga doble click sobre su fila correspondiente</p>
        <button id="btn-ayuda" class="simbolo" type="button" aria-label="Ayuda">?</button>
    </div>
</div>

<aside id="panel-filtros" class="panel-filtros" hidden>
    <header class="panel-filtros__cabecera">
        <div>
            <h2>Filtros de búsqueda</h2>
            <span class="badge-id">Ajuste de resultados</span>
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
                    <option value="">Todas las campañas</option>

                    <c:forEach var="campania" items="${campanias}">
                        <option value="${campania.id}">
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
                        data-permiso-modificar="${coordinador.permisoModificar}"
                        data-ids-campanias="${coordinador.idsCampanias}">

                        <td>
                                ${coordinador.nombre}
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
                                ${coordinador.tiendas}
                        </td>

                        <td>
                                ${coordinador.area}
                        </td>

                        <td>
                            <div>
                                <div>${coordinador.email}</div>
                                <div>${coordinador.telefono}</div>
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
            <button id="cerrar-selector" class="btn-cerrar-modal" type="button">X</button>
        </header>

        <div id="lista-campanias" class="campanias-grid">
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
</body>
</html>