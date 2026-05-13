<%@ page import="com.bancosol.dto.CampaniaDTO" %>
<%@ page import="com.bancosol.dto.CadenaDTO" %>
<%@ page import="com.bancosol.dto.CoordinadorDTO" %>
<%@ page import="java.util.List" %>
<%@ page import="jakarta.servlet.http.HttpSession" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%
    // Recuperamos los objetos del modelo usando scriptlets puros
    HttpSession usuario = (HttpSession) request.getAttribute("usuario");
    CampaniaDTO campania = (CampaniaDTO) request.getAttribute("campania");
    List<CadenaDTO> cadenas = (List<CadenaDTO>) request.getAttribute("cadenas");
    List<CoordinadorDTO> coordinadores = (List<CoordinadorDTO>) request.getAttribute("coordinadores");
%>

<html>
<head>
    <title>Gestionar Campaña</title>
</head>
<body>

<table border="1" width="100%" height="500">
    <tr>
        <td colspan="4" height="50">
            <img src="<%= request.getContextPath() %>/img/logo_bancosol.png" alt="Logo BancoSol" style="height: 40px; width: auto; vertical-align: middle; margin-left: 10px;">
            <span style="vertical-align: middle; margin-left: 10px;">Bienvenido <%= usuario.getId() %> </span>
            <a href="/" style="float: right; margin-right: 20px; vertical-align: middle; line-height: 50px;">Cerrar Sesión</a>
        </td>
    </tr>

    <tr>
        <td rowspan="2" width="25%" valign="top">
            <%@ include file="menu.jsp" %>
        </td>

        <td colspan="3" valign="top">

            <table width="100%" border="0">
                <tr>
                    <td width="10%" align="center">
                        <a href="/campanias"><button type="button">Volver</button></a>
                    </td>
                    <td width="80%" align="center">
                        <h2><%= campania.getNombre() %></h2>
                    </td>
                    <td width="10%" align="center">
                        <button>?</button>
                    </td>
                </tr>
            </table>

            <br>

            <table width="100%" border="0">
                <tr>
                    <td width="50%" valign="top">
                        <table border="1" width="95%" align="center">
                            <tr><th height="30">Cadenas</th></tr>
                            <tr>
                                <td height="200" valign="top">
                                    <table width="100%" border="0">
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

                                                    if(contador % 2 == 0) {
                                                        out.print("</tr><tr>");
                                                    }
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
                            <tr><th height="30">Coordinadores</th></tr>
                            <tr>
                                <td height="100" valign="top">
                                    <% for(CoordinadorDTO coord : coordinadores) { %>
                                    <a href="/campanias/gestion/coordinador?id=<%= coord.getId() %>"> <%= coord.getNombreContacto() %></a> <br>
                                    <% } %>
                                </td>
                            </tr>
                        </table>

                        <br>

                        <table width="95%" align="center">
                            <tr>
                                <td align="center">
                                    <a href="/campanias/gestion/modificar?id=<%= campania.getId() %>">
                                        <button type="button" style="width: 100%; padding: 5px;">Modificar Campaña</button>
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td align="center">
                                    <a href="/campanias/gestion/cadenas?id=<%= campania.getId() %>">
                                        <button type="button" style="width: 100%; padding: 5px;">Gestionar cadenas</button>
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td align="center">
                                    <a href="/campanias/gestion/coordinadores?id=<%= campania.getId() %>">
                                        <button type="button" style="width: 100%; padding: 5px;">Gestionar Coordinadores</button>
                                    </a>
                                </td>
                            </tr>
                        </table>

                    </td>
                </tr>
            </table>

        </td>
    </tr>

    <tr height="50">
        <td align="center">
            <button>&larr;</button>
        </td>
        <td align="center">
            <a href="/campanias"><button type="button" style="color: red;">Descartar cambios</button></a>
        </td>
        <td align="center">
            <button>&rarr;</button>
        </td>
    </tr>
</table>

</body>
</html>