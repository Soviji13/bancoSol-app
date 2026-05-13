<%@ page import="com.bancosol.entities.Campania" %>
<%@ page import="java.util.List" %>
<%@ page import="com.bancosol.dto.CampaniaDTO" %>
<%@ page import="jakarta.servlet.http.HttpSession" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<html>
    <head>
        <title>Campañas</title>
    </head>
    <%
        List<CampaniaDTO> campanias = (List<CampaniaDTO>) request.getAttribute("campanias");
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
                    <div class="menu-campanias">


                        <%for(CampaniaDTO c : campanias){%>
                        <a href="/campanias/gestion?id=<%=c.getId()%>"><%=c.getNombre()%></a>
                        <br><br>
                        <%}%>
                    </div>
                </td>
            </tr>

            <tr height="50">
                <td align="center">Generar campaña</td>
            </tr>
        </table>

    </body>
</html>