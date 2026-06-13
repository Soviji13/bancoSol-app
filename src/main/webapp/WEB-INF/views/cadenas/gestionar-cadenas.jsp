<%-- Alejandro Jiménez González  --%>

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

<form action="/campanias/gestion/cadenas/vincular" method="post" id="formVincularCadenas">
    <input type="hidden" name="campaniaId" value="<%= campania.getId() %>">
</form>

<div class="vincular-container">
    <div class="vincular-header">
        <div class="vincular-header-left">
            <a href="/campanias/gestion?id=<%=campania.getId()%>" class="btn-volver">Volver</a>
        </div>
        <div class="vincular-header-center">
            <h2 class="vincular-title">
                <%= campania.getNombre() != null ? campania.getNombre().toUpperCase() : "CAMPAÑA" %>
            </h2>
        </div>
        <div class="vincular-header-right"></div>
    </div>

    <hr class="vincular-divider">

    <div class="vincular-grid">

        <div class="vincular-card">
            <div class="vincular-card-header">Cadenas</div>
            <div class="vincular-card-body">
                <div class="cadenas-grid">
                    <% for(CadenaDTO c : cadenas) {
                        boolean asignada = campania.getIdsCadenas() != null && campania.getIdsCadenas().contains(c.getId());
                    %>
                    <label class="cadena-item">
                        <input type="checkbox" name="idsCadenas" value="<%= c.getId() %>" form="formVincularCadenas" <%= asignada ? "checked" : "" %>>
                        <span><%= c.getNombre() %></span>
                    </label>
                    <% } %>
                </div>

                <div class="vincular-actions">
                    <button type="submit" form="formVincularCadenas" class="btn-guardar">Vincular Cadenas</button>
                </div>
            </div>
        </div>

        <div class="vincular-card">
            <div class="vincular-card-header">Coordinadores</div>
            <div class="vincular-card-body vincular-card-body--center">
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