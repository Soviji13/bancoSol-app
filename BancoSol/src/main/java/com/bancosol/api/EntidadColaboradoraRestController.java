package com.bancosol.api;

import com.bancosol.dto.ActualizarEntidadColaboradoraDTO;
import com.bancosol.dto.EntidadColaboradoraDTO;
import com.bancosol.services.EntidadColaboradoraService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.bancosol.dto.RegistroEntidadColaboradoraDTO;
import java.util.List;

@RestController
@RequestMapping("/api/entidades")
public class EntidadColaboradoraRestController {
    private final EntidadColaboradoraService service;
    public EntidadColaboradoraRestController(EntidadColaboradoraService service) { this.service = service; }
    @GetMapping
    public ResponseEntity<List<EntidadColaboradoraDTO>> getAll() { return ResponseEntity.ok(service.listarTodas()); }

    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody RegistroEntidadColaboradoraDTO dto) {
        try {
            service.registrarEntidadCompleta(dto);
            return ResponseEntity.ok().body("{\"mensaje\": \"Entidad creada correctamente\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            service.eliminarEntidadCompleta(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            // Imprime el error real en la consola de Java
            e.printStackTrace();
            // Envía el mensaje real al Frontend para que lo veamos en el alert
            return ResponseEntity.status(500).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody ActualizarEntidadColaboradoraDTO dto) {
        try {
            service.actualizarEntidadCompleta(id, dto);
            return ResponseEntity.ok().body("{\"message\": \"Entidad actualizada con éxito\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
