package com.bancosol.api;

import com.bancosol.dto.TiendaTurnoDTO;
import com.bancosol.services.TiendaTurnoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tiendas-turnos")
public class TiendaTurnoRestController {
    private final TiendaTurnoService service;
    public TiendaTurnoRestController(TiendaTurnoService service) { this.service = service; }
    @GetMapping
    public ResponseEntity<List<TiendaTurnoDTO>> getAll() { return ResponseEntity.ok(service.listarTodos()); }
}