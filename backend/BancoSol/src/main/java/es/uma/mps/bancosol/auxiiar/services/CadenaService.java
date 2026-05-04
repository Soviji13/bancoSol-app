package com.bancosol.services;

import com.bancosol.dao.CadenaRepository;
import com.bancosol.dto.CadenaDTO;
import com.bancosol.entities.Cadena;
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

    private CadenaDTO convertToDTO(Cadena c) {
        return CadenaDTO.builder()
                .id(c.getId())
                .nombre(c.getNombre())
                .codigo(c.getCodigo())
                .build();
    }
}