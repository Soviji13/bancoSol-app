package com.bancosol.controllers;

import com.bancosol.dto.CoordinadorFormDTO;
import com.bancosol.services.CampaniaService;
import com.bancosol.services.CoordinadorService;
import com.bancosol.services.ZonaGeograficaService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@AllArgsConstructor
@RequestMapping("/coordinadores")
public class CoordinadorController {

    private final CoordinadorService coordinadorService;
    private final CampaniaService campaniaService;
    private final ZonaGeograficaService zonaGeograficaService;

    @GetMapping("/")
    public String doInit(Model model) {
        model.addAttribute("coordinadores", coordinadorService.listarTodos());
        model.addAttribute("campanias", campaniaService.listarTodas());

        return "coordinadores/listado";
    }

    protected String editarCrear(Long id, Model model) {
        CoordinadorFormDTO coordinador;

        if (id == null) {
            coordinador = new CoordinadorFormDTO();
            coordinador.setPermisoModificar(true);
            model.addAttribute("modoEdicion", false);
        } else {
            coordinador = coordinadorService.buscarFormularioPorId(id);
            model.addAttribute("id", id);
            model.addAttribute("modoEdicion", true);
        }

        model.addAttribute("coordinador", coordinador);

        cargarDatosFormulario(model);

        return "coordinadores/formulario";
    }

    @PostMapping("/anadir")
    public String doAnadir(Model model) {
        return this.editarCrear(null, model);
    }

    @GetMapping("/editar")
    public String doEditar(@RequestParam("id") Long id, Model model) {
        return this.editarCrear(id, model);
    }

    @GetMapping("/borrar")
    public String doBorrar(@RequestParam("id") Long id) {
        this.coordinadorService.eliminar(id);

        return "redirect:/coordinadores/";
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
                            @RequestParam(value = "idsCampanias", required = false) List<Long> idsCampanias) {

        if (permisoModificar == null) {
            permisoModificar = false;
        }

        CoordinadorFormDTO coordinador = new CoordinadorFormDTO();

        coordinador.setNombre(nombre);
        coordinador.setEmail(email);
        coordinador.setTelefono(telefono);
        coordinador.setArea(area);
        coordinador.setTiendas(tiendas);
        coordinador.setPermisoModificar(permisoModificar);
        coordinador.setUsuarioId(usuarioId);
        coordinador.setContactoId(contactoId);
        coordinador.setIdsCampanias(idsCampanias);

        if (id == null) {
            this.coordinadorService.crear(coordinador);
        } else {
            this.coordinadorService.actualizar(id, coordinador);
        }

        return "redirect:/coordinadores/";
    }

    private void cargarDatosFormulario(Model model) {
        model.addAttribute("campanias", campaniaService.listarTodas());
        model.addAttribute("zonas", zonaGeograficaService.listarTodas());
    }
}