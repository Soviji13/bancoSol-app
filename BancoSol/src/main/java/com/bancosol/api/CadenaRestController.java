package com.bancosol.api;

import com.bancosol.dto.CadenaDTO;
import com.bancosol.dto.CadenaFormDTO;
import com.bancosol.services.CadenaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cadenas")
public class CadenaRestController {

    private final CadenaService cadenaService;

    public CadenaRestController(CadenaService cadenaService) {
        this.cadenaService = cadenaService;
    }

    @GetMapping
    public ResponseEntity<List<CadenaDTO>> listar() {
        return ResponseEntity.ok(cadenaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CadenaDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(cadenaService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<CadenaDTO> crear(@RequestBody CadenaFormDTO form) {
        return ResponseEntity.ok(cadenaService.crear(form));
    }
}