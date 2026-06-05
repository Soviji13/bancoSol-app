// Creación Mapper básico para poder avanzar con entidad colaboradora
// Sofía Sí Villalba Jiménez (IA Generativa 0%)

package com.bancosol.mapper;

import org.springframework.stereotype.Component;

import com.bancosol.dto.ResponsableEntidadDTO;
import com.bancosol.entities.ResponsableEntidad;

import lombok.AllArgsConstructor;



@Component
@AllArgsConstructor
public class ResponsableEntidadMapper extends MapperDTO <ResponsableEntidadDTO, ResponsableEntidad> {

    private ContactoMapper contactoMapper;

    public ResponsableEntidadDTO toDTO (ResponsableEntidad responsable) {

        ResponsableEntidadDTO dto = new ResponsableEntidadDTO();

        dto.setId(responsable.getId());
        dto.setEsContactoPrincipal(responsable.getEsContactoPrincipal());

        dto.setUsuarioId (
            responsable.getUsuario() != null ? 
            responsable.getUsuario().getId()
            : null
        );

        // Datos aplanados para acceder más fácilmente

        dto.setContacto (
            responsable.getContacto() != null ?
            this.contactoMapper.toDTO(responsable.getContacto())
            : null
        );

        return dto;
    }
}