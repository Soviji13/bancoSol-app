package com.bancosol.services;

import com.bancosol.dao.TiendaRepository;
import com.bancosol.dto.TiendaDTO;
import com.bancosol.entities.Campania;
import com.bancosol.entities.EntidadColaboradora;
import com.bancosol.entities.ResponsableTienda;
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
                .id(t.getId())
                .nombre(t.getNombre())
                .puntosRecogida(t.getPuntosRecogida())
                .esFranquicia(t.getEsFranquicia())
                //.cadenaId(t.getCadena() != null ? t.getCadena().getId() : null)
                .direccionId(t.getDireccion() != null ? t.getDireccion().getId() : null)

                // 1. IDs de Campañas (Directo ManyToMany)
                .idsCampanias(t.getCampanias() == null ? List.of() :
                        t.getCampanias().stream()
                                .map(Campania::getId)
                                .collect(Collectors.toList()))

                // 2. IDs de Entidades Colaboradoras (Directo ManyToMany)
                .idsEntidades(t.getColaboradores() == null ? List.of() :
                        t.getColaboradores().stream()
                                .map(EntidadColaboradora::getId)
                                .collect(Collectors.toList()))

                // 3. IDs de Responsables (Directo ManyToMany)
                .idsResponsables(t.getResponsables() == null ? List.of() :
                        t.getResponsables().stream()
                                .map(ResponsableTienda::getId)
                                .collect(Collectors.toList()))

                .build();
    }
}