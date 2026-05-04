package com.bancosol.services;

import com.bancosol.dao.VoluntarioRepository;
import com.bancosol.dto.VoluntarioDTO;
import com.bancosol.entities.Voluntario;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VoluntarioService {
    private final VoluntarioRepository repo;
    public VoluntarioService(VoluntarioRepository repo) { this.repo = repo; }

    public List<VoluntarioDTO> listarTodos() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private VoluntarioDTO toDTO(Voluntario v) {
        return VoluntarioDTO.builder()
                .id(v.getId()).observaciones(v.getObservaciones())
                .horasSueltas(v.getHorasSueltas()).horaComienzo(v.getHoraComienzo())
                .horaFinal(v.getHoraFinal()).responsableId(v.getResponsable().getId())
                .build();
    }
}