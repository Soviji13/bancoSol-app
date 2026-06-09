package com.bancosol.api;

import com.bancosol.dto.UsuarioDTO;
import com.bancosol.dto.UserLoginDTO;
import com.bancosol.services.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioRestController {
    private final UsuarioService service;

    public UsuarioRestController(UsuarioService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> getAll() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @PostMapping("/verificar")
    public ResponseEntity<?> verificarUsuario(
            @RequestBody UserLoginDTO datosUser) {

        try {
            UsuarioDTO resp = this.service.verificar(datosUser);
            return ResponseEntity.ok(resp);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }

    }

}
