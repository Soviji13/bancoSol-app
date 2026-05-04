package com.bancosol.api;

import com.bancosol.dto.ResponsableTiendaDTO;
import com.bancosol.services.ResponsableTiendaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/responsables-tiendas")
public class ResponsableTiendaRestController {
    private final ResponsableTiendaService service;
    public ResponsableTiendaRestController(ResponsableTiendaService service) { this.service = service; }
    @GetMapping
    public ResponseEntity<List<ResponsableTiendaDTO>> getAll() { return ResponseEntity.ok(service.listarTodos()); }
}
