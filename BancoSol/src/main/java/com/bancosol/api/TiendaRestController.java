package com.bancosol.api;

import com.bancosol.dto.TiendaDTO;
import com.bancosol.dto.TiendaNuevaDTO;
import com.bancosol.services.TiendaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tiendas")
public class TiendaRestController {

    private final TiendaService service;

    public TiendaRestController(TiendaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<TiendaDTO>> getAll(
            @RequestParam(required = false) Long campaniaId,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) Long cadenaId,
            @RequestParam(required = false) Long localidadId,
            @RequestParam(required = false) Long distritoId,
            @RequestParam(required = false) Long zonaGeoId,
            @RequestParam(required = false) Long colaboradorId,
            @RequestParam(required = false) Long responsableTiendaId,
            @RequestParam(required = false) Boolean participaActiva,
            @RequestParam(required = false) Boolean esFranquicia) {

        return ResponseEntity.ok(service.filtrarTiendas(campaniaId, nombre, cadenaId, localidadId,
                distritoId, zonaGeoId, colaboradorId, responsableTiendaId, participaActiva, esFranquicia));
    }

    @PostMapping
    public ResponseEntity<TiendaDTO> crear(@RequestBody TiendaNuevaDTO dto) {
        return ResponseEntity.ok(service.crearTienda(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TiendaDTO> actualizar(@PathVariable Long id, @RequestBody TiendaDTO dto) {
        return ResponseEntity.ok(service.actualizarTienda(id, dto));
    }

    @DeleteMapping
    public ResponseEntity<Void> eliminarMultiples(@RequestBody List<Long> ids) {
        service.eliminarTiendas(ids);
        return ResponseEntity.ok().build();
    }
}