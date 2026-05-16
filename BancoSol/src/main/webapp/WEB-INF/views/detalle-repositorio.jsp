<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<html>
<head>
    <title>Detalle de Repositorio</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 24px; background: #f6f8fa; }
        table { width: 100%; border-collapse: collapse; background: #fff; margin-top: 12px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background: #1f6feb; color: #fff; }
        .error { color: #d1242f; font-weight: bold; }
        a { color: #1f6feb; text-decoration: none; }
    </style>
</head>
<body>
<a href="/test-db/diagnostico">Volver al diagnostico</a>

<c:if test="${not empty error}">
    <p class="error">${error}</p>
</c:if>

<c:if test="${not empty detalle}">
    <h2>${detalle.nombreBean}</h2>
    <p>Total registros: ${detalle.totalRegistros}</p>

    <table>
        <thead>
        <tr>
            <c:forEach items="${detalle.muestra[0]}" var="entry">
                <th>${entry.key}</th>
            </c:forEach>
        </tr>
        </thead>
        <tbody>
        <c:forEach items="${detalle.muestra}" var="fila">
            <tr>
                <c:forEach items="${fila}" var="columna">
                    <td>${columna.value}</td>
                </c:forEach>
            </tr>
        </c:forEach>
        </tbody>
    </table>

    <c:if test="${empty detalle.muestra}">
        <p>No hay datos para mostrar en la muestra.</p>
    </c:if>
</c:if>
</body>
</html>

