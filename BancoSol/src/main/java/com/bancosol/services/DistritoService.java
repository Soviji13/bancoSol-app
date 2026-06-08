package com.bancosol.services;

import com.bancosol.dao.DistritoRepository;
import com.bancosol.dto.DistritoDTO;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DistritoService {
    private final DistritoRepository repo;
    public DistritoService(DistritoRepository repo) { this.repo = repo; }

    public List<DistritoDTO> listarTodos() {
        return repo.findAll().stream()
                .map(d -> DistritoDTO.builder().id(d.getId()).nombre(d.getNombre()).build())
                .collect(Collectors.toList());
    }
}