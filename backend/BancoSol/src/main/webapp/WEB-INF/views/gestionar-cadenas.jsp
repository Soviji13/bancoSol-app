<%@ page import="com.bancosol.dto.CampaniaDTO" %>
<%@ page import="com.bancosol.dto.CadenaDTO" %>
<%@ page import="java.util.List" %>
<%@ page import="jakarta.servlet.http.HttpSession" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%
    HttpSession usuario = (HttpSession) request.getAttribute("usuario");
    CampaniaDTO campania = (CampaniaDTO) request.getAttribute("campania");
    List<CadenaDTO> cadenas = (List<CadenaDTO>) request.getAttribute("cadenas");
%>

<html>
<head>
    <title>Gestionar Cadenas</title>
    <script>
        function confirmarEliminacionCadena() {
            var select = document.getElementById("selectCadena");
            var nombreCadena = select.options[select.selectedIndex].text;

            if(select.value === "") {
                alert("Por favor, seleccione una cadena primero.");
                return false;
            }
            return confirm("¿Está seguro de que desea eliminar la cadena '" + nombreCadena + "' del sistema? Se perderán sus datos asociados.");
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

            <table width="100%" border="0" cellpadding="10">
                <tr>
                    <td colspan="2" align="center">
                        <h2><font color="#283593"><%= campania.getNombre() %> - Gestión de Cadenas</font></h2>
                        <hr>
                    </td>
                </tr>

                <tr>
                    <td width="50%" valign="top" style="border-right: 1px solid #aaa;">
                        <h3 style="color: blue;">Cadenas disponibles</h3>
                        <p style="font-size: 12px; color: #666;">Marque o desmarque las cadenas para esta campaña.</p>

                        <form action="/campanias/gestion/cadenas/vincular" method="post">
                            <input type="hidden" name="campaniaId" value="<%= campania.getId() %>">

                            <table width="100%" border="0" cellpadding="5">
                                <% for(CadenaDTO c : cadenas) {
                                    boolean asignada = campania.getIdsCadenas() != null && campania.getIdsCadenas().contains(c.getId());
                                %>
                                <tr>
                                    <td>
                                        <input type="checkbox" name="idsCadenas" value="<%= c.getId() %>"
                                            <%= asignada ? "checked" : "" %>>
                                        <%= c.getNombre() %>
                                    </td>
                                </tr>
                                <% } %>
                            </table>

                            <br>
                            <button type="submit" style="width: 100%; color: blue; padding: 5px;">Confirmar cambios</button>
                        </form>
                    </td>

                    <td width="50%" valign="top" style="padding-left: 20px;">

                        <h3 style="color: blue;">Añadir nueva cadena al sistema</h3>
                        <form action="/cadenas/crear" method="post">
                            <input type="hidden" name="campaniaId" value="<%= campania.getId() %>">

                            <table width="100%" border="0" cellpadding="5">
                                <tr>
                                    <td>Nombre:</td>
                                    <td><input type="text" name="nombre" required style="width: 100%;"></td>
                                </tr>
                                <tr>
                                    <td>Código:</td>
                                    <td><input type="text" name="codigo" required style="width: 100%;"></td>
                                </tr>
                                <tr>
                                    <td colspan="2" align="center">
                                        <button type="submit" style="width: 100%; color: blue; padding: 5px; margin-top: 10px;">Añadir cadena</button>
                                    </td>
                                </tr>
                            </table>
                        </form>

                        <br><hr><br>

                        <h3 style="color: red;">Eliminar cadena del sistema</h3>
                        <form action="/cadenas/eliminar" method="post" onsubmit="return confirmarEliminacionCadena();">
                            <input type="hidden" name="campaniaId" value="<%= campania.getId() %>">

                            <table width="100%" border="0" cellpadding="5">
                                <tr>
                                    <td>Seleccione:</td>
                                    <td>
                                        <select name="cadenaId" id="selectCadena" required style="width: 100%;">
                                            <option value="">-- Seleccionar --</option>
                                            <% for(CadenaDTO c : cadenas) { %>
                                            <option value="<%= c.getId() %>"><%= c.getNombre() %></option>
                                            <% } %>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" align="center">
                                        <button type="submit" style="width: 100%; color: red; padding: 5px; margin-top: 10px;">Eliminar cadena</button>
                                    </td>
                                </tr>
                            </table>
                        </form>

                    </td>
                </tr>

                <tr>
                    <td colspan="2" align="center" style="padding-top: 30px;">
                        <a href="/campanias/gestion?id=<%= campania.getId() %>">
                            <button type="button" style="padding: 5px 20px;">Volver a la campaña</button>
                        </a>
                    </td>
                </tr>
            </table>

        </td>
    </tr>
</table>

</body>
</html>