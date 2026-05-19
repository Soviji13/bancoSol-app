<%@ page import="com.bancosol.entities.Campania" %>
<%@ page import="java.util.List" %>
<%@ page import="com.bancosol.dto.CampaniaDTO" %>
<%@ page import="jakarta.servlet.http.HttpSession" %>
<%@ page import="java.time.format.DateTimeFormatter" %>
<%@ page import="java.time.temporal.ChronoUnit" %>
<%@ page import="java.util.Locale" %>
<%@ page import="java.time.format.TextStyle" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<html>
<head>
    <title>Campañas</title>
    <style>
        .grid-campanias {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            padding: 20px;
            font-family: sans-serif;
        }
        .card-campania {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border: 1px solid #283593; /* Azul por defecto */
            border-radius: 8px;
            padding: 20px;
            width: 260px;
            text-decoration: none;
            background-color: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            transition: transform 0.2s;
        }
        .card-campania:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .card-campania.terminada {
            border-color: #e53935; /* Rojo si está inactiva */
        }
        .card-titulo {
            color: #283593;
            font-size: 1.2em;
            margin-bottom: 10px;
            text-align: center;
        }
        .card-fechas {
            font-size: 0.85em;
            color: #555;
            margin-bottom: 8px;
        }
        .card-info {
            font-size: 0.8em;
            color: #283593;
        }
        .card-info.alerta {
            color: #e53935;
        }
    </style>
</head>
<%
    List<CampaniaDTO> campanias = (List<CampaniaDTO>) request.getAttribute("campanias");
    HttpSession usuario = (HttpSession) request.getAttribute("usuario");

    // Formateador para las fechas "dd/MM/yy"
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yy");
    Locale localeES = new Locale("es", "ES");
%>

<body>
<table border="1" width="100%" height="500" style="border-collapse: collapse;">
    <tr>
        <td colspan="4" height="50">
            <img src="${pageContext.request.contextPath}/img/logo_bancosol.png" alt="Logo BancoSol" style="height: 40px; width: auto; vertical-align: middle; margin-left: 10px;">
            <span style="vertical-align: middle; margin-left: 10px;">Bienvenido <%= usuario.getId() %> </span>
            <a href="/" style="float: right; margin-right: 20px; vertical-align: middle; line-height: 50px; text-decoration: none; color: #333;">Cerrar Sesión</a>
        </td>
    </tr>

    <tr>
        <td rowspan="2" width="25%" valign="top">
            <%@ include file="menu.jsp" %>
        </td>

        <td colspan="3" valign="top">
            <div class="grid-campanias">
                <%
                    if(campanias != null) {
                        for(CampaniaDTO c : campanias) {
                            String fechasStr = "Fechas no definidas";
                            String infoExtra = "";

                            // Calculamos las fechas y los días si existen
                            if (c.getFechaInicio() != null && c.getFechaFin() != null) {
                                fechasStr = c.getFechaInicio().format(formatter) + " - " + c.getFechaFin().format(formatter);
                                long dias = ChronoUnit.DAYS.between(c.getFechaInicio(), c.getFechaFin());
                                String mes = c.getFechaInicio().getMonth().getDisplayName(TextStyle.FULL, localeES);
                                infoExtra = "(" + dias + " días, " + mes + ")";
                            }

                            // Comprobamos si la campaña está activa
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
        </td>
    </tr>

    <tr height="50">
        <td align="center" colspan="3" style="border-top: 1px solid #283593;">
            <a href="/campanias/generar" style="text-decoration: none;">
                <button type="button" style="padding: 10px 20px; font-family: sans-serif; color: #283593; background: white; border: none; cursor: pointer; font-size: 16px;">
                    Generar campaña
                </button>
            </a>
        </td>
    </tr>
</table>

</body>
</html>