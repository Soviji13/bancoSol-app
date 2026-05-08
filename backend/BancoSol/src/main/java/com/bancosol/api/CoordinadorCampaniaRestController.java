package com.bancosol.api;

import com.bancosol.dto.CoordinadorCampaniaDTO;
import com.bancosol.services.CoordinadorCampaniaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/coordinadores-campanias")
public class CoordinadorCampaniaRestController {
    private final CoordinadorCampaniaService service;
    public CoordinadorCampaniaRestController(CoordinadorCampaniaService service) { this.service = service; }
    @GetMapping
    public ResponseEntity<List<CoordinadorCampaniaDTO>> getAll() { return ResponseEntity.ok(service.listarTodas()); }
}