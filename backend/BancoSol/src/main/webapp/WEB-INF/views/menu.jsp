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

<div class="menu-lateral">
    <a href="/campanias" class="btn-menu activo">Gestionar campañas</a>
    <a href="#" class="btn-menu">Gestionar coordinadores</a>
    <a href="#" class="btn-menu">Gestionar tiendas</a>
    <a href="#" class="btn-menu">Gestionar colaboradores</a>
    <a href="#" class="btn-menu">Gestionar voluntarios</a>
    <a href="#" class="btn-menu">Incidencias y movimientos</a>
</div>