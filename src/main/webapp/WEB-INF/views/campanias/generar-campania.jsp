<%@ page import="com.bancosol.dto.CadenaDTO" %>
<%@ page import="com.bancosol.dto.CoordinadorDTO" %>
<%@ page import="java.util.List" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%
    List<CadenaDTO> cadenas = (List<CadenaDTO>) request.getAttribute("cadenas");
    List<CoordinadorDTO> coordinadores = (List<CoordinadorDTO>) request.getAttribute("coordinadores");
%>


<style>
    .form-container { padding: 5px; max-width: 650px; }
    .panel { border: 1px solid #999; background-color: #fcfcfc; padding: 20px; margin-top: 15px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { font-weight: bold; display: block; margin-bottom: 5px; color: #000; }
    .input-text, .input-date, .select-multiple { width: 100%; padding: 6px; border: 1px solid #666; box-sizing: border-box; background-color: #fff; }
    .input-date { width: 150px; }
    .checkbox-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 10px; border: 1px solid #ccc; background: #fff; }

    .hint { font-size: 0.85em; color: #555; margin-top: 5px; font-style: italic; }

    .btn-volver {
        background-color: #f0f0f0;
        border: 1px solid #777;
        color: #000;
        padding: 5px 15px;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
        font-family: Arial, sans-serif;
        font-size: 14px;
        margin-bottom: 20px;
    }
    .btn-volver:hover { background-color: #e0e0e0; }


</style>

<div class="form-container">
    <table width="100%" border="0" style="margin-bottom: 10px;">
        <tr>
            <td width="5%">
                <a href="/campanias" class="btn-volver">Volver</a>
            </td>
            <td width="90%">
                <h2 style="margin: 0; font-size: 18px; color: #000; border-bottom: 1px solid #333; padding-bottom: 5px;">
                    Generar Nueva Campaña
                </h2>
            </td>
        </tr>
    </table>

    <div class="panel">
        <form action="/campanias/guardar" method="post" style="margin: 0;">
            <div class="form-group">
                <label>Nombre de la campaña (*)</label>
                <input type="text" name="nombre" class="input-text" required placeholder="Ej: Gran Recogida 2026">
            </div>

            <div class="form-group" style="display: flex; gap: 40px;">
                <div>
                    <label>Fecha de inicio (*)</label>
                    <input type="date" name="fechaInicio" class="input-date" required>
                </div>
                <div>
                    <label>Fecha de fin (*)</label>
                    <input type="date" name="fechaFin" class="input-date" required>
                </div>
            </div>

            <div class="form-group">
                <label>Cadenas participantes</label>
                <div class="checkbox-grid">
                    <% if (cadenas != null && !cadenas.isEmpty()) {
                        for(CadenaDTO c : cadenas) { %>
                    <label style="font-weight: normal; margin: 0;">
                        <input type="checkbox" name="idsCadenas" value="<%= c.getId() %>"> <%= c.getNombre() %>
                    </label>
                    <%   }
                    } else { %>
                    <span style="color: #666; font-style: italic;">No hay cadenas disponibles.</span>
                    <% } %>
                </div>
            </div>

            <div class="form-group">
                <label>Asignar Coordinadores</label>
                <select name="idsCoordinadores" class="select-multiple" multiple size="8">
                    <% if (coordinadores != null && !coordinadores.isEmpty()) {
                        for(CoordinadorDTO coord : coordinadores) { %>
                    <option value="<%= coord.getId() %>">
                        <%= coord.getNombre() != null ? coord.getNombre(): "Sin definir" %> - <%= coord.getArea() %>
                    </option>
                    <%   }
                    } %>
                </select>
                <div class="hint">Nota: Mantenga presionada la tecla Ctrl (o Cmd en Mac) para seleccionar múltiples opciones.</div>
            </div>

            <div class="form-group" style="margin-top: 30px; text-align: right; border-top: 1px solid #ccc; padding-top: 15px;">
                <button type="submit" class="btn-classic">Guardar Campaña</button>
            </div>
        </form>
    </div>
</div>

</td>
</tr>
</table>
</body>
</html>