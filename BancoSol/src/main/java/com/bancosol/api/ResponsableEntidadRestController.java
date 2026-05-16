package com.bancosol.api;

import com.bancosol.dto.ResponsableEntidadDTO;
import com.bancosol.services.ResponsableEntidadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/responsables-entidades")
public class ResponsableEntidadRestController {
    private final ResponsableEntidadService service;
    public ResponsableEntidadRestController(ResponsableEntidadService service) { this.service = service; }
    @GetMapping
    public ResponseEntity<List<ResponsableEntidadDTO>> getAll() { return ResponseEntity.ok(service.listarTodos()); }
}
