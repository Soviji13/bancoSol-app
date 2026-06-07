// Sofía Si Villalba Jiménez (IA generativa 0%)

package com.bancosol.controllers;

import com.bancosol.services.LocalidadService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

import com.bancosol.dto.LocalidadDTO;

@Controller
@AllArgsConstructor
@RequestMapping("/localidades")
public class LocalidadController {

    // Para devolver todas las zonas
    private final LocalidadService localidadService;

    @GetMapping("/devolver-json")
    @ResponseBody
    public List <LocalidadDTO> devolverLocalidadesJson (
        @RequestParam (value = "idZona", required = false) Long idZona
    ) {
        if (idZona != null) {
            return this.localidadService.findByZonaGeo(idZona);
        }

        return this.localidadService.listarTodas();
    }
    
}