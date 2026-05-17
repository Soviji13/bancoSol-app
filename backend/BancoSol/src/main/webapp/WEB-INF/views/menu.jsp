<%@ page contentType="text/html;charset=UTF-8" language="java" %>
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

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    // Capturamos la ruta actual de la URL (ej: "/campanias/gestion")
    String uri = request.getRequestURI();
%>
<style>
    /* ... (tu CSS se queda exactamente igual) ... */
</style>

<div class="menu-lateral">
    <a href="/campanias" class="btn-menu <%= uri.contains("/campanias") ? "activo" : "" %>">Gestionar campañas</a>
    <a href="/coordinadores" class="btn-menu <%= uri.contains("/coordinador") ? "activo" : "" %>">Gestionar coordinadores</a>
    <a href="/tiendas" class="btn-menu <%= uri.contains("/tiendas") ? "activo" : "" %>">Gestionar tiendas</a>
    <a href="/colaboradores" class="btn-menu <%= uri.contains("/colaboradores") ? "activo" : "" %>">Gestionar colaboradores</a>
    <a href="/voluntarios" class="btn-menu <%= uri.contains("/voluntarios") ? "activo" : "" %>">Gestionar voluntarios</a>
    <a href="/incidencias" class="btn-menu <%= uri.contains("/incidencias") ? "activo" : "" %>">Incidencias y movimientos</a>
</div>