package com.bancosol.api;

import com.bancosol.dto.CampaniaDTO;
import com.bancosol.dto.CampaniaFormDTO;
import com.bancosol.services.CampaniaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campanias")
public class CampaniaRestController {

    private final CampaniaService service;

    public CampaniaRestController(CampaniaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<CampaniaDTO>> getAll() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampaniaDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<CampaniaDTO> crear(@RequestBody CampaniaFormDTO form) {
        return ResponseEntity.ok(service.crear(form));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CampaniaDTO> actualizar(
            @PathVariable Long id,
            @RequestBody CampaniaFormDTO form
    ) {
        return ResponseEntity.ok(service.actualizar(id, form));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/cadenas")
    public ResponseEntity<CampaniaDTO> actualizarCadenas(
            @PathVariable Long id,
            @RequestBody List<Long> idsCadenas
    ) {
        return ResponseEntity.ok(service.actualizarCadenas(id, idsCadenas));
    }

    @PutMapping("/{id}/coordinadores")
    public ResponseEntity<CampaniaDTO> actualizarCoordinadores(
            @PathVariable Long id,
            @RequestBody List<Long> idsCoordinadores
    ) {
        return ResponseEntity.ok(service.actualizarCoordinadores(id, idsCoordinadores));
    }
}