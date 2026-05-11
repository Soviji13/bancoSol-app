package com.bancosol.controllers;

import com.bancosol.dto.CampaniaDTO;
import com.bancosol.services.CadenaService;
import com.bancosol.services.CampaniaService;
import com.bancosol.services.CoordinadorService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigInteger;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Controller
public class CampaniaController {

    private final CampaniaService campaniaService;
    private final CadenaService cadenaService;
    private final CoordinadorService coordinadorService;

    public CampaniaController(CampaniaService campaniaService, CadenaService cadenaService, CoordinadorService coordinadorService) {
        this.campaniaService = campaniaService;
        this.cadenaService = cadenaService;
        this.coordinadorService = coordinadorService;
    }


    @GetMapping("/campanias")
    public String verCampania(Model model, HttpSession session) {
        List<CampaniaDTO> campaniasOrdenadas = campaniaService.listarTodas().stream()

                .sorted(Comparator.comparing(CampaniaDTO::getFechaInicio).reversed())
                .collect(Collectors.toList());

        model.addAttribute("campanias", campaniasOrdenadas);
        model.addAttribute("usuario", session);
        return "campanias";
    }

    @GetMapping("/campania/gestion")
    public String verGestionCampania(@RequestParam("id") Long id,HttpSession session ,Model model) {
        CampaniaDTO campania = campaniaService.findById(id);
        if (campania == null) {
            return "redirect:/campania";
        }else{
            model.addAttribute("cadenas", cadenaService.listarTodas());
            model.addAttribute("coordinadores", coordinadorService.findAllById(campania.getIdsCoordinadores()));
            model.addAttribute("campania", campania);
            model.addAttribute("usuario", session);
            return "gestion-campanias";
        }

    }
}
