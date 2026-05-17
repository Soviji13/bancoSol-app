<%@ page import="com.bancosol.dto.CampaniaDTO" %>
<%@ page import="com.bancosol.dto.CadenaDTO" %>
<%@ page import="com.bancosol.dto.CoordinadorDTO" %>
<%@ page import="java.util.List" %>
<%@ page import="jakarta.servlet.http.HttpSession" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%
    HttpSession usuario = (HttpSession) request.getAttribute("usuario");
    CampaniaDTO campania = (CampaniaDTO) request.getAttribute("campania");
    List<CadenaDTO> cadenas = (List<CadenaDTO>) request.getAttribute("cadenas");
    List<CoordinadorDTO> coordinadores = (List<CoordinadorDTO>) request.getAttribute("coordinadores");
%>

<html>
<head>
    <title>Modificar Campaña</title>
    <script>
        function confirmarEliminacion(url, nombreCampania) {
            if (confirm("Atención: ¿Seguro que desea eliminar '" + nombreCampania + "'? Todos los datos relacionados con esta no se podrán recuperar y serán eliminados.")) {
                window.location.href = url;
            }
        }
    </script>
</head>
<body>

<table border="1" width="100%" height="100%" cellspacing="0" cellpadding="0">
    <tr>
        <td colspan="2" height="60" valign="middle">
            <img src="<%= request.getContextPath() %>/img/logo_bancosol.png" alt="Logo BancoSol" style="height: 40px; vertical-align: middle; margin-left: 10px;">
            <span style="margin-left: 10px;">Bienvenido <%= usuario.getId() %> </span>
            <a href="/" style="float: right; margin-right: 20px;">Cerrar Sesión</a>
        </td>
    </tr>

    <tr>
        <td width="25%" valign="top">
            <%@ include file="menu.jsp" %>
        </td>

        <td width="75%" valign="top">

            <form action="/campanias/guardar" method="post" id="formModificarCampania">
                <input type="hidden" name="id" value="<%= campania.getId() %>">

                <table width="100%" border="0" cellpadding="10">
                    <tr>
                        <td colspan="2" align="center">
                            <h2><%= campania.getNombre() != null ? campania.getNombre() : "Gran Recogida" %> - Modificación</h2>
                        </td>
                    </tr>
                    <tr>
                        <td width="40%" valign="top" style="border-right: 1px solid #aaa;">

                            <p>Nuevo nombre para la campaña:</p>
                            <input type="text" name="nombre" value="<%= campania.getNombre() %>" style="width: 100%;" required>

                            <p>Nueva fecha de inicio para la campaña:</p>
                            <input type="date" name="fechaInicio" value="<%= campania.getFechaInicio() %>" style="width: 100%;" required>

                            <p>Nueva fecha de cierre para la campaña:</p>
                            <input type="date" name="fechaFin" value="<%= campania.getFechaFin() %>" style="width: 100%;" required>

                            <br><br><br>

                            <table width="100%" border="0" cellspacing="10">
                                <tr>
                                    <td align="center">
                                        <button type="submit" style="width: 100%; color: blue; padding: 5px;">Confirmar cambios</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <a href="/campanias/gestion?id=<%= campania.getId() %>">
                                            <button type="button" style="width: 100%; color: blue; padding: 5px;">Descartar cambios</button>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <button type="button" onclick="confirmarEliminacion('/campanias/eliminar?id=<%= campania.getId() %>', '<%= campania.getNombre() %>')" style="width: 100%; color: red; padding: 5px; border-color: red;">Eliminar campaña</button>
                                    </td>
                                </tr>
                            </table>

                        </td>

                        <td width="60%" valign="top">
                            <table width="100%" border="0">
                                <tr>
                                    <td width="50%" valign="top">
                                        <table border="1" width="95%" align="center">
                                            <tr><th height="30" style="color: blue;">Cadenas</th></tr>
                                            <tr>
                                                <td height="250" valign="top">
                                                    <table width="100%" border="0">
                                                        <tr>
                                                            <%
                                                                int contador = 0;
                                                                for(CadenaDTO c : cadenas) {
                                                                    boolean asignada = campania.getIdsCadenas() != null && campania.getIdsCadenas().contains(c.getId());
                                                            %>
                                                            <td width="50%">
                                                                <input type="checkbox" name="idsCadenas" value="<%= c.getId() %>" <%= asignada ? "checked" : "" %>> <%= c.getNombre() %>
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
                                        <table border="1" width="95%" align="center">
                                            <tr><th height="30" style="color: blue;">Coordinadores</th></tr>
                                            <tr>
                                                <td height="250" valign="top" align="center">
                                                    <% if (coordinadores != null && !coordinadores.isEmpty()) {
                                                        for(CoordinadorDTO coord : coordinadores) { %>
                                                    <span style="color: blue; font-size: 14px;"><%= coord.getNombreContacto() %></span><br>
                                                    <%  }
                                                    } else { %>
                                                    <span style="color: gray; font-size: 12px;">Sin coordinadores</span>
                                                    <% } %>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

            </form>

        </td>
    </tr>
</table>

</body>
</html>