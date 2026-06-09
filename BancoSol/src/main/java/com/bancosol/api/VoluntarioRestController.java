package com.bancosol.api;

import com.bancosol.dto.VoluntarioCompletoDTO;
import com.bancosol.dto.VoluntarioNuevoDTO;
import com.bancosol.services.VoluntarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/voluntarios")
public class VoluntarioRestController {
    private final VoluntarioService service;

    public VoluntarioRestController(VoluntarioService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<VoluntarioCompletoDTO>> getAll(
            @RequestParam(required = false) Long campaniaId,
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) String entidad,
            @RequestParam(required = false) String responsable,
            @RequestParam(required = false) String tienda,
            @RequestParam(required = false) String franja,
            @RequestParam(required = false) String horaInicio,
            @RequestParam(required = false) String horaFin
    ) {
        // Quitamos el parche del 3L. Pasamos el ID tal cual llegue.
        return ResponseEntity.ok(service.listarFiltrados(
                campaniaId, id, entidad, responsable, tienda, franja, horaInicio, horaFin
        ));
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody VoluntarioNuevoDTO dto) {
        try {
            service.guardarVoluntario(dto);
            // Devolvemos un JSON real para que apiClient.js no de "Unexpected end of JSON input"
            return ResponseEntity.ok(Map.of("mensaje", "Voluntario creado correctamente"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Fallo en el backend: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody VoluntarioNuevoDTO dto) {
        try {
            service.actualizarVoluntario(id, dto);
            return ResponseEntity.ok(Map.of("mensaje", "Voluntario actualizado correctamente"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Fallo en el backend: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        service.eliminarVoluntario(id);
        return ResponseEntity.ok(Map.of("mensaje", "Voluntario eliminado"));
    }
}