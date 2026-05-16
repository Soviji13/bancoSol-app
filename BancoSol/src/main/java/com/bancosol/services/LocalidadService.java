package com.bancosol.services;

import com.bancosol.dao.LocalidadRepository;
import com.bancosol.dto.LocalidadDTO;
import com.bancosol.entities.Localidad;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LocalidadService {
    private final LocalidadRepository repo;
    public LocalidadService(LocalidadRepository repo) { this.repo = repo; }

    public List<LocalidadDTO> listarTodas() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private LocalidadDTO toDTO(Localidad l) {
        return LocalidadDTO.builder()
                .id(l.getId())
                .nombre(l.getNombre())
                .zonaGeoId(l.getZonaGeografica() != null ? l.getZonaGeografica().getId() : null)
                .build();
    }
}