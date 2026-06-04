// Sofía Si Villalba Jiménez (IA generativa 0%)
// Ayuda de IA para saber cómo unificar JS con JSP sin necesidad de RestController

package com.bancosol.controllers;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bancosol.dto.CampaniaDTO;
import com.bancosol.dto.EntidadColaboradoraDTO;
import com.bancosol.services.CampaniaService;
import com.bancosol.services.EntidadColaboradoraService;

import java.util.List;



@Controller
@AllArgsConstructor
@RequestMapping("/entidades")
public class EntidadesController {

    private final CampaniaService campaniaService;
    private final EntidadColaboradoraService entidadService;

    // Relacionadas con la tabla --------------------------------------------------------------

    // Mostrar todas las entidades de una campaña (parámetro)
    // Si no se pasa una específicamente por parámetro, se muestran las de la activa
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

        // Buscamos todos los colaboradores de la campaña (nos devuelve sus tiendas respectivas)
        List <EntidadColaboradoraDTO> entidadesCampania = 
            this.entidadService.findAllByCampaniaId(campaniaTabla.getId());

        model.addAttribute("entidadesSelec", entidadesCampania);
        model.addAttribute("campaniaSelec", campaniaTabla);
        model.addAttribute("pagina", "inicio-entidades");
        return "inicio";
    }

    // Devolver las campañas (cuando se abra selector de campañas)
    // Con @ResponseBody devolvemos los datos en forma de JSON
    @GetMapping("/mostrar-campanias-json")
    @ResponseBody
    public List <CampaniaDTO> getCampanias () {
        return campaniaService.listarTodas();
    }
    

}