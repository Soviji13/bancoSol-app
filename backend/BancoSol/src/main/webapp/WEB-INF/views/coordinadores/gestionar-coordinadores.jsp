<%@ page import="com.bancosol.dto.CampaniaDTO" %>
<%@ page import="com.bancosol.dto.CoordinadorDTO" %>
<%@ page import="java.util.List" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%
    CampaniaDTO campania = (CampaniaDTO) request.getAttribute("campania");
    List<CoordinadorDTO> asignados = (List<CoordinadorDTO>) request.getAttribute("asignados");
    List<CoordinadorDTO> noAsignados = (List<CoordinadorDTO>) request.getAttribute("noAsignados");
%>

<style>
    .panel { border: 1px solid #999; padding: 20px; background-color: #fcfcfc; margin-bottom: 30px; }
    .panel-titulo { font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 15px; color: #000; }
    select.input-classic { padding: 4px; border: 1px solid #666; width: 350px; background-color: #fff; }
    .btn-classic { background-color: #e0e0e0; border: 1px solid #777; color: #000; padding: 4px 12px; cursor: pointer; }
    .btn-classic:hover { background-color: #d0d0d0; }
    .tabla-datos { width: 100%; border-collapse: collapse; margin-top: 10px; }
    .tabla-datos th { background-color: #e8e8e8; border: 1px solid #999; padding: 6px; text-align: left; font-weight: bold; }
    .tabla-datos td { border: 1px solid #999; padding: 6px; background-color: #fff; }
    .mensaje-vacio { color: #555; font-style: italic; }
</style>

<table width="100%" border="0" style="margin-bottom: 25px;">
    <tr>
        <td width="10%">
            <a href="/campanias/gestion?id=<%= campania.getId() %>">
                <button type="button" class="btn-classic">Volver</button>
            </a>
        </td>
        <td width="90%">
            <h2 style="margin: 0; font-size: 18px; color: #000;">
                Coordinadores asignados a la campaña: <u><%= campania.getNombre() %></u>
            </h2>
        </td>
    </tr>
</table>

<div class="panel">
    <div class="panel-titulo">Vincular Coordinador Existente</div>
    <% if (noAsignados != null && !noAsignados.isEmpty()) { %>
    <form action="/campanias/gestion/coordinadores/vincular" method="post" style="margin: 0;">
        <input type="hidden" name="campaniaId" value="<%= campania.getId() %>">
        <label style="margin-right: 10px;">Seleccione un coordinador:</label>
        <select name="coordinadorId" class="input-classic">
            <% for(CoordinadorDTO c : noAsignados) { %>
            <option value="<%= c.getId() %>">
                <%= c.getNombreContacto() != null ? c.getNombreContacto() : "Sin nombre" %> - <%= c.getArea() %>
            </option>
            <% } %>
        </select>
        <button type="submit" class="btn-classic" style="margin-left: 10px;">Vincular</button>
    </form>
    <% } else { %>
    <span class="mensaje-vacio">No hay coordinadores disponibles para vincular.</span>
    <% } %>
</div>

<div class="panel">
    <div class="panel-titulo">Listado de Coordinadores Actuales</div>
    <% if (asignados != null && !asignados.isEmpty()) { %>
    <table class="tabla-datos">
        <tr>
            <th width="40%">Nombre del Contacto</th>
            <th width="35%">Área Asignada</th>
            <th width="15%" align="center">Acción</th>
        </tr>
        <% for(CoordinadorDTO c : asignados) { %>
        <tr>
            <td><%= c.getNombreContacto() != null ? c.getNombreContacto() : "Sin definir" %></td>
            <td><%= c.getArea() %></td>
            <td align="center">
                <form action="/campanias/gestion/coordinadores/desvincular" method="post" style="margin: 0;">
                    <input type="hidden" name="campaniaId" value="<%= campania.getId() %>">
                    <input type="hidden" name="coordinadorId" value="<%= c.getId() %>">
                    <button type="submit" class="btn-classic">Desvincular</button>
                </form>
            </td>
        </tr>
        <% } %>
    </table>
    <% } else { %>
    <span class="mensaje-vacio">La campaña no tiene ningún coordinador asignado.</span>
    <% } %>
</div>