package com.bancosol.api;

import com.bancosol.dto.CoordinadorDTO;
import com.bancosol.services.CoordinadorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/coordinadores")
public class CoordinadorRestController {
    private final CoordinadorService service;
    public CoordinadorRestController(CoordinadorService service) { this.service = service; }
    @GetMapping
    public ResponseEntity<List<CoordinadorDTO>> getAll() { return ResponseEntity.ok(service.listarTodos()); }
}