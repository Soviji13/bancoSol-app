package com.bancosol.api;

import com.bancosol.dto.TiendaCampaniaDTO;
import com.bancosol.services.TiendaCampaniaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tiendas-campanias")
public class TiendaCampaniaRestController {
    private final TiendaCampaniaService service;
    public TiendaCampaniaRestController(TiendaCampaniaService service) { this.service = service; }
    @GetMapping
    public ResponseEntity<List<TiendaCampaniaDTO>> getAll() { return ResponseEntity.ok(service.listarTodas()); }
}
