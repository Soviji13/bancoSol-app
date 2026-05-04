package com.bancosol.api;

import com.bancosol.dto.DistritoDTO;
import com.bancosol.services.DistritoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/distritos")
public class DistritoRestController {
    private final DistritoService service;
    public DistritoRestController(DistritoService service) { this.service = service; }
    @GetMapping
    public ResponseEntity<List<DistritoDTO>> getAll() { return ResponseEntity.ok(service.listarTodos()); }
}