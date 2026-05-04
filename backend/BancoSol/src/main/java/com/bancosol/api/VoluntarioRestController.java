package com.bancosol.api;

import com.bancosol.dto.VoluntarioDTO;
import com.bancosol.services.VoluntarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/voluntarios")
public class VoluntarioRestController {
    private final VoluntarioService service;
    public VoluntarioRestController(VoluntarioService service) { this.service = service; }
    @GetMapping
    public ResponseEntity<List<VoluntarioDTO>> getAll() { return ResponseEntity.ok(service.listarTodos()); }
}
