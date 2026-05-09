package com.bancosol.services;

import com.bancosol.dao.CampaniaRepository;
import com.bancosol.dto.CampaniaDTO;
import com.bancosol.entities.*;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CampaniaService {
    private final CampaniaRepository repo;
    public CampaniaService(CampaniaRepository repo) { this.repo = repo; }

    public List<CampaniaDTO> listarTodas() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private CampaniaDTO toDTO(Campania c) {
        return CampaniaDTO.builder()
                .id(c.getId())
                .nombre(c.getNombre())
                .activa(c.getActiva())
                .fechaInicio(c.getFechaInicio())
                .fechaFin(c.getFechaFin())
                .anio(c.getAnio())

                // 1. IDs de Cadenas (Relación directa ManyToMany)
                .idsCadenas(c.getCadenas() == null ? List.of() :
                        c.getCadenas().stream()
                                .map(Cadena::getId)
                                .collect(Collectors.toList()))

                // 2. IDs de Tiendas (Relación directa ManyToMany)
                .idsTiendas(c.getTiendas() == null ? List.of() :
                        c.getTiendas().stream()
                                .map(Tienda::getId)
                                .collect(Collectors.toList()))

                // 3. IDs de Colaboradores (Relación directa ManyToMany)
                .idsColaboradores(c.getColaboradores() == null ? List.of() :
                        c.getColaboradores().stream()
                                .map(EntidadColaboradora::getId)
                                .collect(Collectors.toList()))

                // 4. IDs de Coordinadores (Relación directa ManyToMany)
                .idsCoordinadores(c.getCoordinadores() == null ? List.of() :
                        c.getCoordinadores().stream()
                                .map(Coordinador::getId)
                                .collect(Collectors.toList()))

                // 5. IDs de Responsables
                .idsResponsables(c.getResponsables() == null ? List.of() :
                        c.getResponsables().stream()
                                .map(ResponsableTienda::getId)
                                .collect(Collectors.toList()))
                .build();
    }
}