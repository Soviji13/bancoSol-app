package com.bancosol.api;

import com.bancosol.dto.TiendaResponsableDTO;
import com.bancosol.services.TiendaResponsableService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tiendas-responsables")
public class TiendaResponsableRestController {
    private final TiendaResponsableService service;
    public TiendaResponsableRestController(TiendaResponsableService service) { this.service = service; }
    @GetMapping
    public ResponseEntity<List<TiendaResponsableDTO>> getAll() { return ResponseEntity.ok(service.listarTodos()); }
}