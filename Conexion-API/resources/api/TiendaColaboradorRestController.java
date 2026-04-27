package com.bancosol.api;

import com.bancosol.dto.TiendaColaboradorDTO;
import com.bancosol.services.TiendaColaboradorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tiendas-colaboradores")
public class TiendaColaboradorRestController {
    private final TiendaColaboradorService service;
    public TiendaColaboradorRestController(TiendaColaboradorService service) { this.service = service; }
    @GetMapping
    public ResponseEntity<List<TiendaColaboradorDTO>> getAll() { return ResponseEntity.ok(service.listarTodas()); }
}