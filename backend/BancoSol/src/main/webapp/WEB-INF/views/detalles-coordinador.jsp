<%@ page import="com.bancosol.dto.CampaniaDTO" %>
<%@ page import="java.util.List" %>
<%@ page import="com.bancosol.dto.CoordinadorDTO" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<html>
    <head>
        <title>Detalles coordinador</title>
    </head>
    <%
        List<CampaniaDTO> campanias = (List<CampaniaDTO>) request.getAttribute("campanias");
        CoordinadorDTO coordinador = (CoordinadorDTO) request.getAttribute("coordinador");
        HttpSession usuario = (HttpSession) request.getAttribute("usuario");
    %>
    <body>
    <table border="1" width="100%" height="500">
        <tr>
            <td colspan="4" height="50">
                <img src="${pageContext.request.contextPath}/img/logo_bancosol.png" alt="Logo BancoSol" style="height: 40px; width: auto; vertical-align: middle; margin-left: 10px;">
                <span style="vertical-align: middle; margin-left: 10px;">Bienvenido <%= usuario.getId() %> </span>
                <a href="/" style="float: right; margin-right: 20px; vertical-align: middle; line-height: 50px;">Cerrar Sesión</a>
            </td>
        </tr>

        <tr>
            <td rowspan="2" width="25%" valign="top">

                <%@ include file="menu.jsp" %>

            </td>

            <td colspan="3" valign="top">
                <div class="info-coordinador">
                    Nombre: <input type="text" value="<%= coordinador.getNombreContacto() %>" disabled>
                    <input type="text" value="<%= coordinador.getNombreContacto() %>" disabled>


                    
                </div>
            </td>
        </tr>

        <tr height="50">
            <td align="center">Generar campaña</td>
        </tr>
    </table>

    </body>
</html>