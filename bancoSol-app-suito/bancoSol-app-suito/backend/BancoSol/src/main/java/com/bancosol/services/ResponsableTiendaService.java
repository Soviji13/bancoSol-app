package com.bancosol.services;

import com.bancosol.dao.ResponsableTiendaRepository;
import com.bancosol.dto.ResponsableTiendaDTO;
import com.bancosol.entities.Campania;
import com.bancosol.entities.ResponsableTienda;
import com.bancosol.entities.Tienda;
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

    private ResponsableTiendaDTO toDTO(ResponsableTienda r) {
        return ResponsableTiendaDTO.builder()
                .id(r.getId())
                .nombre(r.getNombre())
                .usuarioId(r.getUsuario() != null ? r.getUsuario().getId() : null)
                .contactoId(r.getContacto() != null ? r.getContacto().getId() : null)

                // 1. IDs de Tiendas (Relación directa ManyToMany refactorizada)
                .idsTiendas(r.getTiendas() == null ? List.of() :
                        r.getTiendas().stream()
                                .map(Tienda::getId)
                                .distinct()
                                .collect(Collectors.toList()))

                .idsCampanias(r.getCampanias() == null ? List.of() :
                        r.getCampanias().stream()
                                .map(Campania::getId)
                                .distinct()
                                .collect(Collectors.toList()))
                .build();
    }
}