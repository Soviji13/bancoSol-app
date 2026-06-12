<%-- Alejandro Jiménez González 80% (20% IA CSS Y SCRIPT ) --%>
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

<table width="100%" border="0" cellpadding="10">
    <tr>
        <td colspan="2" align="center">
            <a href="/campanias/gestion?id=<%=campania.getId()%>" style="background-color: #f0f0f0; border: 1px solid #777; color: #000; padding: 5px 15px; cursor: pointer; text-decoration: none; display: inline-block; font-family: Arial, sans-serif; font-size: 14px; margin-bottom: 20px;" onmouseover="this.style.backgroundColor='#e0e0e0'" onmouseout="this.style.backgroundColor='#f0f0f0'">Volver</a>
            <h2><font color="#283593"><%= campania.getNombre() != null ? campania.getNombre() : "Gran Recogida" %></font></h2>
            <hr>
        </td>
    </tr>
    <tr>
        <td width="50%" valign="top">
            <table border="1" width="95%" align="center" style="border-collapse: collapse; border-color: #999;">
                <tr><th height="30" style="color: blue; background-color: #fff;">Cadenas</th></tr>
                <tr>
                    <td height="250" valign="top" style="padding: 15px;">
                        <table width="100%" border="0" cellpadding="5">
                            <tr>
                                <%
                                    int contador = 0;
                                    for(CadenaDTO c : cadenas) {
                                        boolean asignada = campania.getIdsCadenas() != null && campania.getIdsCadenas().contains(c.getId());
                                %>
                                <td width="50%">
                                    <input type="checkbox" name="idsCadenas" value="<%= c.getId() %>" form="formModificar" <%= asignada ? "checked" : "" %>> <%= c.getNombre() %>
                                </td>
                                <%
                                        contador++;
                                        if(contador % 2 == 0) out.print("</tr><tr>");
                                    }
                                %>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>

        <td width="50%" valign="top">
            <table border="1" width="95%" align="center" style="border-collapse: collapse; border-color: #999;">
                <tr><th height="30" style="color: blue; background-color: #fff;">Coordinadores</th></tr>
                <tr>
                    <td height="250" valign="top" align="center" style="padding: 15px;">
                        <% if (coordinadores != null && !coordinadores.isEmpty()) {
                            for(CoordinadorDTO coord : coordinadores) { %>
                        <span style="color: blue; font-size: 14px;"><%= coord.getNombre() %></span><br>
                        <%  }
                        } else { %>
                        <span style="color: gray; font-size: 12px; font-style: italic;">Sin coordinadores</span>
                        <% } %>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>