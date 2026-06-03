<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>

<section id="entidades">

    <%-- Encabezado --%>
    <div class="encabezado">
        <div class="filtro-campania-container">
            <div class="boton-filtro">
                <button id="filtrar">&nbsp;</button>
            </div>
            <div class="cambiar-campania">
                <button>Seleccionar otra campaña</button>
            </div>
        </div>
        <h1>${campaniaSelec}</h1>
        <div class="help-container">
            <p>Para ver más información sobre la entidad colaboradora, haga doble click sobre su fila correspondiente</p>
            <div class="simbolo"><p>?</p></div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <td>ID</td>
                <td>NOMBRE</td>
            </tr>
        </thead>
        <tbody>
            <c:forEach items="${entidadesSelec}" var="e">
                <tr>
                    <td>${e.id}</td>
                    <td>${e.nombre}</td>
                </tr>
            </c:forEach>
        </tbody>
    </table>


</section>