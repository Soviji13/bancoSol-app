<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<div style="padding: 20px;">
    <h3 style="color: #283593; margin-top: 0; font-size: 16px; text-align: center; text-transform: uppercase;">
        <c:choose>
            <c:when test="${not empty campania.nombre}">
                ${campania.nombre}
            </c:when>
            <c:otherwise>
                CAMPAÑA
            </c:otherwise>
        </c:choose>
        <br> <span style="text-transform: none;">- Modificación</span>
    </h3>
    <hr style="margin-bottom: 20px;">

    <p style="margin-bottom: 5px; font-size: 14px;">Nuevo nombre para la campaña:</p>
    <input type="text" name="nombre" form="formModificar" value="${campania.nombre}" style="width: 100%; padding: 6px; margin-bottom: 15px; box-sizing: border-box;" required>

    <p style="margin-bottom: 5px; font-size: 14px;">Nueva fecha de inicio para la campaña:</p>
    <input type="date" name="fechaInicio" form="formModificar" value="${campania.fechaInicio}" style="width: 100%; padding: 6px; margin-bottom: 15px; box-sizing: border-box;" required>

    <p style="margin-bottom: 5px; font-size: 14px;">Nueva fecha de cierre para la campaña:</p>
    <input type="date" name="fechaFin" form="formModificar" value="${campania.fechaFin}" style="width: 100%; padding: 6px; margin-bottom: 30px; box-sizing: border-box;" required>

    <button type="submit" form="formModificar" style="width: 100%; color: #283593; background: #fff; border: 1px solid #283593; padding: 8px; margin-bottom: 10px; cursor: pointer; font-weight: bold;">
        Confirmar cambios
    </button>

    <a href="/campanias/gestion?id=${campania.id}" style="text-decoration: none;">
        <button type="button" style="width: 100%; color: #283593; background: #fff; border: 1px solid #283593; padding: 8px; margin-bottom: 10px; cursor: pointer;">
            Descartar cambios
        </button>
    </a>

    <button type="button" onclick="confirmarEliminacion('/campanias/eliminar?id=${campania.id}', '${campania.nombre}')" style="width: 100%; color: red; background: #fff; border: 1px solid red; padding: 8px; cursor: pointer;">
        Eliminar campaña
    </button>
</div>