package com.bancosol.api;

import com.bancosol.dto.ZonaGeograficaDTO;
import com.bancosol.services.ZonaGeograficaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/zonas-geograficas")
public class ZonaGeograficaRestController {

    private final ZonaGeograficaService service;

    public ZonaGeograficaRestController(ZonaGeograficaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<ZonaGeograficaDTO>> getAll() {
        return ResponseEntity.ok(service.listarTodas());
    }
}
