// Sofía Si Villalba Jiménez (IA generativa 0%)

package com.bancosol.controllers;

import com.bancosol.services.ZonaGeograficaService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

import com.bancosol.dto.ZonaGeograficaDTO;;

@Controller
@AllArgsConstructor
@RequestMapping("/zonas")
public class ZonasController {

    // Para devolver todas las zonas
    private final ZonaGeograficaService zonaGeograficaService;

    @GetMapping("/devolver-json")
    @ResponseBody
    public List <ZonaGeograficaDTO> devolverZonasJson (
        @RequestParam (value = "idLocalidad", required = false) Long idLocalidad
    ) {
        if (idLocalidad != null) {
            ZonaGeograficaDTO zona = this.zonaGeograficaService.findByLocalidad(idLocalidad);

            return zona != null ? List.of(zona) : List.of();
        }

        return this.zonaGeograficaService.listarTodas();
    }
    
}