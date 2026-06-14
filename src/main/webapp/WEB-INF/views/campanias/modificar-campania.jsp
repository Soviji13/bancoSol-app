<%-- Alejandro Jiménez González --%>
<%@ page import="com.bancosol.dto.CampaniaDTO" %>
<%@ page import="com.bancosol.dto.CadenaDTO" %>
<%@ page import="com.bancosol.dto.CoordinadorDTO" %>
<%@ page import="java.util.List" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%
    CampaniaDTO campania = (CampaniaDTO) request.getAttribute("campania");
    List<CadenaDTO> cadenas = (List<CadenaDTO>) request.getAttribute("cadenas");
    List<CoordinadorDTO> coordinadores = (List<CoordinadorDTO>) request.getAttribute("coordinadores");
%>

<script>
    function confirmarEliminacion(url, nombreCampania) {
        if (confirm("Atención: ¿Seguro que desea eliminar '" + nombreCampania + "'? Todos los datos relacionados con esta no se podrán recuperar y serán eliminados.")) {
            window.location.href = url;
        }
    }
</script>

<form action="/campanias/guardar" method="post" id="formModificar">
    <input type="hidden" name="id" value="<%= campania.getId() %>">
</form>

<div class="modificar-container">
    <div class="modificar-header">
        <div class="modificar-header-left">
            <a href="/campanias/gestion?id=<%=campania.getId()%>" class="btn-volver">Volver</a>
        </div>
        <div class="modificar-header-center">
            <h2 class="modificar-title">
                <%= campania.getNombre() != null ? campania.getNombre().toUpperCase() : "GRAN RECOGIDA" %>
            </h2>
        </div>
        <div class="modificar-header-right">
        </div>
    </div>

    <hr class="modificar-divider">

    <div class="modificar-grid">

        <div class="modificar-card">
            <div class="modificar-card-header">Cadenas</div>
            <div class="modificar-card-body">
                <div class="cadenas-grid">
                    <% for(CadenaDTO c : cadenas) {
                        boolean asignada = campania.getIdsCadenas() != null && campania.getIdsCadenas().contains(c.getId());
                    %>
                    <label class="cadena-item">
                        <input type="checkbox" name="idsCadenas" value="<%= c.getId() %>" form="formModificar" <%= asignada ? "checked" : "" %>>
                        <span><%= c.getNombre() %></span>
                    </label>
                    <% } %>
                </div>
            </div>
        </div>

        <div class="modificar-card">
            <div class="modificar-card-header">Coordinadores</div>
            <div class="modificar-card-body modificar-card-body--center">
                <% if (coordinadores != null && !coordinadores.isEmpty()) {
                    for(CoordinadorDTO coord : coordinadores) { %>
                <div class="coordinador-item"><%= coord.getNombre().toUpperCase() %></div>
                <%  }
                } else { %>
                <div class="coordinador-empty">Sin coordinadores asignados</div>
                <% } %>
            </div>
        </div>

    </div>
</div>