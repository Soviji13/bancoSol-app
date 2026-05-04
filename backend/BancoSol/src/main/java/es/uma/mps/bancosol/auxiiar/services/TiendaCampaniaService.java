package com.bancosol.services;

import com.bancosol.dao.TiendaCampaniaRepository;
import com.bancosol.dto.TiendaCampaniaDTO;
import com.bancosol.entities.TiendaCampania;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TiendaCampaniaService {
    private final TiendaCampaniaRepository repo;
    public TiendaCampaniaService(TiendaCampaniaRepository repo) { this.repo = repo; }

    public List<TiendaCampaniaDTO> listarTodas() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private TiendaCampaniaDTO toDTO(TiendaCampania tc) {
        return TiendaCampaniaDTO.builder()
                .id(tc.getId()).tiendaId(tc.getTienda().getId())
                .campaniaId(tc.getCampania().getId()).build();
    }
}