package com.bancosol.services;

import com.bancosol.dao.CodigoPostalRepository;
import com.bancosol.dto.CodigoPostalDTO;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CodigoPostalService {
    private final CodigoPostalRepository repo;
    public CodigoPostalService(CodigoPostalRepository repo) { this.repo = repo; }

    public List<CodigoPostalDTO> listarTodos() {
        return repo.findAll().stream()
                .map(cp -> CodigoPostalDTO.builder().id(cp.getId()).codigo(cp.getCodigo()).build())
                .collect(Collectors.toList());
    }
}
