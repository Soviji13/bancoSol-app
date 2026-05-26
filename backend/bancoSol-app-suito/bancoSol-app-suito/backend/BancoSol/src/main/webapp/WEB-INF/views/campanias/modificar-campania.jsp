<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<script>
    function confirmarEliminacion(url, nombreCampania) {
        if (confirm("Atención: ¿Seguro que desea eliminar '" + nombreCampania + "'? Todos los datos relacionados con esta no se podrán recuperar y serán eliminados.")) {
            window.location.href = url;
        }
    }
</script>

<form action="/campanias/guardar" method="post" id="formModificar">
    <input type="hidden" name="id" value="${campania.id}">
</form>

<table width="100%" border="0" cellpadding="10">
    <tr>
        <td colspan="2" align="center">
            <a href="/campanias/gestion?id=${campania.id}" style="background-color: #f0f0f0; border: 1px solid #777; color: #000; padding: 5px 15px; cursor: pointer; text-decoration: none; display: inline-block; font-family: Arial, sans-serif; font-size: 14px; margin-bottom: 20px;" onmouseover="this.style.backgroundColor='#e0e0e0'" onmouseout="this.style.backgroundColor='#f0f0f0'">Volver</a>
            <h2>
                <font color="#283593">
                    <c:choose>
                        <c:when test="${not empty campania.nombre}">
                            ${campania.nombre}
                        </c:when>
                        <c:otherwise>
                            Gran Recogida
                        </c:otherwise>
                    </c:choose>
                </font>
            </h2>
            <hr>
        </td>
    </tr>
    <tr>
        <td width="50%" valign="top">
            <table border="1" width="95%" align="center" style="border-collapse: collapse; border-color: #999;">
                <tr><th height="30" style="color: blue; background-color: #fff;">Cadenas</th></tr>
                <tr>
                    <td height="250" valign="top" style="padding: 15px;">
                        <table width="100%" border="0" cellpadding="5">
                            <tr>
                                <c:forEach var="c" items="${cadenas}" varStatus="status">
                                <c:set var="asignada" value="false" />
                                <c:if test="${not empty campania.idsCadenas}">
                                    <c:forEach var="idAsignado" items="${campania.idsCadenas}">
                                        <c:if test="${idAsignado == c.id}">
                                            <c:set var="asignada" value="true" />
                                        </c:if>
                                    </c:forEach>
                                </c:if>

                                <td width="50%">
                                    <input type="checkbox" name="idsCadenas" value="${c.id}" form="formModificar" ${asignada ? 'checked' : ''}> ${c.nombre}
                                </td>

                                <c:if test="${status.count % 2 == 0 && not status.last}">
                            </tr><tr>
                            </c:if>
                            </c:forEach>
                        </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>

        <td width="50%" valign="top">
            <table border="1" width="95%" align="center" style="border-collapse: collapse; border-color: #999;">
                <tr><th height="30" style="color: blue; background-color: #fff;">Coordinadores</th></tr>
                <tr>
                    <td height="250" valign="top" align="center" style="padding: 15px;">
                        <c:choose>
                            <c:when test="${not empty coordinadores}">
                                <c:forEach var="coord" items="${coordinadores}">
                                    <span style="color: blue; font-size: 14px;">${coord.contacto.nombre}</span><br>
                                </c:forEach>
                            </c:when>
                            <c:otherwise>
                                <span style="color: gray; font-size: 12px; font-style: italic;">Sin coordinadores</span>
                            </c:otherwise>
                        </c:choose>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>