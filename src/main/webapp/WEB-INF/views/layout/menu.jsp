<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%
    String paginaActual = (String) request.getAttribute("pagina");
    if (paginaActual == null) { paginaActual = ""; }
    String contextPath = request.getContextPath();
%>

<%-- BASE JOSE GONZALEZ BLANCO, REFACTORIZACION PARA ROLES VISUAL SOFIA SI VILLALBA JIMENEZ AYUDA IA PARA AUTOMATIZAR CODIGO --%>

<style>
    .menu-lateral {
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding: 20px;
    }

    .btn-menu {
        display: block;
        padding: 12px 15px;
        text-decoration: none;
        color: #333;
        border: 1px solid #666;
        border-radius: 8px;
        text-align: center;
        font-family: sans-serif;
        background-color: white;
    }

    .btn-menu.activo {
        background-color: #283593;
        color: white;
        border: 1px solid #283593;
        font-weight: bold;
    }
</style>

<div class="menu-lateral">
    <%-- 1. GESTIONAR CAMPAÑAS: Solo para ADMINISTRADOR --%>
    <c:if test="${sessionScope.usuarioLogueado.rol == 'ADMIN'}">
        <a href="<%= contextPath %>/campanias"
        class="btn-menu <%= paginaActual.contains("campania") ? "activo" : "" %>">
            Gestionar campañas
        </a>
    </c:if>

    <%-- 2. GESTIONAR COORDINADORES: Solo para ADMINISTRADOR --%>
    <c:if test="${sessionScope.usuarioLogueado.rol == 'ADMIN'}">
        <a href="<%= contextPath %>/coordinadores"
        class="btn-menu <%= paginaActual.contains("coordinador") ? "activo" : "" %>">
            Gestionar coordinadores
        </a>
    </c:if>

    <%-- 3. GESTIONAR TIENDAS: Accesible por todos los roles --%>
    <a href="<%= contextPath %>/tiendas"
    class="btn-menu <%= paginaActual.contains("tienda") ? "activo" : "" %>">
        Gestionar tiendas
    </a>

    <%-- 4. GESTIONAR COLABORADORES: Para todos MENOS Responsable de Tienda --%>
    <c:if test="${sessionScope.usuarioLogueado.rol != 'RESPONSABLE_TIENDA'}">
        <a href="<%= contextPath %>/entidades"
        class="btn-menu <%= paginaActual.contains("entidad") ? "activo" : "" %>">
            Gestionar colaboradores
        </a>
    </c:if>

    <%-- 5. GESTIONAR VOLUNTARIOS: Accesible por todos los roles --%>
    <a href="<%= contextPath %>/voluntarios"
    class="btn-menu <%= paginaActual.contains("voluntario") ? "activo" : "" %>">
        Gestionar voluntarios
    </a>

    <%-- 6. INCIDENCIAS Y MOVIMIENTOS: Accesible por todos los roles --%>
    <a href="<%= contextPath %>/incidencias"
    class="btn-menu <%= paginaActual.contains("incidencia") ? "activo" : "" %>">
        Incidencias y movimientos
    </a>
</div>