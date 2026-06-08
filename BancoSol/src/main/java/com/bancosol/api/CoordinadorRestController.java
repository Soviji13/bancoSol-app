package com.bancosol.api;

import com.bancosol.dto.CoordinadorDTO;
import com.bancosol.dto.CoordinadorFormDTO;
import com.bancosol.services.CoordinadorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.bancosol.dto.CoordinadorCompletoDTO;

import java.util.List;

@RestController
@RequestMapping("/api/coordinadores")
public class CoordinadorRestController {

    private final CoordinadorService service;

    public CoordinadorRestController(CoordinadorService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<CoordinadorDTO>> getAll() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CoordinadorDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<CoordinadorDTO> create(@RequestBody CoordinadorFormDTO dto) {
        return ResponseEntity.ok(service.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CoordinadorDTO> update(
            @PathVariable Long id,
            @RequestBody CoordinadorFormDTO dto
    ) {
        return ResponseEntity.ok(service.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/completo")
    public ResponseEntity<CoordinadorDTO> createCompleto(@RequestBody CoordinadorCompletoDTO dto) {
        return ResponseEntity.ok(service.crearCompleto(dto));
    }
}