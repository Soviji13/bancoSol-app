// Creación Mapper básico para poder avanzar con entidad colaboradora
// Sofía Sí Villalba Jiménez (IA Generativa para casos específicos, mostrada en los comentarios)

package com.bancosol.mapper;

import org.springframework.stereotype.Component;

import com.bancosol.dto.LocalidadDTO;
import com.bancosol.entities.Localidad;



@Component
public class LocalidadMapper extends MapperDTO <LocalidadDTO, Localidad> {

    public LocalidadDTO toDTO (Localidad loc) {

        LocalidadDTO dto = new LocalidadDTO();

        dto.setId(loc.getId());
        dto.setNombre(loc.getNombre());

        dto.setZonaGeoId (
            loc.getZonaGeografica() != null ? 
                loc.getZonaGeografica().getId()
                : null
        );

        return dto;
    }
}