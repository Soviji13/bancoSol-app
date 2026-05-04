package com.bancosol.services;

import com.bancosol.dao.DireccionRepository;
import com.bancosol.dto.DireccionDTO;
import com.bancosol.entities.Direccion;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DireccionService {
    private final DireccionRepository repo;
    public DireccionService(DireccionRepository repo) { this.repo = repo; }

    public List<DireccionDTO> listarTodas() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private DireccionDTO toDTO(Direccion d) {
        return DireccionDTO.builder()
                .id(d.getId())
                .calle(d.getCalle())
                .numero(d.getNumero())
                .datosAdicionales(d.getDatosAdicionales())
                .esCapital(d.getEsCapital())
                .localidadId(d.getLocalidad() != null ? d.getLocalidad().getId() : null)
                .codigoPostalId(d.getCodigoPostal() != null ? d.getCodigoPostal().getId() : null)
                .distritoId(d.getDistrito() != null ? d.getDistrito().getId() : null)
                .build();
    }
}