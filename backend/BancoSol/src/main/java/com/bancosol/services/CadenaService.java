package com.bancosol.services;

import com.bancosol.dao.CadenaRepository;
import com.bancosol.dto.CadenaDTO;
import com.bancosol.entities.Cadena;
import com.bancosol.entities.Campania;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CadenaService {

    private final CadenaRepository repo;

    public CadenaService(CadenaRepository repo) {
        this.repo = repo;
    }

    public List<CadenaDTO> listarTodas() {
        return repo.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CadenaDTO findById(Long id) {
        return repo.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    public List<CadenaDTO> findAllById(List<Long> ids) {
        return repo.findAllById(ids).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CadenaDTO convertToDTO(Cadena c) {
        return CadenaDTO.builder()
                .id(c.getId())
                .nombre(c.getNombre())
                .codigo(c.getCodigo())
                // REFACTORIZADO: Acceso directo a la lista de campanias (ManyToMany)
                .idsCampanias(c.getCampanias() == null ? List.of() :
                        c.getCampanias().stream()
                                .map(Campania::getId)
                                .collect(Collectors.toList()))
                .build();
    }
}