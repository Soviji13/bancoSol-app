<%-- SOFÍA SI VILLALBA JIMÉNEZ - IA PARA AUTOMATIZAR CÓDIGO, LÓGICA PLANTEADA POR MÍ --%>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<div class="header-bancosol">
    <img src="${pageContext.request.contextPath}/assets/logo.png"
        alt="Logo BancoSol"
        style="height: 40px; vertical-align: middle; margin-left: 10px;">

    <span style="margin-left: 10px;">
        Bienvenido, <strong>${sessionScope.usuarioLogueado.nombreMostrado}</strong> <br>
        <small style="color: #666;">${sessionScope.usuarioLogueado.rolMostrado}</small>
        
        <c:if test="${sessionScope.usuarioLogueado.idReferencia != null}">
            <small style="color: #1e3a8a; margin-left: 12px; font-weight: bold; background-color: #f3f4f6; padding: 2px 6px; border-radius: 4px;">
                <c:choose>
                    <c:when test="${sessionScope.usuarioLogueado.rol == 'ADMIN' || sessionScope.usuarioLogueado.rol == 'ADMINISTRADOR'}">
                        ID en el sistema: ${sessionScope.usuarioLogueado.idReferencia}
                    </c:when>
                    <c:when test="${sessionScope.usuarioLogueado.rol == 'COORDINADOR'}">
                        ID de Coordinador: ${sessionScope.usuarioLogueado.idReferencia}
                    </c:when>
                    <c:when test="${sessionScope.usuarioLogueado.rol == 'RESPONSABLE_ENTIDAD'}">
                        ID de Responsable de Entidad: ${sessionScope.usuarioLogueado.idReferencia}
                    </c:when>
                    <c:otherwise>
                        ID Referencia: ${sessionScope.usuarioLogueado.idReferencia}
                    </c:otherwise>
                </c:choose>
            </small>
        </c:if>
    </span>

    <a href="${pageContext.request.contextPath}/logout"
    style="float: right; margin-right: 20px; text-decoration: none; font-weight: bold; color: #333;">
        Cerrar sesión
    </a>
</div>