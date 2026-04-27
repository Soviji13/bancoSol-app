package com.bancosol.api;

import com.bancosol.dto.ColaboradorCampaniaDTO;
import com.bancosol.services.ColaboradorCampaniaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/colaboradores-campanias")
public class ColaboradorCampaniaRestController {
    private final ColaboradorCampaniaService service;
    public ColaboradorCampaniaRestController(ColaboradorCampaniaService service) { this.service = service; }
    @GetMapping
    public ResponseEntity<List<ColaboradorCampaniaDTO>> getAll() { return ResponseEntity.ok(service.listarTodas()); }
}