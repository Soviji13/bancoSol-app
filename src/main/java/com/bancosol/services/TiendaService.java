package com.bancosol.services;

import com.bancosol.dao.TiendaRepository;
import com.bancosol.dto.CampaniaDTO;
import com.bancosol.dto.TiendaDTO;
import com.bancosol.mapper.TiendaMapper;


import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
@AllArgsConstructor // Sofía
public class TiendaService {

        // Integración Sofía para Backend (0% IA generativa) --------------
        private final TiendaRepository tiendaRepo;
        private final TiendaMapper tiendaMapper;

        public List <TiendaDTO> listarTodas () {
                return tiendaMapper.toDTOList(tiendaRepo.findAll());
        }

        public TiendaDTO findById (Long id) {
                return tiendaMapper.toDTO(tiendaRepo.findById(id).orElse(null));
        }

        // Devuelve todas las que se encuentren en el Array de Ids
        public List<TiendaDTO> findAllById(List<Long> ids) {
                return tiendaMapper.toDTOList(tiendaRepo.findAllById(ids));
        }

        
        // Fin integración Sofía ---------------------------------------------------

/*   Parte Fran Comentada
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
    */ 

}