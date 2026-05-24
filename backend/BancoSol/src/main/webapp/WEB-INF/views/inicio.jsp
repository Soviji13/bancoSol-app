<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String pagina = (String) request.getAttribute("pagina");
    if (pagina == null) pagina = "campanias";

    String panelIzquierdo = (String) request.getAttribute("panelIzquierdo");
    if (panelIzquierdo == null) panelIzquierdo = "layout/menu.jsp";
%>
<html>
<head>
    <title>BancoSol</title>
    <style>body { margin: 0; font-family: Arial, sans-serif; }</style>
</head>
<body>

<table border="1" width="100%" height="100%" cellspacing="0" cellpadding="0">
    <tr>
        <td colspan="2" height="60" valign="middle">
            <jsp:include page="layout/header.jsp" />
        </td>
    </tr>
    <tr>
        <td width="25%" valign="top" style="border-right: 1px solid #ccc; background-color: #f9f9f9;">
            <jsp:include page="<%= panelIzquierdo %>" />
        </td>
        <td width="75%" valign="top" style="padding: 20px;">

            <% if (pagina.equals("campanias")) { %>
            <jsp:include page="campanias/campanias.jsp" />

            <% } else if (pagina.equals("generar-campania")) { %>
            <jsp:include page="campanias/generar-campania.jsp" />

            <% } else if (pagina.equals("gestion-campanias")) { %>
            <jsp:include page="campanias/gestionar-campanias.jsp" />

            <% } else if (pagina.equals("modificar-campania")) { %>
            <jsp:include page="campanias/modificar-campania.jsp" />

            <% } else if (pagina.equals("gestionar-cadenas")) { %>
            <jsp:include page="cadenas/gestionar-cadenas.jsp" />

            <% } else if (pagina.equals("gestionar-coordinadores")) { %>
            <jsp:include page="coordinadores/gestionar-coordinadores.jsp" />

            <% } else if (pagina.equals("detalles-coordinador")) { %>
            <jsp:include page="coordinadores/detalles-coordinador.jsp" />
            <% } %>

        </td>
    </tr>
</table>

</body>
</html>