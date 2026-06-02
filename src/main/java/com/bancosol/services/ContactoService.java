package com.bancosol.services;

import com.bancosol.dao.ContactoRepository;
import com.bancosol.dto.ContactoDTO;
import com.bancosol.mapper.ContactoMapper;


import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
@AllArgsConstructor
public class ContactoService {

    // Refactorización Sofía (0 IA) --------------------------------------

    private final ContactoRepository contactoRepo;
    private final ContactoMapper contactoMapper;

    public List <ContactoDTO> listarTodos () {
        return contactoMapper.toDTOList(contactoRepo.findAll());
    }

    public ContactoDTO findById (Long id) {
        return contactoMapper.toDTO(contactoRepo.findById(id).orElse(null));
    }

    // Devuelve todas las que se encuentren en el Array de Ids
    public List<ContactoDTO> findAllById(List<Long> ids) {
        return contactoMapper.toDTOList(contactoRepo.findAllById(ids));
    }

    // Final parte Sofía ------------------------------------------
    
    /* 
    private final ContactoRepository repo;
    public ContactoService(ContactoRepository repo) { this.repo = repo; }

    public List<ContactoDTO> listarTodos() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private ContactoDTO toDTO(Contacto c) {
        return ContactoDTO.builder()
                .id(c.getId())

                // Datos básicos
                .nombre(c.getNombre())
                .email(c.getEmail())
                .telefono(c.getTelefono())
                .idsEntidades(c.getResponsableEntidad() == null ? List.of() :
                        c.getResponsableEntidad().stream()
                                .map(rel -> rel.getColaborador().getId())
                                .distinct()
                                .collect(Collectors.toList()))
                .build();

    }
    */
}