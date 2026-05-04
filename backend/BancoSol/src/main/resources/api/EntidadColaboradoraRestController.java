package com.bancosol.api;

import com.bancosol.dto.EntidadColaboradoraDTO;
import com.bancosol.services.EntidadColaboradoraService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/entidades")
public class EntidadColaboradoraRestController {
    private final EntidadColaboradoraService service;
    public EntidadColaboradoraRestController(EntidadColaboradoraService service) { this.service = service; }
    @GetMapping
    public ResponseEntity<List<EntidadColaboradoraDTO>> getAll() { return ResponseEntity.ok(service.listarTodas()); }
}
