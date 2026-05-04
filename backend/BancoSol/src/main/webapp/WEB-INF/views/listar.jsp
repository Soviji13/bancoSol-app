<%@ page import="es.uma.mps.bancosol.entity.Campania" %>
<%@ page import="java.util.List" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
    <head>
        <title>Campañas</title>
    </head>
    <%
        List<Campania> camp = (List<Campania>) request.getAttribute("campanias");
    %>
    <body>
    <h1>Esto es una página de prueba</h1>
    <table border="1">
        <tr>
            <td>Nombre</td>
            <td>Año</td>
        </tr>

        <%
            for(Campania c : camp){
        %>
        <tr>
           <td><%=c.getNombre()%></td>
           <td><%=c.getAnio()%></td>
        </tr>

        <%}%>

    </table>

    </body>
</html>
