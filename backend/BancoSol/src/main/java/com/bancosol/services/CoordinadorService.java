package com.bancosol.services;

import com.bancosol.dao.CoordinadorRepository;
import com.bancosol.dto.CoordinadorDTO;
import com.bancosol.entities.Campania;
import com.bancosol.entities.Coordinador;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CoordinadorService {

    private final CoordinadorRepository repo;

    public CoordinadorService(CoordinadorRepository repo) {
        this.repo = repo;
    }

    public List<CoordinadorDTO> listarTodos() {
        return repo.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }


    public CoordinadorDTO findById(Long id) {
        return repo.findById(id)
                .map(this::toDTO)
                .orElse(null);
    }

    public List<CoordinadorDTO> findAllById(List<Long> ids) {
        return repo.findAllById(ids).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private CoordinadorDTO toDTO(Coordinador c) {
        return CoordinadorDTO.builder()
                .id(c.getId())
                .area(c.getArea())
                .tiendas(c.getTiendas())
                .permisoModificar(c.getPermisoModificar())
                .usuarioId(c.getUsuario() != null ? c.getUsuario().getId() : null)
                .contactoId(c.getContacto() != null ? c.getContacto().getId() : null)
                .idsCampanias(c.getCampanias() == null ? List.of() :
                        c.getCampanias().stream()
                                .map(Campania::getId)
                                .collect(Collectors.toList()))
                .build();
    }
}