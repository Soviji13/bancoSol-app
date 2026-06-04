<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<c:if test="${empty pagina}">
    <c:set var="pagina" value="campanias" scope="request" />
</c:if>

<c:if test="${empty panelIzquierdo}">
    <c:set var="panelIzquierdo" value="layout/menu.jsp" scope="request" />
</c:if>

<html>
<head>
    <title>BancoSol</title>

    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/global.css" />
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/inicio/inicio.css" />

    <%-- Estilos y JS Sofía (no afectan al resto) --%>
    <link rel="stylesheet" href="<c:url value='/css/entidades/badges.css' />">
    <link rel="stylesheet" href="<c:url value='/css/entidades/colaborador-seleccionado.css' />">
    <link rel="stylesheet" href="<c:url value='/css/entidades/encabezado.css' />">
    <link rel="stylesheet" href="<c:url value='/css/entidades/panel-filtros.css' />">
    <link rel="stylesheet" href="<c:url value='/css/entidades/pie.css' />">
    <link rel="stylesheet" href="<c:url value='/css/entidades/registro-colaborador.css' />">
    <link rel="stylesheet" href="<c:url value='/css/entidades/tabla.css' />">

    <c:if test="${pagina == 'inicio-entidades'}">
        <script type="module"
                src="${pageContext.request.contextPath}/js/entidades/tabla.js"
                defer>
        </script>
    </c:if>

    <%-- COORDINADORES: LISTADO --%>
    <c:if test="${pagina == 'gestionar-coordinadores'}">
        <link rel="stylesheet" href="${pageContext.request.contextPath}/css/coordinadores/encabezado.css" />
        <link rel="stylesheet" href="${pageContext.request.contextPath}/css/coordinadores/panelFiltro.css" />
        <link rel="stylesheet" href="${pageContext.request.contextPath}/css/coordinadores/tabla.css" />
        <link rel="stylesheet" href="${pageContext.request.contextPath}/css/coordinadores/pie.css" />
        <link rel="stylesheet" href="${pageContext.request.contextPath}/css/coordinadores/badges.css" />
        <link rel="stylesheet" href="${pageContext.request.contextPath}/css/coordinadores/coordinadores.css" />

    </c:if>

    <%-- COORDINADORES: FORMULARIO --%>
    <c:if test="${pagina == 'formulario-coordinador'}">
        <link rel="stylesheet" href="${pageContext.request.contextPath}/css/coordinadores/formularioCoordinador.css" />

        <script type="module"
                src="${pageContext.request.contextPath}/js/coordinadores/formularioCoordinador.js"
                defer>
        </script>
    </c:if>

    <%-- CAMPAÑAS --%>
    <c:if test="${pagina == 'gestion-campanias'}">
        <link rel="stylesheet" href="${pageContext.request.contextPath}/css/campanias/gestionar-campanias.css" />
    </c:if>

    <%-- INCIDENCIAS: LISTADO --%>
    <c:if test="${pagina == 'gestionar-incidencias'}">
        <link rel="stylesheet" href="${pageContext.request.contextPath}/css/incidencias/incidencias.css" />

        <c:if test="${panelIzquierdo == 'incidencias/panel-filtros.jsp'}">
            <link rel="stylesheet" href="${pageContext.request.contextPath}/css/incidencias/panelFiltro.css" />
        </c:if>

        <c:if test="${panelIzquierdo == 'incidencias/incidenciaSeleccionada.jsp'}">
            <link rel="stylesheet" href="${pageContext.request.contextPath}/css/incidencias/incidenciaSeleccionada.css" />
        </c:if>

        <script type="module"
                src="${pageContext.request.contextPath}/js/incidencias/incidencias.js"
                defer>
        </script>
    </c:if>

    <%-- INCIDENCIAS: FORMULARIO --%>
    <c:if test="${pagina == 'formulario-incidencia'}">
        <link rel="stylesheet" href="${pageContext.request.contextPath}/css/incidencias/formIncidencia.css" />

        <script type="module"
                src="${pageContext.request.contextPath}/js/incidencias/formIncidencia.js"
                defer>
        </script>
    </c:if>
</head>

<body data-context-path="${pageContext.request.contextPath}">

<div class="bs-inicio">

    <header class="bs-inicio__header">
        <jsp:include page="layout/header.jsp" />
    </header>

    <div class="bs-inicio__body">

        <aside class="bs-inicio__menu">
            <jsp:include page="${panelIzquierdo}" />
        </aside>

        <main class="bs-inicio__contenido">
            <c:choose>
                <c:when test="${pagina == 'campanias'}">
                    <jsp:include page="campanias/campanias.jsp" />
                </c:when>

                <c:when test="${pagina == 'generar-campania'}">
                    <jsp:include page="campanias/generar-campania.jsp" />
                </c:when>

                <c:when test="${pagina == 'gestion-campanias'}">
                    <jsp:include page="campanias/gestionar-campanias.jsp" />
                </c:when>

                <c:when test="${pagina == 'modificar-campania'}">
                    <jsp:include page="campanias/modificar-campania.jsp" />
                </c:when>

                <c:when test="${pagina == 'gestionar-cadenas'}">
                    <jsp:include page="cadenas/gestionar-cadenas.jsp" />
                </c:when>

                <c:when test="${pagina == 'gestionar-coordinadores'}">
                    <jsp:include page="coordinadores/listado.jsp" />
                </c:when>

                <c:when test="${pagina == 'formulario-coordinador'}">
                    <jsp:include page="coordinadores/formulario.jsp" />
                </c:when>

                <c:when test="${pagina == 'gestionar-incidencias'}">
                    <jsp:include page="incidencias/listado.jsp" />
                </c:when>

                <c:when test="${pagina == 'formulario-incidencia'}">
                    <jsp:include page="incidencias/formulario.jsp" />
                </c:when>

                <%-- ENTIDADES PÁGINA INICIAL (Sofía) --%>
                <c:when test="${pagina == 'inicio-entidades'}">
                    <jsp:include page="entidades_colaboradoras/tabla.jsp" />
                </c:when>

                <c:otherwise>
                    <p>No se ha encontrado la página solicitada.</p>
                </c:otherwise>
            </c:choose>
        </main>
    </div>

</div>

</body>
</html>