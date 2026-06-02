package com.bancosol.services;

import com.bancosol.dao.DireccionRepository;
import com.bancosol.dto.DireccionDTO;
import com.bancosol.mapper.DireccionMapper;

import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
@AllArgsConstructor
public class DireccionService {

    // Refactorización Sofía (0 IA) --------------------------------------

    private final DireccionRepository dirRepo;
    private final DireccionMapper dirMapper;

    public List <DireccionDTO> listarTodos () {
        return dirMapper.toDTOList(dirRepo.findAll());
    }

    public DireccionDTO findById (Long id) {
        return dirMapper.toDTO(dirRepo.findById(id).orElse(null));
    }

    // Devuelve todas las que se encuentren en el Array de Ids
    public List<DireccionDTO> findAllById(List<Long> ids) {
        return dirMapper.toDTOList(dirRepo.findAllById(ids));
    }

    // Final parte Sofía ------------------------------------------


    /* 
    private final DireccionRepository repo;
    public DireccionService(DireccionRepository repo) { this.repo = repo; }

    public List<DireccionDTO> listarTodas() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private DireccionDTO toDTO(Direccion d) {
        return DireccionDTO.builder()
                .id(d.getId())
                .calle(d.getCalle())
                .numero(d.getNumero())
                .datosAdicionales(d.getDatosAdicionales())
                .esCapital(d.getEsCapital())
                .localidadId(d.getLocalidad() != null ? d.getLocalidad().getId() : null)
                .codigoPostalId(d.getCodigoPostal() != null ? d.getCodigoPostal().getId() : null)
                .distritoId(d.getDistrito() != null ? d.getDistrito().getId() : null)
                .build();
    }
    */
}