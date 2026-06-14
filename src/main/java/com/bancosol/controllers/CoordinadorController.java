//Hecho por Jose González (75%), refactorizado finalmente con IA para  buscar eficiencia sin alterar la funcionalidad (25%)
package com.bancosol.controllers;

import com.bancosol.dto.CampaniaDTO;
import com.bancosol.dto.CoordinadorDTO;
import com.bancosol.dto.CoordinadorFormDTO;
import com.bancosol.services.CampaniaService;
import com.bancosol.services.CoordinadorService;
import com.bancosol.services.ZonaGeograficaService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@AllArgsConstructor
@RequestMapping("/coordinadores")
public class CoordinadorController {

    private final CoordinadorService coordinadorService;
    private final CampaniaService campaniaService;
    private final ZonaGeograficaService zonaGeograficaService;

    @GetMapping({"", "/"})
    public String doInit(@RequestParam(value = "campaniaId", required = false) Long campaniaId,
                         @RequestParam(value = "mostrarFiltros", required = false) Boolean mostrarFiltros,
                         Model model) {

        List<CoordinadorDTO> coordinadores =
                coordinadorService.filtrar(null, campaniaId, null);

        cargarModeloListado(
                model,
                coordinadores,
                null,
                campaniaId,
                null,
                Boolean.TRUE.equals(mostrarFiltros)
        );

        return "inicio";
    }

    @PostMapping("/filtrar")
    public String doFiltrar(@RequestParam(value = "nombre", required = false) String nombre,
                            @RequestParam(value = "campaniaId", required = false) Long campaniaId,
                            @RequestParam(value = "tiendasMinimas", required = false) Short tiendasMinimas,
                            Model model) {

        List<CoordinadorDTO> coordinadores =
                coordinadorService.filtrar(nombre, campaniaId, tiendasMinimas);

        cargarModeloListado(
                model,
                coordinadores,
                nombre,
                campaniaId,
                tiendasMinimas,
                true
        );

        return "inicio";
    }

    @GetMapping("/nuevo")
    public String doNuevo(Model model) {
        return editarCrear(null, model);
    }

    @GetMapping("/editar")
    public String doEditar(@RequestParam("id") Long id, Model model) {
        return editarCrear(id, model);
    }

    @PostMapping("/borrar") //Protegido pra que no muestre white label en caso de relación rara
    public String doBorrar(@RequestParam("id") Long id,
                           org.springframework.web.servlet.mvc.support.RedirectAttributes redirectAttributes) {
        try {
            coordinadorService.eliminar(id);
            redirectAttributes.addFlashAttribute("mensajeExito", "Coordinador eliminado correctamente.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute(
                    "mensajeError",
                    "No se pudo eliminar el coordinador: " + e.getMessage()
            );
        }

        return "redirect:/coordinadores";
    }

    @PostMapping("/guardar")
    public String doGuardar(@RequestParam(value = "id", required = false) Long id,
                            @RequestParam(value = "nombre", required = false) String nombre,
                            @RequestParam(value = "email", required = false) String email,
                            @RequestParam(value = "telefono", required = false) String telefono,
                            @RequestParam(value = "area", required = false) String area,
                            @RequestParam(value = "tiendas", required = false) Short tiendas,
                            @RequestParam(value = "permisoModificar", required = false) Boolean permisoModificar,
                            @RequestParam(value = "usuarioId", required = false) Long usuarioId,
                            @RequestParam(value = "contactoId", required = false) Long contactoId,
                            @RequestParam(value = "entidadId", required = false) Long entidadId,
                            @RequestParam(value = "idsCampanias", required = false) List<Long> idsCampanias) {

        CoordinadorFormDTO coordinador = new CoordinadorFormDTO();

        coordinador.setNombre(nombre);
        coordinador.setEmail(email);
        coordinador.setTelefono(telefono);
        coordinador.setArea(area);
        coordinador.setTiendas(tiendas);
        coordinador.setPermisoModificar(permisoModificar != null ? permisoModificar : false);
        coordinador.setUsuarioId(usuarioId);
        coordinador.setContactoId(contactoId);
        coordinador.setEntidadId(entidadId);
        coordinador.setIdsCampanias(idsCampanias);

        if (id == null) {
            coordinadorService.crear(coordinador);
        } else {
            coordinadorService.actualizar(id, coordinador);
        }

        return "redirect:/coordinadores";
    }

    private void cargarModeloListado(Model model,
                                     List<CoordinadorDTO> coordinadores,
                                     String nombre,
                                     Long campaniaId,
                                     Short tiendasMinimas,
                                     boolean mostrarFiltros) {

        model.addAttribute("pagina", "gestionar-coordinadores");
        model.addAttribute("coordinadores", coordinadores);
        model.addAttribute("campanias", campaniaService.listarTodas());

        model.addAttribute("nombreSeleccionado", nombre);
        model.addAttribute("campaniaIdSeleccionada", campaniaId);
        model.addAttribute("tiendasMinimasSeleccionadas", tiendasMinimas);

        if (campaniaId != null) {
            CampaniaDTO campania = campaniaService.findById(campaniaId);
            model.addAttribute("campaniaSeleccionada", campania);
        }

        if (mostrarFiltros) {
            model.addAttribute("panelIzquierdo", "coordinadores/panel-filtro.jsp");
        } else {
            model.addAttribute("panelIzquierdo", "layout/menu.jsp");
        }
    }

    private String editarCrear(Long id, Model model) {
        CoordinadorFormDTO coordinador;

        if (id == null) {
            coordinador = new CoordinadorFormDTO();
        } else {
            coordinador = coordinadorService.buscarFormularioPorId(id);
            model.addAttribute("id", id);
        }

        model.addAttribute("pagina", "formulario-coordinador");
        model.addAttribute("panelIzquierdo", "layout/menu.jsp");
        model.addAttribute("coordinador", coordinador);

        cargarDatosFormulario(model);

        return "inicio";
    }

    private void cargarDatosFormulario(Model model) {
        model.addAttribute("campanias", campaniaService.listarTodas());
        model.addAttribute("zonas", zonaGeograficaService.listarTodas());
    }
}