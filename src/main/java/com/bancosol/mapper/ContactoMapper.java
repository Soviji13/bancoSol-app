// Creación Mapper básico para poder avanzar con entidad colaboradora
// Sofía Sí Villalba Jiménez (IA Generativa 0%)

package com.bancosol.mapper;

import org.springframework.stereotype.Component;

import com.bancosol.dto.ContactoDTO;
import com.bancosol.entities.Contacto;

@Component
public class ContactoMapper extends MapperDTO <ContactoDTO, Contacto> {

    public ContactoDTO toDTO (Contacto c) {

        ContactoDTO dto = new ContactoDTO();

        dto.setId(c.getId());
        dto.setNombre(c.getNombre());
        dto.setEmail(c.getEmail());
        dto.setTelefono(c.getTelefono());

        return dto;
    }
}