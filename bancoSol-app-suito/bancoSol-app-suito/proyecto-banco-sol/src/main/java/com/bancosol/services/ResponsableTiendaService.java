package com.bancosol.services;

import com.bancosol.dao.ResponsableTiendaRepository;
import com.bancosol.dto.ResponsableTiendaDTO;
import com.bancosol.entities.ResponsableTienda;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResponsableTiendaService {
    private final ResponsableTiendaRepository repo;
    public ResponsableTiendaService(ResponsableTiendaRepository repo) { this.repo = repo; }

    public List<ResponsableTiendaDTO> listarTodos() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private ResponsableTiendaDTO toDTO(ResponsableTienda rt) {
        return ResponsableTiendaDTO.builder()
                .id(rt.getId())
                .nombre(rt.getNombre())
                .usuarioId(rt.getUsuario().getId())
                .contactoId(rt.getContacto() != null ? rt.getContacto().getId() : null)
                .build();
    }
}