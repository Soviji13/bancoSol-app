<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String uri = (String) request.getAttribute("jakarta.servlet.forward.request_uri");
    if (uri == null) {
        uri = request.getRequestURI();
    }

    String menuActivo = "";

    if (uri != null) {
        if (uri.contains("/coordinador")) {
            menuActivo = "coordinadores";
        } else if (uri.contains("/tiendas")) {
            menuActivo = "tiendas";
        } else if (uri.contains("/colaboradores")) {
            menuActivo = "colaboradores";
        } else if (uri.contains("/voluntarios")) {
            menuActivo = "voluntarios";
        } else if (uri.contains("/incidencias")) {
            menuActivo = "incidencias";
        } else if (uri.contains("/campanias")) {
            // Campañas va al final. Si la URL tiene "campanias" Y "coordinador",
            // entrará en el primer 'if' y nunca llegará aquí.
            menuActivo = "campanias";
        }
    }
%>
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
    <a href="/campanias" class="btn-menu <%= "campanias".equals(menuActivo) ? "activo" : "" %>">Gestionar campañas</a>
    <a href="/coordinadores" class="btn-menu <%= "coordinadores".equals(menuActivo) ? "activo" : "" %>">Gestionar coordinadores</a>
    <a href="/tiendas" class="btn-menu <%= "tiendas".equals(menuActivo) ? "activo" : "" %>">Gestionar tiendas</a>
    <a href="/colaboradores" class="btn-menu <%= "colaboradores".equals(menuActivo) ? "activo" : "" %>">Gestionar colaboradores</a>
    <a href="/voluntarios" class="btn-menu <%= "voluntarios".equals(menuActivo) ? "activo" : "" %>">Gestionar voluntarios</a>
    <a href="/incidencias" class="btn-menu <%= "incidencias".equals(menuActivo) ? "activo" : "" %>">Incidencias y movimientos</a>
</div>