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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Controller
public class CampaniaController {

    private final CampaniaService campaniaService;
    private final CadenaService cadenaService;
    private final CoordinadorService coordinadorService;
    private final EntidadColaboradoraService entidadService;
    private final DistritoService distritoService;

    public CampaniaController(CampaniaService campaniaService,
                              CadenaService cadenaService,
                              CoordinadorService coordinadorService,
                              EntidadColaboradoraService entidadService,
                              DistritoService distritoService) {
        this.campaniaService = campaniaService;
        this.cadenaService = cadenaService;
        this.coordinadorService = coordinadorService;
        this.entidadService = entidadService;
        this.distritoService = distritoService;
    }

    @GetMapping("/campanias")
    public String verCampania(Model model, HttpSession session) {
        List<CampaniaDTO> campaniasOrdenadas = campaniaService.listarTodas()
                .stream()
                .sorted(Comparator.comparing(CampaniaDTO::getFechaInicio).reversed())
                .collect(Collectors.toList());

        model.addAttribute("campanias", campaniasOrdenadas);
        model.addAttribute("usuario", session);
        model.addAttribute("pagina", "campanias/campanias");

        return "inicio";
    }

    @GetMapping("/campanias/generar")
    public String verGenerarCampania(Model model, HttpSession session) {
        model.addAttribute("campania", new CampaniaDTO());
        model.addAttribute("cadenas", cadenaService.listarTodas());
        model.addAttribute("coordinadores", coordinadorService.listarTodos());
        model.addAttribute("usuario", session);
        model.addAttribute("pagina", "campanias/generar-campania");

        return "inicio";
    }

    @GetMapping("/campanias/gestion")
    public String verGestionCampania(@RequestParam("id") Long id,
                                     HttpSession session,
                                     Model model) {
        CampaniaDTO campania = campaniaService.findById(id);

        if (campania == null) {
            return "redirect:/campanias";
        }

        model.addAttribute("cadenas", cadenaService.listarTodas());
        model.addAttribute("coordinadores", coordinadorService.buscarTodosPorId(campania.getIdsCoordinadores()));
        model.addAttribute("campania", campania);
        model.addAttribute("usuario", session);
        model.addAttribute("pagina", "campanias/gestionar-campanias");

        return "inicio";
    }

    @GetMapping("/campanias/gestion/coordinadores")
    public String verGestionCoordinadoresCampania(@RequestParam("id") Long id) {
        CampaniaDTO campania = campaniaService.findById(id);

        if (campania == null) {
            return "redirect:/campanias";
        }

        return "redirect:/coordinadores?campaniaId=" + id;
    }

    @GetMapping("/campanias/gestion/modificar")
    public String verModificarCampania(@RequestParam("id") Long id,
                                       HttpSession session,
                                       Model model) {
        CampaniaDTO campania = campaniaService.findById(id);

        if (campania == null) {
            return "redirect:/campanias";
        }

        model.addAttribute("cadenas", cadenaService.listarTodas());
        model.addAttribute("coordinadores", coordinadorService.buscarTodosPorId(campania.getIdsCoordinadores()));
        model.addAttribute("campania", campania);
        model.addAttribute("usuario", session);

        model.addAttribute("pagina", "campanias/modificar-campania");
        model.addAttribute("panelIzquierdo", "campanias/panel_modificar_campania.jsp");

        return "inicio";
    }

    @GetMapping("/campanias/gestion/cadenas")
    public String verGestionCadenas(@RequestParam("id") Long id,
                                    HttpSession session,
                                    Model model) {
        CampaniaDTO campania = campaniaService.findById(id);

        if (campania == null) {
            return "redirect:/campanias";
        }

        model.addAttribute("cadenas", cadenaService.listarTodas());
        model.addAttribute("campania", campania);
        model.addAttribute("usuario", session);

        model.addAttribute("pagina", "cadenas/gestionar-cadenas");
        model.addAttribute("panelIzquierdo", "cadenas/panel_gestionar_cadenas.jsp");

        return "inicio";
    }

    @GetMapping("/campanias/gestion/coordinador")
    public String verGestionCampaniaCoordinador(@RequestParam("id") Long id,
                                                @RequestParam("campania") Long campania,
                                                HttpSession session,
                                                Model model) {

        CoordinadorDTO coordinador = coordinadorService.buscarPorId(id);

        if (coordinador == null) {
            return "redirect:/campanias";
        }


        CampaniaDTO campaniaDTO = campaniaService.findById(campania);


        List<CoordinadorDTO> coordinadoresCampania = List.of();
        if (campaniaDTO != null && campaniaDTO.getIdsCoordinadores() != null) {
            coordinadoresCampania = coordinadorService.buscarTodosPorId(campaniaDTO.getIdsCoordinadores());
        }


        model.addAttribute("coordinador", coordinador);
        model.addAttribute("entidades", entidadService.listarTodas());
        model.addAttribute("distritos", distritoService.listarTodos());

        model.addAttribute("coordinadores", coordinadoresCampania);
        model.addAttribute("campanias", campaniaService.listarTodas());
        model.addAttribute("campaniaSeleccionada", campaniaDTO);
        model.addAttribute("campaniaIdSeleccionada", campania);

        model.addAttribute("usuario", session);

        model.addAttribute("pagina", "coordinadores/detalles-coordinador");
        model.addAttribute("panelIzquierdo", "coordinadores/panel_info_coordinador.jsp");

        return "inicio";
    }

    @PostMapping("/campanias/guardar")
    public String guardarCampania(@ModelAttribute CampaniaDTO campaniaDTO) {
        CampaniaDTO guardada = campaniaService.guardar(campaniaDTO);

        return "redirect:/campanias/gestion?id=" + guardada.getId();
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

    @GetMapping("/campanias/eliminar")
    public String eliminarCampania(@RequestParam("id") Long id) {
        campaniaService.eliminar(id);

        return "redirect:/campanias";
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