<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<html>
<head>
    <title>Banco Sol - Test DB</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #eef2f3; padding: 40px; }
        table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        th, td { padding: 15px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #3498db; color: white; }
        tr:hover { background-color: #f1f1f1; }
    </style>
</head>
<body>
<h2>🚀 Cadenas encontradas en Supabase</h2>

<table>
    <thead>
    <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Código</th>
    </tr>
    </thead>
    <tbody>
    <c:forEach items="${listaCadenas}" var="c">
        <tr>
            <td>${c.id}</td>
            <td>${c.nombre}</td>
            <td>${c.codigo}</td>
        </tr>
    </c:forEach>
    </tbody>
</table>

<c:if test="${empty listaCadenas}">
    <p style="color: #e74c3c;">Vaya... parece que no hay datos todavía. ¡Añade uno en el panel de IntelliJ!</p>
</c:if>
</body>
</html>