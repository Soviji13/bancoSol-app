package com.bancosol.api;

import com.bancosol.dto.LocalidadDTO;
import com.bancosol.services.LocalidadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/localidades")
public class LocalidadRestController {
    private final LocalidadService service;
    public LocalidadRestController(LocalidadService service) { this.service = service; }
    @GetMapping
    public ResponseEntity<List<LocalidadDTO>> getAll() { return ResponseEntity.ok(service.listarTodas()); }
}
