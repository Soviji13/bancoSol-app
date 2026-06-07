// Creación Mapper básico para poder avanzar con entidad colaboradora
// Sofía Sí Villalba Jiménez (IA Generativa 0%)

package com.bancosol.mapper;

import java.util.stream.Collectors;
import java.util.List;

import org.springframework.stereotype.Component;

import com.bancosol.dto.ZonaGeograficaDTO;

import com.bancosol.entities.ZonaGeografica;
import com.bancosol.entities.Localidad;

@Component
public class ZonaGeograficaMapper extends MapperDTO <ZonaGeograficaDTO, ZonaGeografica> {

    public ZonaGeograficaDTO toDTO (ZonaGeografica z) {

        ZonaGeograficaDTO dto = new ZonaGeograficaDTO();

        dto.setId(z.getId());
        dto.setNombre(z.getNombre());

        dto.setIdsLocalidades(
            z.getLocalidades() != null ?
            z.getLocalidades().stream()
                .map(Localidad::getId)
                .collect(Collectors.toList()) 
            : List.of()
        );

        return dto;
    }
}