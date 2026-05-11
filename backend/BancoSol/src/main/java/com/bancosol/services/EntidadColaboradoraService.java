package com.bancosol.services;

import com.bancosol.dao.EntidadColaboradoraRepository;
import com.bancosol.dto.EntidadColaboradoraDTO;
import com.bancosol.entities.EntidadColaboradora;
import com.bancosol.entities.Tienda;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class EntidadColaboradoraService {
    private final EntidadColaboradoraRepository repo;
    public EntidadColaboradoraService(EntidadColaboradoraRepository repo) { this.repo = repo; }

    public List<EntidadColaboradoraDTO> listarTodas() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private EntidadColaboradoraDTO toDTO(EntidadColaboradora e) {
        return EntidadColaboradoraDTO.builder()
                .id(e.getId())
                .nombre(e.getNombre())
                .estadoActivo(e.getEstadoActivo())
                .observaciones(e.getObservaciones())
                .numTiendas(e.getNumTiendas())
                .numTurnos(e.getNumTurnos())
                .numVoluntarios(e.getNumVoluntarios())
                .coordinadorId(e.getCoordinador() != null ? e.getCoordinador().getId() : null)
                .direccionId(e.getDireccion() != null ? e.getDireccion().getId() : null)

                // 1. IDs de Tiendas (Relación directa ManyToMany refactorizada)
                .idsTiendas(e.getTiendas() == null ? List.of() :
                        e.getTiendas().stream()
                                .map(Tienda::getId)
                                .collect(Collectors.toList()))

                // 2. IDs de Contactos (Responsables)
                // Si borraste ResponsableEntidad, aquí mapeas la relación directa que hayas dejado
                .idsContactos(List.of()) // Ajustar según la nueva relación directa en la Entity

                .build();
    }
}