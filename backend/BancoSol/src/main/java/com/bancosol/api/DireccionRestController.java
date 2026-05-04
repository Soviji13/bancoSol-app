package com.bancosol.api;

import com.bancosol.dto.DireccionDTO;
import com.bancosol.services.DireccionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/direcciones")
public class DireccionRestController {
    private final DireccionService service;
    public DireccionRestController(DireccionService service) { this.service = service; }
    @GetMapping
    public ResponseEntity<List<DireccionDTO>> getAll() { return ResponseEntity.ok(service.listarTodas()); }
}