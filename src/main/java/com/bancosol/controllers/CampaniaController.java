// Alejandro Jiménez González
package com.bancosol.controllers;

import com.bancosol.dto.CampaniaDTO;
import com.bancosol.dto.CadenaDTO;
import com.bancosol.dto.CoordinadorDTO;
import com.bancosol.services.CadenaService;
import com.bancosol.services.CampaniaService;
import com.bancosol.services.CoordinadorService;
import com.bancosol.services.DistritoService;
import com.bancosol.services.EntidadColaboradoraService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Controller
public class CampaniaController {

    private final CampaniaService campaniaService;
    private final CadenaService cadenaService;
    private final CoordinadorService coordinadorService;
    private final EntidadColaboradoraService entidadService;
    private final DistritoService distritoService;

    public CampaniaController(CampaniaService campaniaService, CadenaService cadenaService,
                              CoordinadorService coordinadorService, EntidadColaboradoraService entidadService,
                              DistritoService distritoService) {
        this.campaniaService = campaniaService;
        this.cadenaService = cadenaService;
        this.coordinadorService = coordinadorService;
        this.entidadService = entidadService;
        this.distritoService = distritoService;
    }

    @ModelAttribute("usuario")
    public HttpSession getUsuarioGlobal(HttpSession session) {
        return session;
    }

    private boolean cargarDatosComunesCampania(Long id, Model model) {
        CampaniaDTO campania = campaniaService.findById(id);
        if (campania == null) {
            return false;
        }
        model.addAttribute("cadenas", cadenaService.listarTodas());
        model.addAttribute("coordinadores", coordinadorService.buscarTodosPorId(campania.getIdsCoordinadores()));
        model.addAttribute("campania", campania);
        return true;
    }

    @GetMapping("/campanias")
    public String verCampania(Model model) {
        List<CampaniaDTO> campaniasOrdenadas = campaniaService.listarTodas().stream()
                .sorted(Comparator.comparing(CampaniaDTO::getFechaInicio).reversed())
                .toList();

        model.addAttribute("campanias", campaniasOrdenadas);
        model.addAttribute("pagina", "campanias");
        return "inicio";
    }

    @GetMapping("/campanias/generar")
    public String verGenerarCampania(Model model) {
        model.addAttribute("campania", new CampaniaDTO());
        model.addAttribute("cadenas", cadenaService.listarTodas());
        model.addAttribute("coordinadores", coordinadorService.listarTodos());
        model.addAttribute("pagina", "generar-campania");
        return "inicio";
    }

    @GetMapping("/campanias/gestion")
    public String verGestionCampania(@RequestParam("id") Long id, Model model) {
        if (!cargarDatosComunesCampania(id, model)) return "redirect:/campanias";

        model.addAttribute("pagina", "gestionar-campanias");
        return "inicio";
    }

    @GetMapping("/campanias/gestion/coordinadores")
    public String verGestionCoordinadoresCampania(@RequestParam("id") Long id) {
        if (campaniaService.findById(id) == null) return "redirect:/campanias";
        return "redirect:/coordinadores?campaniaId=" + id;
    }

    @GetMapping("/campanias/gestion/modificar")
    public String verModificarCampania(@RequestParam("id") Long id, Model model) {
        if (!cargarDatosComunesCampania(id, model)) return "redirect:/campanias";

        model.addAttribute("pagina", "modificar-campania");
        model.addAttribute("panelIzquierdo", "campanias/panel_modificar_campania.jsp");
        return "inicio";
    }

    @GetMapping("/campanias/gestion/cadenas")
    public String verGestionCadenas(@RequestParam("id") Long id, Model model) {
        if (!cargarDatosComunesCampania(id, model)) return "redirect:/campanias";

        model.addAttribute("pagina", "cadenas/gestionar-cadenas");
        model.addAttribute("panelIzquierdo", "cadenas/panel_gestionar_cadenas.jsp");
        return "inicio";
    }

    @GetMapping("/campanias/gestion/coordinador")
    public String verGestionCampaniaCoordinador(@RequestParam("id") Long id,
                                                @RequestParam("campania") Long campania,
                                                Model model) {
        CoordinadorDTO coordinador = coordinadorService.buscarPorId(id);
        if (coordinador == null) return "redirect:/campanias";

        CampaniaDTO campaniaDTO = campaniaService.findById(campania);

        List<CoordinadorDTO> coordinadoresCampania = (campaniaDTO != null && campaniaDTO.getIdsCoordinadores() != null)
                ? coordinadorService.buscarTodosPorId(campaniaDTO.getIdsCoordinadores())
                : Collections.emptyList();

        model.addAttribute("coordinador", coordinador);
        model.addAttribute("entidades", entidadService.listarTodas());
        model.addAttribute("distritos", distritoService.listarTodos());
        model.addAttribute("coordinadores", coordinadoresCampania);
        model.addAttribute("campanias", campaniaService.listarTodas());
        model.addAttribute("campaniaSeleccionada", campaniaDTO);
        model.addAttribute("campaniaIdSeleccionada", campania);

        model.addAttribute("pagina", "gestionar-coordinadores");
        model.addAttribute("panelIzquierdo", "coordinadores/panel_info_coordinador.jsp");
        return "inicio";
    }

    @GetMapping("/campanias/eliminar")
    public String eliminarCampania(@RequestParam("id") Long id) {
        campaniaService.eliminar(id);
        return "redirect:/campanias";
    }

    @PostMapping("/campanias/guardar")
    public String guardarCampania(@ModelAttribute CampaniaDTO campaniaDTO) {
        return "redirect:/campanias/gestion?id=" + campaniaService.guardar(campaniaDTO).getId();
    }

    @PostMapping("/campanias/cambiar-estado")
    public String cambiarEstadoCampania(@RequestParam("id") Long id,
                                        @RequestParam("nuevoEstado") boolean nuevoEstado) {
        campaniaService.cambiarEstado(id, nuevoEstado);
        return "redirect:/campanias/gestion?id=" + id;
    }

    @PostMapping("/campanias/gestion/coordinadores/vincular")
    public String vincularCoordinadorCampania(@RequestParam("campaniaId") Long campaniaId,
                                              @RequestParam("coordinadorId") Long coordinadorId) {
        campaniaService.vincularCoordinador(campaniaId, coordinadorId);
        return "redirect:/campanias/gestion/coordinadores?id=" + campaniaId;
    }

    @PostMapping("/campanias/gestion/coordinadores/desvincular")
    public String desvincularCoordinadorCampania(@RequestParam("campaniaId") Long campaniaId,
                                                 @RequestParam("coordinadorId") Long coordinadorId) {
        campaniaService.desvincularCoordinador(campaniaId, coordinadorId);
        return "redirect:/campanias/gestion/coordinadores?id=" + campaniaId;
    }

    @PostMapping("/campanias/gestion/cadenas/vincular")
    public String vincularCadenas(@RequestParam("campaniaId") Long campaniaId,
                                  @RequestParam(value = "idsCadenas", required = false) List<Long> idsCadenas) {
        CampaniaDTO campania = campaniaService.findById(campaniaId);
        if (campania != null) {
            campania.setIdsCadenas(idsCadenas);
            campaniaService.guardar(campania);
        }
        return "redirect:/campanias/gestion/cadenas?id=" + campaniaId;
    }

    @PostMapping("/cadenas/crear")
    public String crearCadena(@ModelAttribute CadenaDTO cadenaDTO,
                              @RequestParam("campaniaId") Long campaniaId) {
        cadenaService.guardar(cadenaDTO);
        return "redirect:/campanias/gestion/cadenas?id=" + campaniaId;
    }

    @PostMapping("/cadenas/eliminar")
    public String eliminarCadena(@RequestParam("cadenaId") Long cadenaId,
                                 @RequestParam("campaniaId") Long campaniaId) {
        cadenaService.eliminar(cadenaId);
        return "redirect:/campanias/gestion/cadenas?id=" + campaniaId;
    }
}