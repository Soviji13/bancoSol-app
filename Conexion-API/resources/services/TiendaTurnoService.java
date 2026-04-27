package com.bancosol.services;

import com.bancosol.dao.TiendaTurnoRepository;
import com.bancosol.dto.TiendaTurnoDTO;
import com.bancosol.entities.TiendaTurno;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TiendaTurnoService {
    private final TiendaTurnoRepository repo;
    public TiendaTurnoService(TiendaTurnoRepository repo) { this.repo = repo; }

    public List<TiendaTurnoDTO> listarTodos() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private TiendaTurnoDTO toDTO(TiendaTurno tt) {
        return TiendaTurnoDTO.builder()
                .id(tt.getId()).tiendaId(tt.getTienda().getId())
                .voluntarioId(tt.getVoluntario().getId())
                .turnoId(tt.getTurno() != null ? tt.getTurno().getId() : null)
                .build();
    }
}