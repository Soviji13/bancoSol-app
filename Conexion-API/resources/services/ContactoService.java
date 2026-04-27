package com.bancosol.services;

import com.bancosol.dao.ContactoRepository;
import com.bancosol.dto.ContactoDTO;
import com.bancosol.entities.Contacto;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContactoService {
    private final ContactoRepository repo;
    public ContactoService(ContactoRepository repo) { this.repo = repo; }

    public List<ContactoDTO> listarTodos() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private ContactoDTO toDTO(Contacto c) {
        return ContactoDTO.builder()
                .id(c.getId()).nombre(c.getNombre()).email(c.getEmail()).telefono(c.getTelefono())
                .build();
    }
}