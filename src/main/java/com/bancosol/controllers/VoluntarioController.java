//francisco javier garcia sierra 0% ia

// ----- justificacion uso ia -----
// 1. problema de transacciones jpa: el delete de turnos no hacia flush a tiempo y daba error 500 por la restriccion unique de la bbdd al modificar. solucionado forzando flush() manual para q borre al instante!!
// 2. excepcion de serializacion de fechas (localtime) a json: al pasar la lista a la vista jsp, el objectmapper basico petaba con las horas. solucionado inyectando el objectmapper oficial de spring boot q ya lo entiende.
// --------------------------------

package com.bancosol.controllers;

import com.bancosol.dto.CampaniaDTO;
import com.bancosol.dto.TurnoNuevoDTO;
import com.bancosol.dto.VoluntarioDTO;
import com.bancosol.dto.VoluntarioNuevoDTO;
import com.bancosol.services.CampaniaService;
import com.bancosol.services.EntidadColaboradoraService;
import com.bancosol.services.TiendaService;
import com.bancosol.services.VoluntarioService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
@AllArgsConstructor
@RequestMapping("/voluntarios")
public class VoluntarioController {

    private final VoluntarioService voluntarioService;
    private final CampaniaService campaniaService;
    private final EntidadColaboradoraService entidadColaboradoraService;
    private final TiendaService tiendaService;
    private final ObjectMapper objectMapper; // usamos el de spring boot pa q no pete con los localtime!!!!

    @GetMapping({"", "/"})
    public String listarVoluntarios(
            @RequestParam(value = "campaniaId", required = false) Long campaniaId,
            @RequestParam(value = "voluntarioId", required = false) Long voluntarioId,
            @RequestParam(value = "verFiltros", required = false) Boolean verFiltros,
            @RequestParam(value = "filtroId", required = false) Long filtroId,
            @RequestParam(value = "filtroEntidad", required = false) String filtroEntidad,
            @RequestParam(value = "filtroResponsable", required = false) String filtroResponsable,
            @RequestParam(value = "filtroTienda", required = false) String filtroTienda,
            Model model) {

        // sacamos la campania actual
        CampaniaDTO campaniaTabla = (campaniaId == null) ? campaniaService.devolverCampaniaActiva() : campaniaService.findById(campaniaId);

        List<VoluntarioDTO> voluntarios;
        // si viene algun filtro los aplicamos, si no sacamos todos los vol de la campaña
        if (filtroId != null || (filtroEntidad != null && !filtroEntidad.isEmpty())
                || (filtroResponsable != null && !filtroResponsable.isEmpty())
                || (filtroTienda != null && !filtroTienda.isEmpty())) {
            voluntarios = voluntarioService.buscarFiltrados(campaniaTabla.getId(), filtroId, filtroEntidad, filtroResponsable, filtroTienda);
        } else {
            voluntarios = voluntarioService.buscarPorCampania(campaniaTabla.getId());
        }

        //pasamos datos basicos al jsp
        model.addAttribute("voluntariosSelec", voluntarios);
        model.addAttribute("campaniaSelec", campaniaTabla);
        model.addAttribute("campaniaId", campaniaTabla.getId());


        //AYUDA IA
        //mandamos la lista en json pa q el js pueda descargar el csv!!!!
        try {
            model.addAttribute("voluntariosJson", objectMapper.writeValueAsString(voluntarios));
        } catch (Exception e) {
            model.addAttribute("voluntariosJson", "[]");
        }

        model.addAttribute("pagina", "inicio-voluntarios");

        //cargamos panel lateral de detalles si se hizo doble click
        if (voluntarioId != null && (verFiltros == null || !verFiltros)) {
            model.addAttribute("voluntarioSelec", voluntarioService.buscarPorId(voluntarioId));
            model.addAttribute("panelIzquierdo", "voluntarios/voluntarioDetalles.jsp");
        }

        //cargamos panel lateral de filtros si se le dio al btn de filtros
        if (verFiltros != null && verFiltros) {
            try {
                //AYUDA IA
                // pasamos los diccionarios a js pa q monte los desplegables dinamicos
                model.addAttribute("entidadesJson", objectMapper.writeValueAsString(entidadColaboradoraService.listarTodas()));
                model.addAttribute("tiendasJson", objectMapper.writeValueAsString(tiendaService.listarTiendasPorCampania(campaniaTabla.getId())));
            } catch (Exception e) {
                model.addAttribute("entidadesJson", "[]");
                model.addAttribute("tiendasJson", "[]");
            }

            // le devolvemos lo q busco pa q se quede marcado en la vista
            model.addAttribute("filtroId", filtroId);
            model.addAttribute("filtroEntidad", filtroEntidad);
            model.addAttribute("filtroResponsable", filtroResponsable);
            model.addAttribute("filtroTienda", filtroTienda);
            model.addAttribute("panelIzquierdo", "voluntarios/voluntarioFiltros.jsp");
        }

        return "inicio";
    }

    @PostMapping("/eliminar")
    public String eliminarVoluntario(@RequestParam("voluntarioId") Long voluntarioId, @RequestParam("campaniaId") Long campaniaId) {
        voluntarioService.eliminarVoluntario(voluntarioId);
        return "redirect:/voluntarios?campaniaId=" + campaniaId; // recarga tabla limpia
    }

    @GetMapping("/aniadir")
    public String aniadirVoluntario(@RequestParam("campaniaId") Long campaniaId, Model model) {
        model.addAttribute("campaniaId", campaniaId);
        //AYUDA IA
        try {
            // pasamos diccionarios para q el form los lea sin hacer mas peticiones
            model.addAttribute("entidadesJson", objectMapper.writeValueAsString(entidadColaboradoraService.listarTodas()));
            model.addAttribute("tiendasJson", objectMapper.writeValueAsString(tiendaService.listarTiendasPorCampania(campaniaId)));
        } catch (Exception e) {
            model.addAttribute("entidadesJson", "[]");
            model.addAttribute("tiendasJson", "[]");
        }
        model.addAttribute("pagina", "aniadir-voluntario");
        return "inicio";
    }

    //ayuda IA para refactorizar con VoluntarioNuevoDTO
    // funcion aux para empaquetar todo el lio de requestparams en el dto nuevo y q quede el controller limpio!!!!
    private VoluntarioNuevoDTO construirDto(Long campaniaId, Long responsableId, String observaciones, String horasSueltas, String horaInicio, String horaFin, String turnosJson) {
        VoluntarioNuevoDTO dto = new VoluntarioNuevoDTO();
        dto.setCampaniaId(campaniaId);
        dto.setResponsableId(responsableId);
        dto.setObservaciones(observaciones);
        dto.setHorasSueltas("si".equals(horasSueltas));
        dto.setHoraInicio(horaInicio);
        dto.setHoraFin(horaFin);

        List<TurnoNuevoDTO> listaTurnos = new ArrayList<>();
        // si js pasa turnos los metemos a la lista del dto
        if (turnosJson != null && !turnosJson.isEmpty() && !turnosJson.equals("[]")) {
            try {
                listaTurnos = objectMapper.readValue(turnosJson, new TypeReference<List<TurnoNuevoDTO>>() {});
            } catch (Exception ignored) {}
        }
        dto.setTurnosAsignados(listaTurnos);
        return dto;
    }

    @PostMapping("/guardar")
    public String guardarVoluntario(
            @RequestParam("campaniaId") Long campaniaId,
            @RequestParam("responsableId") Long responsableId,
            @RequestParam("observaciones") String observaciones,
            @RequestParam(value = "horasSueltas", required = false) String horasSueltas,
            @RequestParam(value = "horaInicio", required = false) String horaInicio,
            @RequestParam(value = "horaFin", required = false) String horaFin,
            @RequestParam("turnosJson") String turnosJson) {

        //pasamos los param de la url y los metemos en el dto
        VoluntarioNuevoDTO dto = construirDto(campaniaId, responsableId, observaciones, horasSueltas, horaInicio, horaFin, turnosJson);
        voluntarioService.guardarVoluntario(dto);
        return "redirect:/voluntarios?campaniaId=" + campaniaId;
    }

    @GetMapping("/modificar")
    public String modificarVoluntario(@RequestParam("campaniaId") Long campaniaId, @RequestParam("voluntarioId") Long voluntarioId, Model model) {
        CampaniaDTO campaniaTabla = campaniaService.findById(campaniaId);

        //cargamos el contexto de la tabla principal (como en tiendas)
        model.addAttribute("voluntariosSelec", voluntarioService.buscarPorCampania(campaniaTabla.getId()));
        model.addAttribute("campaniaSelec", campaniaTabla);
        model.addAttribute("campaniaId", campaniaTabla.getId());
        model.addAttribute("pagina", "inicio-voluntarios");

        //cargamos el vol q vamos a editar
        model.addAttribute("voluntarioSelec", voluntarioService.buscarPorId(voluntarioId));

        //AYUDA IA
        try {
            model.addAttribute("voluntariosJson", objectMapper.writeValueAsString(model.getAttribute("voluntariosSelec")));
        } catch (Exception e) {
            model.addAttribute("voluntariosJson", "[]");
        }

        //AYUDA IA
        try {
            model.addAttribute("entidadesJson", objectMapper.writeValueAsString(entidadColaboradoraService.listarTodas()));
            model.addAttribute("tiendasJson", objectMapper.writeValueAsString(tiendaService.listarTiendasPorCampania(campaniaId)));
        } catch (Exception e) {
            model.addAttribute("entidadesJson", "[]");
            model.addAttribute("tiendasJson", "[]");
        }

        model.addAttribute("panelIzquierdo", "voluntarios/voluntarioModificar.jsp");
        return "inicio";
    }

    @PostMapping("/actualizar")
    public String actualizarVoluntario(
            @RequestParam("campaniaId") Long campaniaId,
            @RequestParam("voluntarioId") Long voluntarioId,
            @RequestParam("responsableId") Long responsableId,
            @RequestParam("observaciones") String observaciones,
            @RequestParam("turnosJson") String turnosJson) {

        //aqui las horas van a null pq no se pueden tocar desde el modificar
        VoluntarioNuevoDTO dto = construirDto(campaniaId, responsableId, observaciones, null, null, null, turnosJson);
        voluntarioService.actualizarVoluntario(voluntarioId, dto);

        return "redirect:/voluntarios?campaniaId=" + campaniaId;
    }
}