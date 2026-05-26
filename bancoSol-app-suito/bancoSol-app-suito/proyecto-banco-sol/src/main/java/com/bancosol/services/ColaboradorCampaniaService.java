package com.bancosol.services;

import com.bancosol.dao.ColaboradorCampaniaRepository;
import com.bancosol.dto.ColaboradorCampaniaDTO;
import com.bancosol.entities.ColaboradorCampania;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ColaboradorCampaniaService {
    private final ColaboradorCampaniaRepository repo;
    public ColaboradorCampaniaService(ColaboradorCampaniaRepository repo) { this.repo = repo; }

    public List<ColaboradorCampaniaDTO> listarTodas() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private ColaboradorCampaniaDTO toDTO(ColaboradorCampania c) {
        return ColaboradorCampaniaDTO.builder()
                .id(c.getId()).entidadId(c.getEntidad().getId()).campaniaId(c.getCampania().getId())
                .participa(c.getParticipa()).observaciones(c.getObservaciones())
                .createdAt(c.getCreatedAt()).build();
    }
}