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

    <c:if test="${pagina == 'gestionar-coordinadores'}">
        <link rel="stylesheet" href="${pageContext.request.contextPath}/css/coordinadores/encabezado.css" />
        <link rel="stylesheet" href="${pageContext.request.contextPath}/css/coordinadores/panelFiltro.css" />
        <link rel="stylesheet" href="${pageContext.request.contextPath}/css/coordinadores/tabla.css" />
        <link rel="stylesheet" href="${pageContext.request.contextPath}/css/coordinadores/pie.css" />
        <link rel="stylesheet" href="${pageContext.request.contextPath}/css/coordinadores/badges.css" />
        <link rel="stylesheet" href="${pageContext.request.contextPath}/css/coordinadores/coordinadores.css" />

        <script type="module"
                src="${pageContext.request.contextPath}/js/coordinadores/coordinadores.js"
                defer>
        </script>
    </c:if>

    <c:if test="${pagina == 'gestion-campanias'}">
        <link rel="stylesheet" href="${pageContext.request.contextPath}/css/campanias/gestionar-campanias.css" />
    </c:if>
</head>

<body data-context-path="${pageContext.request.contextPath}">

<div class="bs-inicio">

    <p> ${pagina}</p>
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

                <c:when test="${pagina == 'detalles-coordinador'}">
                    <jsp:include page="coordinadores/detalles-coordinador.jsp" />
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