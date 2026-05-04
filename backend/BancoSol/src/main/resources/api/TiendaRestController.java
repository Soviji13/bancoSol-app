package com.bancosol.api;

import com.bancosol.dto.TiendaDTO;
import com.bancosol.services.TiendaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tiendas")
public class TiendaRestController {
    private final TiendaService service;
    public TiendaRestController(TiendaService service) { this.service = service; }
    @GetMapping
    public ResponseEntity<List<TiendaDTO>> getAll() { return ResponseEntity.ok(service.listarTodas()); }
}