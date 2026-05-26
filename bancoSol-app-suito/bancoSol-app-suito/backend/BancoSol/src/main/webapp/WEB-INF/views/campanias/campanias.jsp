<%@ page import="java.util.List" %>
<%@ page import="com.bancosol.dto.CampaniaDTO" %>
<%@ page import="java.time.format.DateTimeFormatter" %>
<%@ page import="java.time.temporal.ChronoUnit" %>
<%@ page import="java.util.Locale" %>
<%@ page import="java.time.format.TextStyle" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>

<%
    List<CampaniaDTO> campanias = (List<CampaniaDTO>) request.getAttribute("campanias");
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yy");
    Locale localeES = new Locale("es", "ES");
%>

<style>
    .grid-campanias { display: flex; flex-wrap: wrap; gap: 20px; padding: 20px; font-family: sans-serif; }
    .card-campania { display: flex; flex-direction: column; justify-content: center; align-items: center; border: 1px solid #283593; border-radius: 8px; padding: 20px; width: 260px; text-decoration: none; background-color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: transform 0.2s; }
    .card-campania:hover { transform: translateY(-3px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    .card-campania.terminada { border-color: #e53935; }
    .card-titulo { color: #283593; font-size: 1.2em; margin-bottom: 10px; text-align: center; font-weight: bold; }
    .card-fechas { font-size: 0.85em; color: #555; margin-bottom: 8px; }
    .card-info { font-size: 0.8em; color: #283593; }
    .card-info.alerta { color: #e53935; }
</style>

<div class="grid-campanias">
    <%
        if(campanias != null) {
            for(CampaniaDTO c : campanias) {
                String fechasStr = "Fechas no definidas";
                String infoExtra = "";
                if (c.getFechaInicio() != null && c.getFechaFin() != null) {
                    fechasStr = c.getFechaInicio().format(formatter) + " - " + c.getFechaFin().format(formatter);
                    long dias = ChronoUnit.DAYS.between(c.getFechaInicio(), c.getFechaFin());
                    String mes = c.getFechaInicio().getMonth().getDisplayName(TextStyle.FULL, localeES);
                    infoExtra = "(" + dias + " días, " + mes + ")";
                }
                boolean activa = c.getActiva() != null && c.getActiva();
    %>
    <a href="/campanias/gestion?id=<%=c.getId()%>" class="card-campania <%= !activa ? "terminada" : "" %>">
        <div class="card-titulo"><%= c.getNombre() %></div>
        <div class="card-fechas"><%= fechasStr %></div>
        <% if(activa) { %>
        <div class="card-info"><%= infoExtra %></div>
        <% } else { %>
        <div class="card-info alerta">Terminada</div>
        <% } %>
    </a>
    <%  }
    } %>
</div>

<div style="border-top: 1px solid #ccc; padding-top: 20px; margin-top: 20px; text-align: center; width: 100%;">
    <a href="/campanias/generar" style="text-decoration: none;">
        <button type="button" style="padding: 10px 20px; font-family: sans-serif; color: #283593; background: white; border: 1px solid #283593; cursor: pointer; font-size: 16px; border-radius: 5px;">
            Generar campaña
        </button>
    </a>
</div>