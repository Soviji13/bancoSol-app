<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%
    Object usuario = session.getAttribute("usuario");
    String nombreUsuario = (usuario != null) ? usuario.toString() : "Nombre apellidos";
%>

<div class="header-bancosol">
    <img src="<%= request.getContextPath() %>/assets/logo.png"
         alt="Logo BancoSol"
         style="height: 40px; vertical-align: middle; margin-left: 10px;">

    <span style="margin-left: 10px;">
        Bienvenido, <%= nombreUsuario %> <br>
        <small style="color: #666;">Administrador</small>
    </span>

    <a href="<%= request.getContextPath() %>/logout"
       style="float: right; margin-right: 20px; text-decoration: none; font-weight: bold; color: #333;">
        Cerrar sesión
    </a>
</div>