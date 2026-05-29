package com.bancosol.controllers;

import com.bancosol.dto.IncidenciaDTO;
import com.bancosol.dto.IncidenciaFormDTO;
import com.bancosol.entities.enums.EstadoIncidencia;
import com.bancosol.services.IncidenciaService;
import com.bancosol.services.ResponsableEntidadService;
import com.bancosol.services.ResponsableTiendaService;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.List;

@Controller
@AllArgsConstructor
@RequestMapping("/incidencias")
public class IncidenciaController {

    private final IncidenciaService incidenciaService;
    private final ResponsableTiendaService responsableTiendaService;
    private final ResponsableEntidadService responsableEntidadService;

    @GetMapping({"", "/"})
    public String doInit(@RequestParam(value = "estado", required = false) String estado,
                         @RequestParam(value = "asunto", required = false) String asunto,
                         @RequestParam(value = "tipo", required = false) String tipo,
                         @RequestParam(value = "responsable", required = false) String responsable,
                         @RequestParam(value = "mostrarFiltros", required = false) Boolean mostrarFiltros,
                         Model model) {

        List<IncidenciaDTO> incidencias;

        if (estado == null || estado.isBlank()) {
            incidencias = incidenciaService.listarTodas();
        } else {
            incidencias = incidenciaService.listarPorEstado(estado);
        }

        incidencias = filtrarIncidencias(incidencias, asunto, tipo, responsable);

        model.addAttribute("pagina", "gestionar-incidencias");
        model.addAttribute("incidencias", incidencias);

        model.addAttribute("estadoSeleccionado", estado);
        model.addAttribute("asuntoSeleccionado", asunto);
        model.addAttribute("tipoSeleccionado", tipo);
        model.addAttribute("responsableSeleccionado", responsable);

        if (Boolean.TRUE.equals(mostrarFiltros)) {
            model.addAttribute("panelIzquierdo", "incidencias/panel-filtros.jsp");
        }

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

    @GetMapping("/detalle")
    public String doDetalle(@RequestParam("id") Long id, Model model) {
        IncidenciaDTO incidencia = incidenciaService.buscarPorId(id);

        model.addAttribute("pagina", "detalle-incidencia");
        model.addAttribute("incidencia", incidencia);

        return "inicio";
    }

    @PostMapping("/borrar")
    public String doBorrar(@RequestParam("id") Long id) {
        incidenciaService.eliminar(id);

        return "redirect:/incidencias";
    }

    @PostMapping("/guardar")
    public String doGuardar(@RequestParam(value = "id", required = false) Long id,
                            @RequestParam(value = "fechaHora", required = false)
                            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
                            LocalDateTime fechaHora,
                            @RequestParam(value = "asunto", required = false) String asunto,
                            @RequestParam(value = "descripcion", required = false) String descripcion,
                            @RequestParam(value = "estado", required = false) String estado,
                            @RequestParam(value = "responsableTiendaId", required = false) Long responsableTiendaId,
                            @RequestParam(value = "responsableEntidadId", required = false) Long responsableEntidadId) {

        IncidenciaFormDTO incidencia = new IncidenciaFormDTO();

        incidencia.setFechaHora(fechaHora);
        incidencia.setAsunto(asunto);
        incidencia.setDescripcion(descripcion);
        incidencia.setEstado(estado);
        incidencia.setResponsableTiendaId(responsableTiendaId);
        incidencia.setResponsableEntidadId(responsableEntidadId);

        if (id == null) {
            incidenciaService.crear(incidencia);
        } else {
            incidenciaService.actualizar(id, incidencia);
        }

        return "redirect:/incidencias";
    }

    @PostMapping("/cambiar-estado")
    public String doCambiarEstado(@RequestParam("id") Long id,
                                  @RequestParam("estado") String estado) {

        incidenciaService.cambiarEstado(id, estado);

        return "redirect:/incidencias/detalle?id=" + id;
    }

    private String editarCrear(Long id, Model model) {
        IncidenciaDTO incidencia;

        if (id == null) {
            incidencia = IncidenciaDTO.builder()
                    .estado(EstadoIncidencia.PENDIENTE)
                    .build();
        } else {
            incidencia = incidenciaService.buscarPorId(id);
            model.addAttribute("id", id);
        }

        model.addAttribute("pagina", "formulario-incidencia");
        model.addAttribute("incidencia", incidencia);

        cargarDatosFormulario(model);

        return "inicio";
    }

    private void cargarDatosFormulario(Model model) {
        model.addAttribute("responsablesTienda", responsableTiendaService.listarTodos());
        model.addAttribute("responsablesEntidad", responsableEntidadService.listarTodos());
    }

    private List<IncidenciaDTO> filtrarIncidencias(List<IncidenciaDTO> incidencias,
                                                   String asunto,
                                                   String tipo,
                                                   String responsable) {
        return incidencias.stream()
                .filter(incidencia -> coincideAsunto(incidencia, asunto))
                .filter(incidencia -> coincideTipo(incidencia, tipo))
                .filter(incidencia -> coincideResponsable(incidencia, responsable))
                .toList();
    }

    private boolean coincideAsunto(IncidenciaDTO incidencia, String asunto) {
        if (asunto == null || asunto.isBlank()) {
            return true;
        }

        if (incidencia.getAsunto() == null) {
            return false;
        }

        return incidencia.getAsunto()
                .toLowerCase()
                .contains(asunto.trim().toLowerCase());
    }

    private boolean coincideTipo(IncidenciaDTO incidencia, String tipo) {
        if (tipo == null || tipo.isBlank()) {
            return true;
        }

        if (incidencia.getReportadoPorTipo() == null) {
            return false;
        }

        return incidencia.getReportadoPorTipo().equalsIgnoreCase(tipo.trim());
    }

    private boolean coincideResponsable(IncidenciaDTO incidencia, String responsable) {
        if (responsable == null || responsable.isBlank()) {
            return true;
        }

        if (incidencia.getReportadoPorNombre() == null) {
            return false;
        }

        return incidencia.getReportadoPorNombre()
                .toLowerCase()
                .contains(responsable.trim().toLowerCase());
    }
}