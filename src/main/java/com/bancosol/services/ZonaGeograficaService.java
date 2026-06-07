package com.bancosol.services;


import org.springframework.stereotype.Service;

import com.bancosol.dao.ZonaGeograficaRepository;
import com.bancosol.dto.ZonaGeograficaDTO;
import com.bancosol.entities.ZonaGeografica;
import com.bancosol.mapper.ZonaGeograficaMapper;

import lombok.AllArgsConstructor;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ZonaGeograficaService {

    // Refactorización Sofía Si Villalba Jiménez (0 IA)

    private final ZonaGeograficaRepository zonaRepo;
    private final ZonaGeograficaMapper zonaMapper;


    public List <ZonaGeograficaDTO> listarTodas () {
        return zonaMapper.toDTOList(zonaRepo.findAll());
    }

    public ZonaGeograficaDTO findById (Long id) {
        return zonaMapper.toDTO(zonaRepo.findById(id).orElse(null));
    }

    // Devuelve todas las que se encuentren en el Array de Ids
    public List<ZonaGeograficaDTO> findAllById(List<Long> ids) {
        return zonaMapper.toDTOList(zonaRepo.findAllById(ids));
    }

    // Devuelve solo la zona filtrada por el ID de la localidad
    // Ayuda de la IA para .isPresent() y .get()
    public ZonaGeograficaDTO findByLocalidad (Long localidadId) {

        Optional <ZonaGeografica> zona = zonaRepo.findByLocalidades_Id(localidadId);
        
        return (zona.isPresent() ? this.zonaMapper.toDTO(zona.get()) : null);
    }

    /* 
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
    */
}