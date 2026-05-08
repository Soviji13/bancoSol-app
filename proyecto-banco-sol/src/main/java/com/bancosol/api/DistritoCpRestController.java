package com.bancosol.api;

import com.bancosol.dto.DistritoCpDTO;
import com.bancosol.services.DistritoCpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/distritos-cp")
public class DistritoCpRestController {
    private final DistritoCpService service;
    public DistritoCpRestController(DistritoCpService service) { this.service = service; }
    @GetMapping
    public ResponseEntity<List<DistritoCpDTO>> getAll() { return ResponseEntity.ok(service.listarTodos()); }
}
