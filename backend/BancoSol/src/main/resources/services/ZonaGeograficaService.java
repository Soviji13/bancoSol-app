package com.bancosol.services;

import com.bancosol.dao.ZonaGeograficaRepository;
import com.bancosol.dto.ZonaGeograficaDTO;
import com.bancosol.entities.ZonaGeografica;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ZonaGeograficaService {

    private final ZonaGeograficaRepository repo;

    public ZonaGeograficaService(ZonaGeograficaRepository repo) {
        this.repo = repo;
    }

    public List<ZonaGeograficaDTO> listarTodas() {
        return repo.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private ZonaGeograficaDTO toDTO(ZonaGeografica zg) {
        return ZonaGeograficaDTO.builder()
                .id(zg.getId())
                .nombre(zg.getNombre())
                .build();
    }
}