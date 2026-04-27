package com.bancosol.services;

import com.bancosol.dao.IncidenciaRepository;
import com.bancosol.dto.IncidenciaDTO;
import com.bancosol.entities.Incidencia;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class IncidenciaService {
    private final IncidenciaRepository repo;
    public IncidenciaService(IncidenciaRepository repo) { this.repo = repo; }

    public List<IncidenciaDTO> listarTodas() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private IncidenciaDTO toDTO(Incidencia i) {
        return IncidenciaDTO.builder()
                .id(i.getId()).fechaHora(i.getFechaHora()).asunto(i.getAsunto())
                .descripcion(i.getDescripcion()).estado(i.getEstado())
                .responsableTiendaId(i.getResponsableTienda() != null ? i.getResponsableTienda().getId() : null)
                .responsableEntidadId(i.getResponsableEntidad() != null ? i.getResponsableEntidad().getId() : null)
                .build();
    }
}