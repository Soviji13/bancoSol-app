package com.bancosol.services;

import com.bancosol.dao.CampaniaCadenaRepository;
import com.bancosol.dto.CampaniaCadenaDTO;
import com.bancosol.entities.CampaniaCadena;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CampaniaCadenaService {
    private final CampaniaCadenaRepository repo;
    public CampaniaCadenaService(CampaniaCadenaRepository repo) { this.repo = repo; }

    public List<CampaniaCadenaDTO> listarTodas() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private CampaniaCadenaDTO toDTO(CampaniaCadena c) {
        return CampaniaCadenaDTO.builder()
                .id(c.getId()).participa(c.getParticipa()).cadenaId(c.getCadena().getId())
                .campaniaId(c.getCampania().getId()).build();
    }
}