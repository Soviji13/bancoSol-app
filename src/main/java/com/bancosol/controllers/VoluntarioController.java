//francisco javier garcia sierra 0% ia

package com.bancosol.controllers;

import com.bancosol.dto.CampaniaDTO;
import com.bancosol.dto.VoluntarioDTO;
import com.bancosol.services.CampaniaService;
import com.bancosol.services.EntidadColaboradoraService;
import com.bancosol.services.VoluntarioService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@AllArgsConstructor
@RequestMapping("/voluntarios")
public class VoluntarioController {

    private final VoluntarioService voluntarioService;
    private final CampaniaService campaniaService;
    private final EntidadColaboradoraService entidadColaboradoraService;

    @GetMapping({"", "/"})
    public String listarVoluntarios(
            @RequestParam(value = "campaniaId", required = false) Long campaniaId,
            @RequestParam(value = "voluntarioId", required = false) Long voluntarioId,
            @RequestParam(value = "verFiltros", required = false) Boolean verFiltros,
            @RequestParam(value = "nombreFiltro", required = false) String nombreFiltro,
            @RequestParam(value = "entidadIdFiltro", required = false) Long entidadIdFiltro,
            @RequestParam(value = "horasSueltasFiltro", required = false) String horasSueltasFiltro,
            Model model) {

        //campaña activa por defecto igual q en tiendas!!!!
        CampaniaDTO campaniaTabla = (campaniaId == null)
                ? campaniaService.devolverCampaniaActiva()
                : campaniaService.findById(campaniaId);

        //evaluamos filtros cruzados
        List<VoluntarioDTO> voluntarios;
        if (nombreFiltro != null || entidadIdFiltro != null || horasSueltasFiltro != null) {
            voluntarios = voluntarioService.listarVoluntariosFiltrados(
                    campaniaTabla.getId(), nombreFiltro, entidadIdFiltro, horasSueltasFiltro);
        } else {
            voluntarios = voluntarioService.listarPorCampania(campaniaTabla.getId());
        }

        model.addAttribute("voluntariosSelec", voluntarios);
        model.addAttribute("campaniaSelec", campaniaTabla);
        model.addAttribute("campaniaId", campaniaTabla.getId());

        try {
            ObjectMapper mapper = new ObjectMapper();
            model.addAttribute("voluntariosJson", mapper.writeValueAsString(voluntarios));
        } catch (Exception e) {
            model.addAttribute("voluntariosJson", "[]");
        }

        model.addAttribute("pagina", "inicio-voluntarios");

        if (voluntarioId != null) {
            VoluntarioDTO volSelec = voluntarioService.findById(voluntarioId);
            model.addAttribute("voluntarioSelec", volSelec);
            model.addAttribute("panelIzquierdo", "voluntarios/voluntarioDetalles.jsp");
        }

        if (verFiltros != null && verFiltros) {
            model.addAttribute("entidades", entidadColaboradoraService.listarTodas());
            model.addAttribute("nombreFiltro", nombreFiltro);
            model.addAttribute("entidadIdFiltro", entidadIdFiltro);
            model.addAttribute("horasSueltasFiltro", horasSueltasFiltro);
            model.addAttribute("panelIzquierdo", "voluntarios/voluntarioFiltros.jsp");
        }

        return "inicio";
    }

    @PostMapping("/eliminar")
    public String eliminarVoluntario(@RequestParam("voluntarioId") Long voluntarioId,
                                     @RequestParam("campaniaId") Long campaniaId) {
        voluntarioService.eliminarVoluntario(voluntarioId);
        return "redirect:/voluntarios?campaniaId=" + campaniaId;
    }
}