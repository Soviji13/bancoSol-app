// Creación Mapper básico para poder avanzar con entidad colaboradora
// Sofía Sí Villalba Jiménez (IA Generativa para casos específicos, mostrada en los comentarios)

package com.bancosol.mapper;

import java.util.stream.Collectors;
import java.util.List;

import org.springframework.stereotype.Component;

import com.bancosol.dto.DistritoDTO;
import com.bancosol.entities.CodigoPostal;
import com.bancosol.entities.Distrito;

@Component
public class DistritoMapper extends MapperDTO <DistritoDTO, Distrito> {

    public DistritoDTO toDTO (Distrito dis) {

        DistritoDTO dto = new DistritoDTO();

        dto.setId(dis.getId());
        dto.setNombre(dis.getNombre());

        dto.setCodigosIds (
            dis.getCodigosPostales() != null ?
                dis.getCodigosPostales().stream()
                    .map(CodigoPostal::getId)
                    .collect(Collectors.toList())
                : List.of()
        );

        return dto;
    }
}