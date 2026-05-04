package com.bancosol.services;

import com.bancosol.dao.DistritoCpRepository;
import com.bancosol.dto.DistritoCpDTO;
import com.bancosol.entities.DistritoCp;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DistritoCpService {
    private final DistritoCpRepository repo;
    public DistritoCpService(DistritoCpRepository repo) { this.repo = repo; }

    public List<DistritoCpDTO> listarTodos() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private DistritoCpDTO toDTO(DistritoCp d) {
        return DistritoCpDTO.builder()
                .id(d.getId())
                .distritoId(d.getDistrito().getId())
                .cpId(d.getCodigoPostal().getId())
                .build();
    }
}