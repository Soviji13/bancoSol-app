package es.uma.mps.bancosol.controller;

import es.uma.mps.bancosol.dao.campaniaRepository;
import es.uma.mps.bancosol.entity.Campania;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@org.springframework.stereotype.Controller
public class Controller {

    @Autowired
    private campaniaRepository campanias;

    @GetMapping("/")
    public String doInit (Model model) {
        List<Campania> camp = campanias.findAll();
        model.addAttribute("campanias", camp);
        return "listar";
    }

}