package com.bancosol.services;

import com.bancosol.dao.ResponsableEntidadRepository;
import com.bancosol.dto.ResponsableEntidadDTO;
import com.bancosol.entities.Contacto;
import com.bancosol.entities.ResponsableEntidad;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResponsableEntidadService {

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
}