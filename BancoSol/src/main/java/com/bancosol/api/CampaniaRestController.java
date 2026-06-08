package com.bancosol.api;

import com.bancosol.dto.CampaniaDTO;
import com.bancosol.services.CampaniaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/campanias")
public class CampaniaRestController {
    private final CampaniaService service;
    public CampaniaRestController(CampaniaService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<List<CampaniaDTO>> getAll() {
        return ResponseEntity.ok(service.listarTodas());
    }
}