package com.bancosol.api;

import com.bancosol.dto.VoluntarioCompletoDTO;
import com.bancosol.services.VoluntarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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
        // Si no mandan campaña, le asignamos la 3 (Gran Recogida Mock) por defecto para q nunca falle
        Long campId = campaniaId != null ? campaniaId : 3L;

        return ResponseEntity.ok(service.listarFiltrados(
                campId, id, entidad, responsable, tienda, franja, horaInicio, horaFin
        ));
    }
}