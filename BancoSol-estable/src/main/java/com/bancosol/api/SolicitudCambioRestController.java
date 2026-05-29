package com.bancosol.api;

import com.bancosol.dto.SolicitudCambioDTO;
import com.bancosol.services.SolicitudCambioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudCambioRestController {
    private final SolicitudCambioService service;
    public SolicitudCambioRestController(SolicitudCambioService service) { this.service = service; }
    @GetMapping
    public ResponseEntity<List<SolicitudCambioDTO>> getAll() { return ResponseEntity.ok(service.listarTodas()); }
}
