package com.bancosol.services;

import com.bancosol.dao.CampaniaRepository;
import com.bancosol.dto.CampaniaDTO;
import com.bancosol.entities.Campania;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CampaniaService {
    private final CampaniaRepository repo;
    public CampaniaService(CampaniaRepository repo) { this.repo = repo; }

    public List<CampaniaDTO> listarTodas() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private CampaniaDTO toDTO(Campania c) {
        return CampaniaDTO.builder()
                .id(c.getId()).nombre(c.getNombre()).activa(c.getActiva())
                .fechaInicio(c.getFechaInicio()).fechaFin(c.getFechaFin()).anio(c.getAnio())
                .build();
    }
}