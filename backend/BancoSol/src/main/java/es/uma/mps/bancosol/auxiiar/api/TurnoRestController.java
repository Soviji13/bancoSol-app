package com.bancosol.api;

import com.bancosol.dto.TurnoDTO;
import com.bancosol.services.TurnoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/turnos")
public class TurnoRestController {
    private final TurnoService service;
    public TurnoRestController(TurnoService service) { this.service = service; }
    @GetMapping
    public ResponseEntity<List<TurnoDTO>> getAll() { return ResponseEntity.ok(service.listarTodos()); }
}
