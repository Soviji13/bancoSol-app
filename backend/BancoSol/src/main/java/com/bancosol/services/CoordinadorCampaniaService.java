package com.bancosol.services;

import com.bancosol.dao.CoordinadorCampaniaRepository;
import com.bancosol.dto.CoordinadorCampaniaDTO;
import com.bancosol.entities.CoordinadorCampania;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CoordinadorCampaniaService {
    private final CoordinadorCampaniaRepository repo;
    public CoordinadorCampaniaService(CoordinadorCampaniaRepository repo) { this.repo = repo; }

    public List<CoordinadorCampaniaDTO> listarTodas() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private CoordinadorCampaniaDTO toDTO(CoordinadorCampania c) {
        return CoordinadorCampaniaDTO.builder()
                .id(c.getId())
                .coordinadorId(c.getCoordinador().getId())
                .campaniaId(c.getCampania().getId())
                .build();
    }
}