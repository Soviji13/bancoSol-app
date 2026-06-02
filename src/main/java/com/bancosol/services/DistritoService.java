package com.bancosol.services;

import com.bancosol.dao.DistritoRepository;
import com.bancosol.dto.DistritoDTO;
import com.bancosol.mapper.DistritoMapper;

import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
@AllArgsConstructor
public class DistritoService {

    // Refactorización Sofía (0 IA) --------------------------------------

    private final DistritoRepository disRepo;
    private final DistritoMapper disMapper;

    public List <DistritoDTO> listarTodos () {
        return disMapper.toDTOList(disRepo.findAll());
    }

    public DistritoDTO findById (Long id) {
        return disMapper.toDTO(disRepo.findById(id).orElse(null));
    }

    // Devuelve todas las que se encuentren en el Array de Ids
    public List<DistritoDTO> findAllById(List<Long> ids) {
        return disMapper.toDTOList(disRepo.findAllById(ids));
    }

    // Final parte Sofía ------------------------------------------

    /* 
    private final DistritoRepository repo;
    public DistritoService(DistritoRepository repo) { this.repo = repo; }

    public List<DistritoDTO> listarTodos() {
        return repo.findAll().stream()
                .map(d -> DistritoDTO.builder().id(d.getId()).nombre(d.getNombre()).build())
                .collect(Collectors.toList());
    }
    */
}