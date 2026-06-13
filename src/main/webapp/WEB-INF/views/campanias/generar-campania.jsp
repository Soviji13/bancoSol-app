<%-- Alejandro Jiménez González  --%>
<%@ page import="com.bancosol.dto.CadenaDTO" %>
<%@ page import="com.bancosol.dto.CoordinadorDTO" %>
<%@ page import="java.util.List" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%
    List<CadenaDTO> cadenas = (List<CadenaDTO>) request.getAttribute("cadenas");
    List<CoordinadorDTO> coordinadores = (List<CoordinadorDTO>) request.getAttribute("coordinadores");
%>
<style>
    .form-container { width: 100%; padding: 20px 40px 20px 20px; box-sizing: border-box; max-height: calc(100vh - 80px); overflow-y: auto; font-family: sans-serif; }
    .form-container::-webkit-scrollbar, .checkbox-grid::-webkit-scrollbar { width: 8px; }
    .form-container::-webkit-scrollbar-thumb, .checkbox-grid::-webkit-scrollbar-thumb { background-color: #bbb; border-radius: 4px; }

    .header-wrapper { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; width: 100%; }
    .header-title h2 { color: #2a3485; font-size: 26px; margin: 0; font-weight: bold; }
    .header-title p { color: #666; margin: 5px 0 0 0; font-size: 14px; }

    .btn-volver { background-color: #fff; border: 1px solid #777; color: #333; padding: 8px 20px; cursor: pointer; text-decoration: none; border-radius: 15px; font-weight: bold; font-size: 14px; transition: background-color 0.2s; }
    .btn-volver:hover { background-color: #f0f0f0; }

    .divider { border: none; border-bottom: 1px solid #ccc; margin-bottom: 30px; width: 100%; }

    .form-section { border: 1px solid #ccc; border-radius: 12px; padding: 25px 30px; background-color: #fff; margin-bottom: 30px; width: 100%; box-sizing: border-box; }
    .form-section-title { color: #2a3485; font-weight: bold; font-size: 15px; padding: 0 10px; }

    .form-group { margin-bottom: 25px; width: 100%; }
    .form-group label { font-weight: bold; display: block; margin-bottom: 10px; color: #222; font-size: 14px; }

    .input-text, .input-date { width: 100%; padding: 8px 0; border: none; border-bottom: 1px solid #777; box-sizing: border-box; background-color: transparent; font-family: inherit; font-size: 14px; outline: none; transition: border-color 0.2s; }
    .input-text:focus, .input-date:focus { border-bottom: 2px solid #2a3485; }

    .select-multiple { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box; background-color: #fff; font-family: inherit; font-size: 14px; outline: none; }
    .select-multiple:focus { border-color: #2a3485; }

    .flex-row { display: flex; gap: 40px; }
    .flex-item { flex: 1; }

    .checkbox-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; max-height: 200px; overflow-y: auto; padding-right: 10px; }
    .checkbox-grid label { font-weight: normal; margin: 0; display: flex; align-items: center; gap: 8px; color: #333; cursor: pointer; }

    .hint { font-size: 0.85em; color: #666; margin-top: 8px; font-style: italic; }

    .btn-classic { background-color: #2a3485; color: white; border: none; padding: 12px 24px; font-size: 15px; cursor: pointer; border-radius: 6px; font-weight: bold; float: right; margin-bottom: 20px; }
    .btn-classic:hover { background-color: #1e2563; }
    .clearfix::after { content: ""; clear: both; display: table; }
</style>

<div class="form-container">
    <div class="header-wrapper">
        <div class="header-title">
            <h2>Generar Nueva Campaña</h2>
            <p>Complete los datos de la campaña y las asignaciones</p>
        </div>
        <div>
            <a href="/campanias" class="btn-volver">Volver</a>
        </div>
    </div>

    <hr class="divider">

    <form action="/campanias/guardar" method="post" class="clearfix">

        <fieldset class="form-section">
            <legend class="form-section-title">Información general</legend>

            <div class="form-group">
                <label>Nombre de la campaña (*)</label>
                <input type="text" name="nombre" class="input-text" required placeholder="Ej: Gran Recogida 2026">
            </div>

            <div class="flex-row">
                <div class="form-group flex-item">
                    <label>Fecha de inicio (*)</label>
                    <input type="date" name="fechaInicio" class="input-date" required>
                </div>
                <div class="form-group flex-item">
                    <label>Fecha de fin (*)</label>
                    <input type="date" name="fechaFin" class="input-date" required>
                </div>
            </div>
        </fieldset>

        <fieldset class="form-section">
            <legend class="form-section-title">Asignación</legend>

            <div class="form-group">
                <label>Cadenas participantes</label>
                <div class="checkbox-grid">
                    <% if (cadenas != null && !cadenas.isEmpty()) {
                        for(CadenaDTO c : cadenas) { %>
                    <label>
                        <input type="checkbox" name="idsCadenas" value="<%= c.getId() %>"> <%= c.getNombre() %>
                    </label>
                    <%   }
                    } else { %>
                    <span style="color: #666; font-style: italic;">No hay cadenas disponibles.</span>
                    <% } %>
                </div>
            </div>

            <div class="form-group" style="margin-top: 30px;">
                <label>Asignar Coordinadores</label>
                <select name="idsCoordinadores" class="select-multiple" multiple size="7">
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
        </fieldset>

        <div>
            <button type="submit" class="btn-classic">Guardar Campaña</button>
        </div>
    </form>
</div>

</td>
</tr>
</table>
</body>
</html>