package com.bancosol.controllers;

import com.bancosol.dto.CoordinadorDTO;
import com.bancosol.dto.CoordinadorFormDTO;
import com.bancosol.services.CampaniaService;
import com.bancosol.services.CoordinadorService;
import com.bancosol.services.ZonaGeograficaService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/coordinadores")
public class CoordinadorController {

    private final CoordinadorService coordinadorService;
    private final CampaniaService campaniaService;
    private final ZonaGeograficaService zonaGeograficaService;

    public CoordinadorController(CoordinadorService coordinadorService,
                                 CampaniaService campaniaService,
                                 ZonaGeograficaService zonaGeograficaService) {
        this.coordinadorService = coordinadorService;
        this.campaniaService = campaniaService;
        this.zonaGeograficaService = zonaGeograficaService;
    }

    @GetMapping
    public String listar(Model model) {
        List<CoordinadorDTO> coordinadores = coordinadorService.listarTodos();

        model.addAttribute("coordinadores", coordinadores);
        model.addAttribute("campanias", campaniaService.listarTodas());

        return "coordinadores/listado";
    }

    @GetMapping("/nuevo")
    public String mostrarFormularioNuevo(Model model) {
        CoordinadorFormDTO formDTO = new CoordinadorFormDTO();
        formDTO.setPermisoModificar(true);

        model.addAttribute("coordinador", formDTO);
        model.addAttribute("modoEdicion", false);

        cargarDatosFormulario(model);

        return "coordinadores/formulario";
    }

    @GetMapping("/editar/{id}")
    public String mostrarFormularioEditar(@PathVariable Long id, Model model) {
        CoordinadorDTO coordinador = coordinadorService.buscarPorId(id);

        CoordinadorFormDTO formDTO = pasarDtoAFormulario(coordinador);

        model.addAttribute("id", id);
        model.addAttribute("coordinador", formDTO);
        model.addAttribute("modoEdicion", true);

        cargarDatosFormulario(model);

        return "coordinadores/formulario";
    }

    @PostMapping("/guardar")
    public String guardarNuevo(@ModelAttribute CoordinadorFormDTO coordinador,
                               Model model) {
        try {
            normalizarCheckboxPermiso(coordinador);

            coordinadorService.crear(coordinador);

            return "redirect:/coordinadores";
        } catch (RuntimeException e) {
            model.addAttribute("error", e.getMessage());
            model.addAttribute("coordinador", coordinador);
            model.addAttribute("modoEdicion", false);

            cargarDatosFormulario(model);

            return "coordinadores/formulario";
        }
    }

    @PostMapping("/actualizar/{id}")
    public String actualizar(@PathVariable Long id,
                             @ModelAttribute CoordinadorFormDTO coordinador,
                             Model model) {
        try {
            normalizarCheckboxPermiso(coordinador);

            coordinadorService.actualizar(id, coordinador);

            return "redirect:/coordinadores";
        } catch (RuntimeException e) {
            model.addAttribute("error", e.getMessage());
            model.addAttribute("id", id);
            model.addAttribute("coordinador", coordinador);
            model.addAttribute("modoEdicion", true);

            cargarDatosFormulario(model);

            return "coordinadores/formulario";
        }
    }

    @PostMapping("/eliminar/{id}")
    public String eliminar(@PathVariable Long id,
                           org.springframework.web.servlet.mvc.support.RedirectAttributes redirectAttributes) {
        try {
            coordinadorService.eliminar(id);

            redirectAttributes.addFlashAttribute(
                    "mensajeExito",
                    "Coordinador eliminado correctamente."
            );
        } catch (RuntimeException e) {
            redirectAttributes.addFlashAttribute(
                    "mensajeError",
                    e.getMessage()
            );
        }

        return "redirect:/coordinadores";
    }

    private CoordinadorFormDTO pasarDtoAFormulario(CoordinadorDTO coordinador) {
        CoordinadorFormDTO formDTO = new CoordinadorFormDTO();

        formDTO.setNombre(coordinador.getNombre());
        formDTO.setEmail(coordinador.getEmail());
        formDTO.setTelefono(coordinador.getTelefono());
        formDTO.setArea(coordinador.getArea());
        formDTO.setTiendas(coordinador.getTiendas());
        formDTO.setPermisoModificar(coordinador.getPermisoModificar());
        formDTO.setUsuarioId(coordinador.getUsuarioId());
        formDTO.setContactoId(coordinador.getContactoId());
        formDTO.setIdsCampanias(coordinador.getIdsCampanias());

        return formDTO;
    }

    private void cargarDatosFormulario(Model model) {
        model.addAttribute("campanias", campaniaService.listarTodas());
        model.addAttribute("zonas", zonaGeograficaService.listarTodas());
    }

    private void normalizarCheckboxPermiso(CoordinadorFormDTO coordinador) {
        if (coordinador.getPermisoModificar() == null) {
            coordinador.setPermisoModificar(false);
        }
    }
}