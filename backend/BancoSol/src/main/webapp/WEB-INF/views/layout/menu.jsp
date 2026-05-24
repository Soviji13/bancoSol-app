<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%
    // Ahora leemos la variable 'pagina' en lugar de pelearnos con las URLs
    String paginaActual = (String) request.getAttribute("pagina");
    if (paginaActual == null) paginaActual = "";
%>
<style>
    .menu-lateral { display: flex; flex-direction: column; gap: 15px; padding: 20px; }
    .btn-menu { display: block; padding: 12px 15px; text-decoration: none; color: #333; border: 1px solid #666; border-radius: 8px; text-align: center; font-family: sans-serif; background-color: white; }
    .btn-menu.activo { background-color: #283593; color: white; border: 1px solid #283593; font-weight: bold; }
</style>

<div class="menu-lateral">
    <a href="/campanias" class="btn-menu <%= paginaActual.contains("campania") ? "activo" : "" %>">Gestionar campañas</a>

    <a href="/coordinadores" class="btn-menu <%= paginaActual.contains("coordinador") ? "activo" : "" %>">Gestionar coordinadores</a>
    <a href="/tiendas" class="btn-menu <%= paginaActual.contains("tienda") ? "activo" : "" %>">Gestionar tiendas</a>
    <a href="/colaboradores" class="btn-menu <%= paginaActual.contains("colaborador") ? "activo" : "" %>">Gestionar colaboradores</a>
    <a href="/voluntarios" class="btn-menu <%= paginaActual.contains("voluntario") ? "activo" : "" %>">Gestionar voluntarios</a>
    <a href="/incidencias" class="btn-menu <%= paginaActual.contains("incidencia") ? "activo" : "" %>">Incidencias y movimientos</a>
</div>