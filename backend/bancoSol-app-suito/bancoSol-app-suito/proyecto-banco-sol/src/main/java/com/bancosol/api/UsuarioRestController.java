package com.bancosol.api;

import com.bancosol.dto.UsuarioDTO;
import com.bancosol.services.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioRestController {
    private final UsuarioService service;
    public UsuarioRestController(UsuarioService service) { this.service = service; }
    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> getAll() { return ResponseEntity.ok(service.listarTodos()); }
}
