package com.bancosol.services;

import com.bancosol.dao.TiendaRepository;
import com.bancosol.dto.TiendaDTO;
import com.bancosol.entities.Tienda;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TiendaService {
    private final TiendaRepository repo;
    public TiendaService(TiendaRepository repo) { this.repo = repo; }

    public List<TiendaDTO> listarTodas() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private TiendaDTO toDTO(Tienda t) {
        return TiendaDTO.builder()
                .id(t.getId()).nombre(t.getNombre())
                .puntosRecogida(t.getPuntosRecogida()).esFranquicia(t.getEsFranquicia())
                .cadenaId(t.getCadena().getId()).direccionId(t.getDireccion().getId())
                .build();
    }
}