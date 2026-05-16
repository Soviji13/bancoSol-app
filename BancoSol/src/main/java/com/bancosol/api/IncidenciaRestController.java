package com.bancosol.api;

import com.bancosol.dto.IncidenciaDTO;
import com.bancosol.dto.IncidenciaFormDTO;
import com.bancosol.services.IncidenciaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidencias")
public class IncidenciaRestController {

    private final IncidenciaService service;

    public IncidenciaRestController(IncidenciaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<IncidenciaDTO>> getAll() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidenciaDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<IncidenciaDTO>> getByEstado(@PathVariable String estado) {
        return ResponseEntity.ok(service.buscarPorEstado(estado));
    }

    @GetMapping("/responsable-tienda/{id}")
    public ResponseEntity<List<IncidenciaDTO>> getByResponsableTienda(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorResponsableTienda(id));
    }

    @GetMapping("/responsable-entidad/{id}")
    public ResponseEntity<List<IncidenciaDTO>> getByResponsableEntidad(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorResponsableEntidad(id));
    }

    @PostMapping
    public ResponseEntity<IncidenciaDTO> create(@RequestBody IncidenciaFormDTO dto) {
        return ResponseEntity.ok(service.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncidenciaDTO> update(
            @PathVariable Long id,
            @RequestBody IncidenciaFormDTO dto
    ) {
        return ResponseEntity.ok(service.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}