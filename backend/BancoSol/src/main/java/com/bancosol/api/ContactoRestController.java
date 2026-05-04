package com.bancosol.api;

import com.bancosol.dto.ContactoDTO;
import com.bancosol.services.ContactoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/contactos")
public class ContactoRestController {
    private final ContactoService service;
    public ContactoRestController(ContactoService service) { this.service = service; }
    @GetMapping
    public ResponseEntity<List<ContactoDTO>> getAll() { return ResponseEntity.ok(service.listarTodos()); }
}