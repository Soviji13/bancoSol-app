package com.bancosol.services;

import com.bancosol.dao.CodigoPostalRepository;
import com.bancosol.dto.CodigoPostalDTO;
import com.bancosol.mapper.CodigoPostalMapper;

import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
@AllArgsConstructor
public class CodigoPostalService {

    // Refactorización Sofía (0 IA) --------------------------------------

    private final CodigoPostalRepository cpRepo;
    private final CodigoPostalMapper cpMapper;

    public List <CodigoPostalDTO> listarTodas () {
        return cpMapper.toDTOList(cpRepo.findAll());
    }

    public CodigoPostalDTO findById (Long id) {
        return cpMapper.toDTO(cpRepo.findById(id).orElse(null));
    }

    // Devuelve todas las que se encuentren en el Array de Ids
    public List<CodigoPostalDTO> findAllById(List<Long> ids) {
        return cpMapper.toDTOList(cpRepo.findAllById(ids));
    }

    // Devuelve todos los que no tengan distrito
    public List <CodigoPostalDTO> findSinDistrito () {
        return cpMapper.toDTOList(cpRepo.findCpsSinDistrito());
    }

    // Devuelve todos los que no pertenecen a un distrito

    // Final parte Sofía ------------------------------------------

    /* 
    private final CodigoPostalRepository repo;
    public CodigoPostalService(CodigoPostalRepository repo) { this.repo = repo; }

    public List<CodigoPostalDTO> listarTodos() {
        return repo.findAll().stream()
                .map(cp -> CodigoPostalDTO.builder().id(cp.getId()).codigo(cp.getCodigo()).build())
                .collect(Collectors.toList());
    }
    */
}
