package com.bancosol.controllers;

import com.bancosol.services.CadenaService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TestController {

    private final CadenaService cadenaSsrService;

    public TestController(CadenaService cadenaSsrService) {
        this.cadenaSsrService = cadenaSsrService;
    }

    @GetMapping("/test-db")
    public String verCadenas(Model model) {
        // SSR (JSP) consume su propio servicio de vista, no el repositorio directo.
        model.addAttribute("listaCadenas", cadenaSsrService.listarTodas());
        return "ver-cadenas";
    }
}