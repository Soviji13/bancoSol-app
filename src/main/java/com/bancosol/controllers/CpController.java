// Sofía Si Villalba Jiménez (IA generativa 0%)

package com.bancosol.controllers;

import com.bancosol.services.CodigoPostalService;
import com.bancosol.services.DistritoService;
import com.bancosol.services.LocalidadService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

import com.bancosol.dto.CodigoPostalDTO;
import com.bancosol.dto.DistritoDTO;

@Controller
@AllArgsConstructor
@RequestMapping("/cps")
public class CpController {

    // Para devolver todas las zonas
    private final CodigoPostalService codigoPostalService;
    private final DistritoService distritoService;

    @GetMapping("/devolver-json")
    @ResponseBody
    public List <CodigoPostalDTO> devolverCodigosJson (
        @RequestParam (value = "idDistrito", required = false) Long idDistrito
    ) {
        if (idDistrito != null) {
            // Obtenemos el distrito
            DistritoDTO d = this.distritoService.findById(idDistrito);
            // Devolvemos sus códigos postales
            return (this.codigoPostalService.findAllById(d.getCodigosIds()));
        }

        return this.codigoPostalService.findSinDistrito();
    }
    
}