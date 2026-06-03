// Sofía Si Villalba Jiménez (IA generativa 0%)

package com.bancosol.controllers;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.bancosol.services.CampaniaService;



@Controller
@AllArgsConstructor
@RequestMapping("/entidades")
public class EntidadesController {

    private final CampaniaService campaniaService;

    @GetMapping({"", "/"})
    public String mostrarTabla( 
        @RequestParam( value = "campaniaId", required = false ) Long campaniaId,
        Model model
    ) 
    {
        if (campaniaId == null) {
            // Mostramos solo las que son de la campaña actual
            
        }

        model.addAttribute("pagina", "inicio-entidades");
        return "inicio";
    }
}