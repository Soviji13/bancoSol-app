package com.bancosol.controllers;

import com.bancosol.services.DiagnosticoPersistenciaService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class DiagnosticoPersistenciaController {

    private final DiagnosticoPersistenciaService diagnosticoPersistenciaService;

    public DiagnosticoPersistenciaController(DiagnosticoPersistenciaService diagnosticoPersistenciaService) {
        this.diagnosticoPersistenciaService = diagnosticoPersistenciaService;
    }

    @GetMapping("/test-db/diagnostico")
    public String verDiagnostico(Model model) {
        model.addAttribute("estados", diagnosticoPersistenciaService.revisarRepositorios());
        return "diagnostico-persistencia";
    }

    @GetMapping("/test-db/repos/{nombreBean}")
    public String verDetalleRepositorio(@PathVariable String nombreBean,
                                        @RequestParam(defaultValue = "10") int limite,
                                        Model model) {
        try {
            model.addAttribute("detalle", diagnosticoPersistenciaService.detalleRepositorio(nombreBean, limite));
            return "detalle-repositorio";
        } catch (IllegalArgumentException ex) {
            model.addAttribute("error", ex.getMessage());
            return "detalle-repositorio";
        }
    }
}

