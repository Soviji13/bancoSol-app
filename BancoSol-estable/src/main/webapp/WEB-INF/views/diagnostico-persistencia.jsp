<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<html>
<head>
    <title>Diagnostico de Persistencia</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 24px; background: #f6f8fa; }
        table { width: 100%; border-collapse: collapse; background: #fff; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background: #1f6feb; color: #fff; }
        .ok { color: #1a7f37; font-weight: bold; }
        .ko { color: #d1242f; font-weight: bold; }
        .acciones a { color: #1f6feb; text-decoration: none; }
    </style>
</head>
<body>
<h2>Diagnostico de persistencia por repositorio</h2>
<p>Ruta principal para datos de ejemplo: <a href="/test-db">/test-db</a></p>
<table>
    <thead>
    <tr>
        <th>Repositorio</th>
        <th>Estado</th>
        <th>Total registros</th>
        <th>Error</th>
        <th>Detalle</th>
    </tr>
    </thead>
    <tbody>
    <c:forEach items="${estados}" var="estado">
        <tr>
            <td>${estado.nombreBean}</td>
            <td>
                <c:choose>
                    <c:when test="${estado.ok}">
                        <span class="ok">OK</span>
                    </c:when>
                    <c:otherwise>
                        <span class="ko">ERROR</span>
                    </c:otherwise>
                </c:choose>
            </td>
            <td>${estado.totalRegistros}</td>
            <td>${estado.error}</td>
            <td class="acciones"><a href="/test-db/repos/${estado.nombreBean}">Ver muestra</a></td>
        </tr>
    </c:forEach>
    </tbody>
</table>

<c:if test="${empty estados}">
    <p>No se encontraron repositorios para diagnosticar.</p>
</c:if>
</body>
</html>

