package com.bancosol.services;

import com.bancosol.dao.LocalidadRepository;
import com.bancosol.dto.LocalidadDTO;
import com.bancosol.mapper.LocalidadMapper;

import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
@AllArgsConstructor
public class LocalidadService {

    // Refactorización Sofía (0 IA) --------------------------------------

    private final LocalidadRepository locRepo;
    private final LocalidadMapper locMapper;

    public List <LocalidadDTO> listarTodas () {
        return locMapper.toDTOList(locRepo.findAll());
    }

    public LocalidadDTO findById (Long id) {
        return locMapper.toDTO(locRepo.findById(id).orElse(null));
    }

    // Devuelve todas las que se encuentren en el Array de Ids
    public List<LocalidadDTO> findAllById(List<Long> ids) {
        return locMapper.toDTOList(locRepo.findAllById(ids));
    }

    // Devuelve las localidades según la zona geográfica
    public List <LocalidadDTO> findByZonaGeo (Long idZona) {
        return locMapper.toDTOList(locRepo.findByZonaGeografica_Id(idZona));
    }

    // Final parte Sofía ------------------------------------------

    /* 
    private final LocalidadRepository repo;
    public LocalidadService(LocalidadRepository repo) { this.repo = repo; }

    public List<LocalidadDTO> listarTodas() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private LocalidadDTO toDTO(Localidad l) {
        return LocalidadDTO.builder()
                .id(l.getId())
                .nombre(l.getNombre())
                .zonaGeoId(l.getZonaGeografica() != null ? l.getZonaGeografica().getId() : null)
                .build();
    }
    */
}