package com.bancosol.controllers;

import com.bancosol.dto.CampaniaDTO;
import com.bancosol.dto.CadenaDTO;
import com.bancosol.dto.CoordinadorDTO;
import com.bancosol.services.CadenaService;
import com.bancosol.services.CampaniaService;
import com.bancosol.services.CoordinadorService;
import com.bancosol.services.EntidadColaboradoraService;
import com.bancosol.services.DistritoService;
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

    public CampaniaController(CampaniaService campaniaService, CadenaService cadenaService,
                              CoordinadorService coordinadorService, EntidadColaboradoraService entidadService,
                              DistritoService distritoService) {
        this.campaniaService = campaniaService;
        this.cadenaService = cadenaService;
        this.coordinadorService = coordinadorService;
        this.entidadService = entidadService;
        this.distritoService = distritoService;
    }

    @GetMapping("/campanias")
    public String verCampania(Model model, HttpSession session) {
        List<CampaniaDTO> campaniasOrdenadas = campaniaService.listarTodas().stream()
                .sorted(Comparator.comparing(CampaniaDTO::getFechaInicio).reversed())
                .collect(Collectors.toList());

        model.addAttribute("campanias", campaniasOrdenadas);
        model.addAttribute("usuario", session);
        return "campanias";
    }

    // ==========================================
    // CREACIÓN Y MODIFICACIÓN DE CAMPAÑA
    // ==========================================

    @GetMapping("/campanias/generar")
    public String verGenerarCampania(Model model, HttpSession session) {
        // Pasamos el DTO vacío para el formulario
        model.addAttribute("campania", new CampaniaDTO());

        model.addAttribute("cadenas", cadenaService.listarTodas());
        model.addAttribute("coordinadores", coordinadorService.listarTodos());

        model.addAttribute("usuario", session);
        return "generar-campania";
    }

    @PostMapping("/campanias/guardar")
    public String guardarCampania(@ModelAttribute CampaniaDTO campaniaDTO) {
        CampaniaDTO guardada = campaniaService.guardar(campaniaDTO);
        return "redirect:/campanias/gestion?id=" + guardada.getId();
    }

    @GetMapping("/campanias/gestion")
    public String verGestionCampania(@RequestParam("id") Long id, HttpSession session, Model model) {
        CampaniaDTO campania = campaniaService.findById(id);
        if (campania == null) {
            return "redirect:/campanias";
        } else {
            model.addAttribute("cadenas", cadenaService.listarTodas());
            model.addAttribute("coordinadores", coordinadorService.findAllById(campania.getIdsCoordinadores()));
            model.addAttribute("campania", campania);
            model.addAttribute("usuario", session);
            return "gestionar-campanias";
        }
    }

    @PostMapping("/campanias/cambiar-estado")
    public String cambiarEstadoCampania(@RequestParam("id") Long id,
                                        @RequestParam("nuevoEstado") boolean nuevoEstado) {

        campaniaService.cambiarEstado(id, nuevoEstado);

        // Recargamos la vista de detalles para ver el cambio
        return "redirect:/campanias/gestion?id=" + id;
    }

    @GetMapping("/campanias/gestion/coordinadores")
    public String verGestionCoordinadoresCampania(@RequestParam("id") Long id, HttpSession session, Model model) {
        CampaniaDTO campania = campaniaService.findById(id);
        if (campania == null) return "redirect:/campanias";

        // 1. Obtenemos absolutamente todos los coordinadores del sistema
        List<CoordinadorDTO> todosLosCoordinadores = coordinadorService.listarTodos();

        // 2. Filtramos los que YA están asignados a esta campaña
        List<Long> idsAsignados = campania.getIdsCoordinadores() != null ? campania.getIdsCoordinadores() : List.of();

        List<CoordinadorDTO> asignados = todosLosCoordinadores.stream()
                .filter(c -> idsAsignados.contains(c.getId()))
                .collect(Collectors.toList());

        // 3. Filtramos los que AÚN NO están asignados (para el desplegable)
        List<CoordinadorDTO> noAsignados = todosLosCoordinadores.stream()
                .filter(c -> !idsAsignados.contains(c.getId()))
                .collect(Collectors.toList());

        model.addAttribute("campania", campania);
        model.addAttribute("asignados", asignados);
        model.addAttribute("noAsignados", noAsignados);
        model.addAttribute("usuario", session);

        return "gestionar-coordinadores";
    }

    @PostMapping("/campanias/gestion/coordinadores/vincular")
    public String vincularCoordinadorCampania(@RequestParam("campaniaId") Long campaniaId,
                                              @RequestParam("coordinadorId") Long coordinadorId) {
        // Usamos el método que ya tienes en tu CampaniaService
        campaniaService.vincularCoordinador(campaniaId, coordinadorId);
        return "redirect:/campanias/gestion/coordinadores?id=" + campaniaId;
    }

    @PostMapping("/campanias/gestion/coordinadores/desvincular")
    public String desvincularCoordinadorCampania(@RequestParam("campaniaId") Long campaniaId,
                                                 @RequestParam("coordinadorId") Long coordinadorId) {
        // Usamos el método que ya tienes en tu CampaniaService
        campaniaService.desvincularCoordinador(campaniaId, coordinadorId);
        return "redirect:/campanias/gestion/coordinadores?id=" + campaniaId;
    }


    @GetMapping("/campanias/gestion/coordinador")
    public String verGestionCampaniaCoordinador(@RequestParam("id") Long id, HttpSession session, Model model) {
        CoordinadorDTO coordinador = coordinadorService.findById(id);
        if (coordinador == null) {
            return "redirect:/campanias";
        } else {
            List<CampaniaDTO> campanias = campaniaService.findAllById(coordinador.getIdsCampanias());
            model.addAttribute("campanias", campanias);
            model.addAttribute("coordinador", coordinador);
            model.addAttribute("usuario", session);

            model.addAttribute("entidades", entidadService.listarTodas());
            model.addAttribute("distritos", distritoService.listarTodos());

            return "detalles-coordinador";
        }
    }

    @PostMapping("/coordinadores/guardar")
    public String guardarCoordinador(@ModelAttribute("coordinadorDTO") CoordinadorDTO coordinadorDTO,
                                     @RequestParam(value = "campaniaId", required = false) Long campaniaId) {

        Long idCoordinadorGuardado = coordinadorService.guardar(coordinadorDTO);

        if (campaniaId != null) {
            campaniaService.vincularCoordinador(campaniaId, idCoordinadorGuardado);
            return "redirect:/campanias/gestion?id=" + campaniaId;
        }

        return "redirect:/campanias";
    }

    @GetMapping("/coordinadores/eliminar")
    public String eliminarCoordinador(@RequestParam("id") Long id,
                                      @RequestParam(value = "campaniaId", required = false) Long campaniaId) {
        if (campaniaId != null) {
            campaniaService.desvincularCoordinador(campaniaId, id);
            return "redirect:/campanias/gestion?id=" + campaniaId;
        }
        else {
            coordinadorService.eliminar(id);
            return "redirect:/coordinadores";
        }
    }

    @GetMapping("/campanias/gestion/modificar")
    public String verModificarCampania(@RequestParam("id") Long id, HttpSession session, Model model) {
        CampaniaDTO campania = campaniaService.findById(id);
        if (campania == null) return "redirect:/campanias";

        model.addAttribute("cadenas", cadenaService.listarTodas());
        model.addAttribute("coordinadores", coordinadorService.findAllById(campania.getIdsCoordinadores()));
        model.addAttribute("campania", campania);
        model.addAttribute("usuario", session);
        return "modificar-campania";
    }



    @GetMapping("/campanias/eliminar")
    public String eliminarCampania(@RequestParam("id") Long id) {
        campaniaService.eliminar(id);
        return "redirect:/campanias";
    }

    // ==========================================
    // NUEVA SECCIÓN: GESTIÓN DE CADENAS
    // ==========================================

    // 1. Mostrar la vista
    @GetMapping("/campanias/gestion/cadenas")
    public String verGestionCadenas(@RequestParam("id") Long id, HttpSession session, Model model) {
        CampaniaDTO campania = campaniaService.findById(id);
        if (campania == null) return "redirect:/campanias";

        model.addAttribute("cadenas", cadenaService.listarTodas());
        model.addAttribute("campania", campania);
        model.addAttribute("usuario", session);
        return "gestionar-cadenas";
    }

    // 2. Vincular las cadenas seleccionadas a la campaña
    @PostMapping("/campanias/gestion/cadenas/vincular")
    public String vincularCadenas(@RequestParam("campaniaId") Long campaniaId,
                                  @RequestParam(value = "idsCadenas", required = false) List<Long> idsCadenas) {

        CampaniaDTO campania = campaniaService.findById(campaniaId);
        if (campania != null) {
            // Actualizamos la lista de IDs y guardamos
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
        // Cuidado: Si la cadena tiene tiendas asociadas, la BD lanzará error por integridad referencial.
        cadenaService.eliminar(cadenaId);
        return "redirect:/campanias/gestion/cadenas?id=" + campaniaId;
    }
}