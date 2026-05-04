package com.bancosol.api;

import com.bancosol.dto.IncidenciaDTO;
import com.bancosol.services.IncidenciaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/incidencias")
public class IncidenciaRestController {
    private final IncidenciaService service;
    public IncidenciaRestController(IncidenciaService service) { this.service = service; }
    @GetMapping
    public ResponseEntity<List<IncidenciaDTO>> getAll() { return ResponseEntity.ok(service.listarTodas()); }
}