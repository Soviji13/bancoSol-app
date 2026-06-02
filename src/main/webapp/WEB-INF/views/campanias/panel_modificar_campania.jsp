<%@ page import="com.bancosol.dto.CampaniaDTO" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%
    CampaniaDTO campania = (CampaniaDTO) request.getAttribute("campania");
%>

<div style="padding: 20px;">
    <h3 style="color: #283593; margin-top: 0; font-size: 16px; text-align: center;">
        <%= campania.getNombre() != null ? campania.getNombre().toUpperCase() : "CAMPAÑA" %> <br> - Modificación
    </h3>
    <hr style="margin-bottom: 20px;">

    <p style="margin-bottom: 5px; font-size: 14px;">Nuevo nombre para la campaña:</p>
    <input type="text" name="nombre" form="formModificar" value="<%= campania.getNombre() %>" style="width: 100%; padding: 6px; margin-bottom: 15px; box-sizing: border-box;" required>

    <p style="margin-bottom: 5px; font-size: 14px;">Nueva fecha de inicio para la campaña:</p>
    <input type="date" name="fechaInicio" form="formModificar" value="<%= campania.getFechaInicio() %>" style="width: 100%; padding: 6px; margin-bottom: 15px; box-sizing: border-box;" required>

    <p style="margin-bottom: 5px; font-size: 14px;">Nueva fecha de cierre para la campaña:</p>
    <input type="date" name="fechaFin" form="formModificar" value="<%= campania.getFechaFin() %>" style="width: 100%; padding: 6px; margin-bottom: 30px; box-sizing: border-box;" required>

    <button type="submit" form="formModificar" style="width: 100%; color: #283593; background: #fff; border: 1px solid #283593; padding: 8px; margin-bottom: 10px; cursor: pointer; font-weight: bold;">
        Confirmar cambios
    </button>

    <a href="/campanias/gestion?id=<%= campania.getId() %>" style="text-decoration: none;">
        <button type="button" style="width: 100%; color: #283593; background: #fff; border: 1px solid #283593; padding: 8px; margin-bottom: 10px; cursor: pointer;">
            Descartar cambios
        </button>
    </a>

    <button type="button" onclick="confirmarEliminacion('/campanias/eliminar?id=<%= campania.getId() %>', '<%= campania.getNombre() %>')" style="width: 100%; color: red; background: #fff; border: 1px solid red; padding: 8px; cursor: pointer;">
        Eliminar campaña
    </button>
</div>