package com.bancosol.api;

import com.bancosol.dto.CodigoPostalDTO;
import com.bancosol.services.CodigoPostalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/codigos-postales")
public class CodigoPostalRestController {
    private final CodigoPostalService service;
    public CodigoPostalRestController(CodigoPostalService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<List<CodigoPostalDTO>> getAll() {
        return ResponseEntity.ok(service.listarTodos());
    }
}