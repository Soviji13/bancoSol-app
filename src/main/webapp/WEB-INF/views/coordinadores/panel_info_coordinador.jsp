<%@ page import="com.bancosol.dto.CoordinadorDTO" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%
    CoordinadorDTO coord = (CoordinadorDTO) request.getAttribute("coordinador");
    if (coord == null) coord = new CoordinadorDTO();
%>
<div style="padding: 20px;">
    <h3 style="color: #283593; margin-bottom: 5px; font-size: 16px;">
        <%= coord.getNombre() != null ? coord.getNombre().toUpperCase() : "COORDINADOR" %>
    </h3>
    <small style="color: #666;">Área: <%= coord.getArea() != null ? coord.getArea() : "Sin asignar" %></small>

    <hr style="margin: 20px 0;">

    <p style="color: #283593; font-weight: bold; margin-bottom: 10px;">Información de contacto</p>
    <p style="font-size: 13px; margin: 5px 0;"><b>Teléfono:</b> <br><%= coord.getTelefono() != null ? coord.getTelefono() : "N/A" %></p>
    <p style="font-size: 13px; margin: 10px 0 5px 0;"><b>Correo electrónico:</b> <br><%= coord.getEmail() != null ? coord.getEmail() : "N/A" %></p>
</div>