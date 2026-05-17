<%@ page import="com.bancosol.dto.CoordinadorDTO" %>
<%@ page import="com.bancosol.dto.EntidadColaboradoraDTO" %>
<%@ page import="com.bancosol.dto.DistritoDTO" %>
<%@ page import="java.util.List" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    CoordinadorDTO coordinador = (CoordinadorDTO) request.getAttribute("coordinador");
    if (coordinador == null) {
        coordinador = new CoordinadorDTO();
    }

    List<EntidadColaboradoraDTO> entidades = (List<EntidadColaboradoraDTO>) request.getAttribute("entidades");
    List<DistritoDTO> distritos = (List<DistritoDTO>) request.getAttribute("distritos");

    Object usuario = session.getAttribute("usuario");
%>
<html>
<head>
    <title>Gestionar Coordinadores</title>
    <script>
        function habilitarEdicion() {
            var form = document.getElementById("formCoordinador");
            var elementos = form.elements;

            for (var i = 0; i < elementos.length; i++) {
                elementos[i].disabled = false;
            }

            var btnModificar = document.getElementById("btnModificar");

            if (btnModificar.innerHTML === "Guardar cambios") {
                form.submit(); // Forzamos el envío nativo del formulario HTML
            } else {
                // Primera pulsación: cambiamos el texto a Guardar
                btnModificar.innerHTML = "Guardar cambios";
            }
        }

        function confirmarDesvinculacion(url) {
            if (confirm("¿Estás seguro de que deseas eliminar a este coordinador de la campaña actual?")) {
                window.location.href = url;
            }
        }
    </script>
</head>
<body>

<table border="1" width="100%" height="100%" cellspacing="0" cellpadding="0">
    <tr>
        <td colspan="2" height="60" valign="middle">
            <img src="${pageContext.request.contextPath}/img/logo_bancosol.png" alt="Logo" height="40" align="middle" style="margin-left: 10px;">
            <span style="margin-left: 10px;">
                Bienvenido, <%= usuario != null ? usuario.toString() : "Nombre apellidos" %><br>
                <small>Administrador</small>
            </span>
            <a href="/logout" style="float: right; margin-right: 20px;">Cerrar sesión</a>
        </td>
    </tr>

    <tr>
        <td width="25%" valign="top">
            <jsp:include page="menu.jsp" />
        </td>

        <td width="75%" valign="top">
            <h2 align="center"><font color="#283593">Gran Recogida</font></h2>
            <hr>
            <p style="padding-left: 15px;"><font color="#283593">Rellene los datos del coordinador para añadirlo a la campaña:</font></p>

            <form action="/coordinadores/guardar" method="post" id="formCoordinador">
                <input type="hidden" name="id" value="<%= coordinador.getId() != null ? coordinador.getId() : "" %>">

                <%
                    // Extraemos el ID de la campaña actual para volver a ella al guardar
                    String campIdParam = request.getParameter("campaniaId");
                    Long campId = null;
                    if (campIdParam != null && !campIdParam.isEmpty()) {
                        campId = Long.valueOf(campIdParam);
                    } else if (coordinador.getIdsCampanias() != null && !coordinador.getIdsCampanias().isEmpty()) {
                        campId = coordinador.getIdsCampanias().get(0);
                    }
                %>
                <input type="hidden" name="campaniaId" value="<%= campId != null ? campId : "" %>">

                <table border="0" cellpadding="10" style="margin-left: 30px;">
                    <tr>
                        <td>Nombre:<font color="red">*</font></td>
                        <td>
                            <input type="text" name="nombreContacto" required disabled
                                   value="<%= coordinador.getNombreContacto() != null ? coordinador.getNombreContacto() : "" %>">
                        </td>
                    </tr>

                    <tr>
                        <td>Entidad colaboradora:<font color="red">*</font></td>
                        <td>
                            <select name="entidadId" required disabled>
                                <option value="">Seleccione...</option>
                                <% if(entidades != null) {
                                    for(EntidadColaboradoraDTO e : entidades) {
                                        boolean isSelected = coordinador.getIdsEntidades() != null && coordinador.getIdsEntidades().contains(e.getId());
                                %>
                                <option value="<%= e.getId() %>" <%= isSelected ? "selected" : "" %>><%= e.getNombre() %></option>
                                <%  }
                                } %>
                            </select>
                            <button type="button" disabled style="background-color: #1a237e; color: white; border: none; padding: 2px 8px;">+</button>
                        </td>
                    </tr>

                    <tr>
                        <td>Área asignada:<font color="red">*</font></td>
                        <td>
                            <select name="area" required disabled>
                                <option value="">Seleccione...</option>
                                <% if(distritos != null) {
                                    for(DistritoDTO d : distritos) {
                                        boolean isSelected = d.getNombre().equals(coordinador.getArea());
                                %>
                                <option value="<%= d.getNombre() %>" <%= isSelected ? "selected" : "" %>><%= d.getNombre() %></option>
                                <%  }
                                } %>
                            </select>
                        </td>
                    </tr>

                    <tr>
                        <td>Email:<font color="red">*</font></td>
                        <td>
                            <input type="email" name="emailContacto" required disabled
                                   value="<%= coordinador.getEmailContacto() != null ? coordinador.getEmailContacto() : "" %>">
                        </td>
                    </tr>
                    <tr>
                        <td>Teléfono:<font color="red">*</font></td>
                        <td>
                            <input type="text" name="telefonoContacto" required disabled
                                   value="<%= coordinador.getTelefonoContacto() != null ? coordinador.getTelefonoContacto() : "" %>">
                        </td>
                    </tr>
                </table>
            </form>
        </td>
    </tr>

    <tr height="50">
        <td></td>
        <td valign="middle">
            <table border="1" width="100%" height="100%" cellspacing="0">
                <tr>
                    <td width="50%" align="center">
                        <a href="javascript:void(0);"
                           onclick="confirmarDesvinculacion('/coordinadores/eliminar?id=<%= coordinador.getId() %>&campaniaId=<%= campId != null ? campId : "" %>')"
                           style="text-decoration: none;">
                            <font color="red">Eliminar de la campaña</font>
                        </a>
                    </td>
                    <td width="50%" align="center">
                        <button type="button" id="btnModificar" onclick="habilitarEdicion()" style="color: #283593; background: none; border: none; cursor: pointer; font-size: 14px;">Modificar coordinador</button>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

</body>
</html>