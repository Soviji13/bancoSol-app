// Sofía Si Villalba Jiménez (IA generativa 0%)

package com.bancosol.controllers;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.bancosol.dto.CampaniaDTO;
import com.bancosol.dto.EntidadColaboradoraDTO;
import com.bancosol.services.CampaniaService;
import com.bancosol.services.EntidadColaboradoraService;

import java.util.ArrayList;
import java.util.List;



@Controller
@AllArgsConstructor
@RequestMapping("/entidades")
public class EntidadesController {

    private final CampaniaService campaniaService;
    private final EntidadColaboradoraService entidadService;

    @GetMapping({"", "/"})
    public String mostrarTabla( 
        @RequestParam( value = "campaniaId", required = false ) Long campaniaId,
        Model model
    ) 
    {
        CampaniaDTO campaniaTabla = new CampaniaDTO();

        if (campaniaId == null) {
            // Mostramos solo las que son de la campaña actual
            campaniaTabla = this.campaniaService.devolverCampaniaActiva(); 
        // Si se seleccionó una
        } else {
            campaniaTabla = this.campaniaService.findById(campaniaId);
        }

        // Buscamos todos los colaboradores de la campaña
        List <EntidadColaboradoraDTO> entidadesCampania = 
            this.entidadService.findAllById(campaniaTabla.getIdsColaboradores());

        model.addAttribute("entidadesSelec", entidadesCampania);
        model.addAttribute("campaniaSelec", campaniaTabla.getNombre());
        model.addAttribute("pagina", "inicio-entidades");
        return "inicio";
    }
}