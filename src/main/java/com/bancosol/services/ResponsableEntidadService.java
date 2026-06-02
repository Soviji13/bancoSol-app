package com.bancosol.services;

import com.bancosol.dao.ResponsableEntidadRepository;
import com.bancosol.dto.ResponsableEntidadDTO;
import com.bancosol.mapper.ResponsableEntidadMapper;

import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ResponsableEntidadService {

    // Refactorización de Sofía (0 IA)

    private final ResponsableEntidadRepository responsableRepo;
    private final ResponsableEntidadMapper responsableMapper;

    public List <ResponsableEntidadDTO> listarTodos () {
        return responsableMapper.toDTOList(responsableRepo.findAll());
    }

    public ResponsableEntidadDTO findById (Long id) {
        return responsableMapper.toDTO(responsableRepo.findById(id).orElse(null));
    }

    // Devuelve todas las que se encuentren en el Array de Ids
    public List<ResponsableEntidadDTO> findAllById(List<Long> ids) {
        return responsableMapper.toDTOList(responsableRepo.findAllById(ids));
    }

    // Final parte Sofía
    
    /* 
    private final ResponsableEntidadRepository repo;

    public ResponsableEntidadService(ResponsableEntidadRepository repo) {
        this.repo = repo;
    }

    public List<ResponsableEntidadDTO> listarTodos() {
        return repo.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private ResponsableEntidadDTO toDTO(ResponsableEntidad re) {
        Contacto contacto = re.getContacto();

        return ResponsableEntidadDTO.builder()
                .id(re.getId())
                .esContactoPrincipal(re.getEsContactoPrincipal())

                .entidadId(re.getColaborador() != null ? re.getColaborador().getId() : null)
                .usuarioId(re.getUsuario() != null ? re.getUsuario().getId() : null)
                .contactoId(contacto != null ? contacto.getId() : null)

                .nombreContacto(contacto != null ? contacto.getNombre() : "")
                .emailContacto(contacto != null ? contacto.getEmail() : "")
                .telefonoContacto(contacto != null ? contacto.getTelefono() : "")

                .build();
    }
    */
}