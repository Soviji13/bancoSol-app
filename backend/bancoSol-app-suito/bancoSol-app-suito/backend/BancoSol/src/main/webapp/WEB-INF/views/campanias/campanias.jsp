<%@ page import="com.bancosol.dto.CampaniaDTO" %>
<%@ page import="java.time.format.DateTimeFormatter" %>
<%@ page import="java.time.temporal.ChronoUnit" %>
<%@ page import="java.time.format.TextStyle" %>
<%@ page import="java.util.Locale" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<%
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yy");
    Locale localeES = new Locale("es", "ES");
    pageContext.setAttribute("formatter", formatter);
    pageContext.setAttribute("localeES", localeES);
%>



<div class="grid-campanias" id="lista-campanias">
    <c:choose>
        <c:when test="${empty campanias}">
            <p>No hay campañas registradas.</p>
        </c:when>
        <c:otherwise>
            <c:forEach var="c" items="${campanias}">
                <%
                    CampaniaDTO campania = (CampaniaDTO) pageContext.getAttribute("c");
                    String fechasStr = "Fechas no definidas";
                    String infoExtra = "";
                    boolean activa = campania.getActiva() != null && campania.getActiva();

                    if (campania.getFechaInicio() != null && campania.getFechaFin() != null) {
                        fechasStr = campania.getFechaInicio().format(formatter) + " - " + campania.getFechaFin().format(formatter);
                        long dias = ChronoUnit.DAYS.between(campania.getFechaInicio(), campania.getFechaFin());
                        String mes = campania.getFechaInicio().getMonth().getDisplayName(TextStyle.FULL, localeES);
                        infoExtra = "(" + dias + " días, " + mes + ")";
                    }

                    pageContext.setAttribute("fechasStr", fechasStr);
                    pageContext.setAttribute("infoExtra", infoExtra);
                    pageContext.setAttribute("activa", activa);
                %>

                <div class="card-campania ${!activa ? 'terminada' : ''}" data-id="${c.id}">
                    <div class="card-titulo">${c.nombre}</div>
                    <div class="card-fechas">${fechasStr}</div>

                    <c:choose>
                        <c:when test="${activa}">
                            <div class="card-info">${infoExtra}</div>
                        </c:when>
                        <c:otherwise>
                            <div class="card-info alerta">Terminada</div>
                        </c:otherwise>
                    </c:choose>
                </div>
            </c:forEach>
        </c:otherwise>
    </c:choose>
</div>

<div class="pie-pagina">
    <div class="container-interactuar">
        <a id="btn-generar-campania" class="accion-pie activado" href="/campanias/generar">
            Generar campaña
        </a>

        <a id="btn-modificar-campania" class="accion-pie desactivado" href="#" title="Debes primero seleccionar una campaña">
            Modificar campaña
        </a>

        <a id="btn-eliminar-campania" class="accion-pie desactivado" href="#" title="Debes primero seleccionar una campaña">
            Eliminar campaña
        </a>
    </div>
</div>
