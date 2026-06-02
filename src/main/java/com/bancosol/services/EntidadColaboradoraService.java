package com.bancosol.services;

import com.bancosol.dao.EntidadColaboradoraRepository;
import com.bancosol.dto.EntidadColaboradoraDTO;
import com.bancosol.mapper.EntidadColaboradoraMapper;


import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
@AllArgsConstructor
public class EntidadColaboradoraService {

    // Refactorización de Sofía (0 IA)

    private final EntidadColaboradoraRepository entidadRepo;
    private final EntidadColaboradoraMapper entidadMapper;

    public List <EntidadColaboradoraDTO> listarTodas () {
        return entidadMapper.toDTOList(entidadRepo.findAll());
    }

    public EntidadColaboradoraDTO findById (Long id) {
        return entidadMapper.toDTO(entidadRepo.findById(id).orElse(null));
    }

    // Devuelve todas las que se encuentren en el Array de Ids
    public List<EntidadColaboradoraDTO> findAllById(List<Long> ids) {
        return entidadMapper.toDTOList(entidadRepo.findAllById(ids));
    }

    // Final parte Sofía

    /* 
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
    */
}