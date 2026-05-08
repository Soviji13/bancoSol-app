package com.bancosol.services;

import com.bancosol.dao.TurnoRepository;
import com.bancosol.dto.TurnoDTO;
import com.bancosol.entities.Turno;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TurnoService {
    private final TurnoRepository repo;
    public TurnoService(TurnoRepository repo) { this.repo = repo; }

    public List<TurnoDTO> listarTodos() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private TurnoDTO toDTO(Turno t) {
        return TurnoDTO.builder()
                .id(t.getId()).dia(t.getDia()).franjaHoraria(t.getFranjaHoraria())
                .campaniaId(t.getCampania().getId()).build();
    }
}