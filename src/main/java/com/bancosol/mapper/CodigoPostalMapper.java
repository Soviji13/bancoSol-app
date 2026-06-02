// Creación Mapper básico para poder avanzar con entidad colaboradora
// Sofía Sí Villalba Jiménez (IA Generativa para casos específicos, mostrada en los comentarios)

package com.bancosol.mapper;

import java.util.stream.Collectors;
import java.util.List;

import org.springframework.stereotype.Component;

import com.bancosol.entities.Distrito;
import com.bancosol.dto.CodigoPostalDTO;
import com.bancosol.entities.CodigoPostal;

@Component
public class CodigoPostalMapper extends MapperDTO <CodigoPostalDTO, CodigoPostal> {

    public CodigoPostalDTO toDTO (CodigoPostal cp) {

        CodigoPostalDTO dto = new CodigoPostalDTO();

        dto.setId(cp.getId());
        dto.setCodigo(cp.getCodigo());

        dto.setDistritosIds (
            cp.getDistritos() != null ?
                cp.getDistritos().stream()
                    .map(Distrito::getId)
                    .collect(Collectors.toList())
                : List.of()
        );

        return dto;
    }
}