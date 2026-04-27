package com.bancosol.services;

import com.bancosol.dao.TiendaColaboradorRepository;
import com.bancosol.dto.TiendaColaboradorDTO;
import com.bancosol.entities.TiendaColaborador;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TiendaColaboradorService {
    private final TiendaColaboradorRepository repo;
    public TiendaColaboradorService(TiendaColaboradorRepository repo) { this.repo = repo; }

    public List<TiendaColaboradorDTO> listarTodas() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private TiendaColaboradorDTO toDTO(TiendaColaborador tc) {
        return TiendaColaboradorDTO.builder()
                .id(tc.getId()).tiendaId(tc.getTienda().getId())
                .colaboradorId(tc.getColaborador().getId()).campaniaId(tc.getCampania().getId())
                .build();
    }
}