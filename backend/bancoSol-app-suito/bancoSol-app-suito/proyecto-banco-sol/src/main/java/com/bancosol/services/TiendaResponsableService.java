package com.bancosol.services;

import com.bancosol.dao.TiendaResponsableRepository;
import com.bancosol.dto.TiendaResponsableDTO;
import com.bancosol.entities.TiendaResponsable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TiendaResponsableService {
    private final TiendaResponsableRepository repo;
    public TiendaResponsableService(TiendaResponsableRepository repo) { this.repo = repo; }

    public List<TiendaResponsableDTO> listarTodos() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private TiendaResponsableDTO toDTO(TiendaResponsable tr) {
        return TiendaResponsableDTO.builder()
                .id(tr.getId()).tiendaId(tr.getTienda().getId())
                .responsableEntidadId(tr.getResponsableEntidad().getId()).campaniaId(tr.getCampania().getId())
                .build();
    }
}