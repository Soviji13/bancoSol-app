<%@ page import="com.bancosol.dto.CampaniaDTO" %>
<%@ page import="com.bancosol.dto.CadenaDTO" %>
<%@ page import="java.util.List" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%
    CampaniaDTO campania = (CampaniaDTO) request.getAttribute("campania");
    List<CadenaDTO> cadenas = (List<CadenaDTO>) request.getAttribute("cadenas");
%>

<div style="padding: 20px;">
    <h3 style="color: #283593; margin-top: 0; font-size: 16px; text-align: center;">
        <%= campania.getNombre() != null ? campania.getNombre().toUpperCase() : "CAMPAÑA" %> <br> - Cadenas
    </h3>
    <hr style="margin-bottom: 20px;">

    <button type="submit" form="formVincularCadenas" style="width: 100%; color: #283593; background: #fff; border: 1px solid #283593; padding: 8px; margin-bottom: 10px; cursor: pointer; font-weight: bold;">
        Confirmar cambios
    </button>

    <a href="/campanias/gestion?id=<%= campania.getId() %>" style="text-decoration: none;">
        <button type="button" style="width: 100%; color: #283593; background: #fff; border: 1px solid #283593; padding: 8px; margin-bottom: 30px; cursor: pointer;">
            Descartar cambios
        </button>
    </a>

    <h4 style="color: #283593; margin-bottom: 10px; font-size: 14px; text-align: center; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Añadir cadena al sistema</h4>
    <form action="/cadenas/crear" method="post" style="margin-bottom: 20px;">
        <input type="hidden" name="campaniaId" value="<%= campania.getId() %>">
        <input type="text" name="nombre" placeholder="Nombre" required style="width: 100%; padding: 6px; margin-bottom: 10px; box-sizing: border-box;">
        <input type="text" name="codigo" placeholder="Código (Ej: MCD)" required style="width: 100%; padding: 6px; margin-bottom: 10px; box-sizing: border-box;">
        <button type="submit" style="width: 100%; color: #333; background: #f0f0f0; border: 1px solid #777; padding: 6px; cursor: pointer;">Añadir cadena</button>
    </form>

    <h4 style="color: red; margin-bottom: 10px; font-size: 14px; text-align: center; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Eliminar cadena del sistema</h4>
    <form action="/cadenas/eliminar" method="post" onsubmit="return confirm('¿Seguro que desea eliminar esta cadena del sistema? Se perderán sus datos asociados.');">
        <input type="hidden" name="campaniaId" value="<%= campania.getId() %>">
        <select name="cadenaId" required style="width: 100%; padding: 6px; margin-bottom: 10px; box-sizing: border-box;">
            <option value="">-- Seleccionar --</option>
            <% if (cadenas != null) {
                for(CadenaDTO c : cadenas) { %>
            <option value="<%= c.getId() %>"><%= c.getNombre() %></option>
            <%  }
            } %>
        </select>
        <button type="submit" style="width: 100%; color: red; background: #fff; border: 1px solid red; padding: 6px; cursor: pointer;">Eliminar cadena</button>
    </form>
</div>