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

<style>
    .btn-classic { background-color: #f0f0f0; border: 1px solid #777; color: #000; padding: 5px 15px; cursor: pointer; }
    .btn-classic:hover { background-color: #e0e0e0; }
    .btn-action-wide { width: 100%; padding: 8px; margin-bottom: 5px; background-color: #f0f0f0; border: 1px solid #777; cursor: pointer; }
    .btn-status { padding: 6px 20px; border-radius: 15px; border: none; cursor: pointer; color: white; font-weight: bold; }
    .list-container { border: 1px solid #999; padding: 10px; height: 170px; overflow-y: auto; background-color: #fff; }
    .link-classic { color: #4b0082; text-decoration: underline; }
    .th-classic { background-color: #fff; font-size: 15px; padding: 5px; border-bottom: 1px solid #999; color: #000; }
</style>

<table width="100%" border="0" style="margin-bottom: 20px;">
    <tr>
        <td width="15%" align="left" valign="top">
            <a href="/campanias"><button type="button" class="btn-classic">Volver</button></a>
        </td>
        <td width="70%" align="center">
            <h1 style="margin: 0 0 10px 0; font-size: 24px; text-transform: uppercase; font-family: 'Times New Roman', Times, serif; color: #000;">
                <%= campania.getNombre() %>
            </h1>

            <% boolean estaActiva = campania.getActiva() != null && campania.getActiva(); %>
            <form action="/campanias/cambiar-estado" method="post" style="margin: 0; display: inline-block;">
                <input type="hidden" name="id" value="<%= campania.getId() %>">
                <input type="hidden" name="nuevoEstado" value="<%= !estaActiva %>">
                <button type="submit" class="btn-status" style="background-color: <%= estaActiva ? "#2e7d32" : "#c62828" %>;">
                    <%= estaActiva ? "Campaña Activa (Dar por terminada)" : "Campaña Terminada (Activar ahora)" %>
                </button>
            </form>
        </td>
        <td width="15%"></td>
    </tr>
</table>

<table width="100%" border="0" cellpadding="10">
    <tr>
        <td width="55%" valign="top">
            <table border="1" width="100%" style="border-collapse: collapse; border-color: #999;">
                <tr><th class="th-classic">Cadenas</th></tr>
                <tr>
                    <td valign="top" style="padding: 0;">
                        <div class="list-container">
                            <table width="100%" border="0" cellpadding="5">
                                <tr>
                                    <%
                                        int contador = 0;
                                        for(CadenaDTO c : cadenas) {
                                            boolean asignada = campania.getIdsCadenas() != null && campania.getIdsCadenas().contains(c.getId());
                                    %>
                                    <td width="50%">
                                        <input type="checkbox" name="idsCadenasSeleccionadas" value="<%= c.getId() %>" <%= asignada ? "checked" : "" %> disabled> <%= c.getNombre() %>
                                    </td>
                                    <%
                                            contador++;
                                            if(contador % 2 == 0) out.print("</tr><tr>");
                                        }
                                    %>
                                </tr>
                            </table>
                        </div>
                    </td>
                </tr>
            </table>
        </td>

        <td width="45%" valign="top">
            <table border="1" width="100%" style="border-collapse: collapse; border-color: #999; margin-bottom: 15px;">
                <tr><th class="th-classic">Coordinadores</th></tr>
                <tr>
                    <td valign="top" style="padding: 0;">
                        <div class="list-container" style="height: 100px;">
                            <% for(CoordinadorDTO coord : coordinadores) { %>
                            <div style="margin-bottom: 8px;">
                                <a href="/campanias/gestion/coordinador?id=<%= coord.getId() %>" class="link-classic">
                                    <%= coord.getNombreContacto() != null ? coord.getNombreContacto().toUpperCase() : "SIN DEFINIR" %>
                                </a>
                            </div>
                            <% } %>
                        </div>
                    </td>
                </tr>
            </table>

            <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                    <td>
                        <a href="/campanias/gestion/modificar?id=<%= campania.getId() %>" style="text-decoration: none;">
                            <button type="button" class="btn-action-wide">Modificar Campaña</button>
                        </a>
                    </td>
                </tr>
                <tr>
                    <td>
                        <a href="/campanias/gestion/cadenas?id=<%= campania.getId() %>" style="text-decoration: none;">
                            <button type="button" class="btn-action-wide">Gestionar Cadenas</button>
                        </a>
                    </td>
                </tr>
                <tr>
                    <td>
                        <a href="/campanias/gestion/coordinadores?id=<%= campania.getId() %>" style="text-decoration: none;">
                            <button type="button" class="btn-action-wide">Gestionar Coordinadores</button>
                        </a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>