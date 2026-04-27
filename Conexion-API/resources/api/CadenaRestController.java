package com.bancosol.api;

import com.bancosol.dto.CadenaDTO;
import com.bancosol.services.CadenaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cadenas") // Ruta exclusiva para el Front
public class CadenaRestController {

    private final CadenaService service;

    public CadenaRestController(CadenaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<CadenaDTO>> getCadenas() {
        return ResponseEntity.ok(service.listarTodas());
    }
}
