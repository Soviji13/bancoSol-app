package com.bancosol.api;

import com.bancosol.dto.CampaniaCadenaDTO;
import com.bancosol.services.CampaniaCadenaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/campanias-cadenas")
public class CampaniaCadenaRestController {

    private final CampaniaCadenaService service;

    public CampaniaCadenaRestController(CampaniaCadenaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<CampaniaCadenaDTO>> getAll() {
        return ResponseEntity.ok(service.listarTodas());
    }
}