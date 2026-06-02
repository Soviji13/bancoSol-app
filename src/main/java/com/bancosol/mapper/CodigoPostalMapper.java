// Creación Mapper básico para poder avanzar con entidad colaboradora
// Sofía Sí Villalba Jiménez (IA Generativa para casos específicos, mostrada en los comentarios)

package com.bancosol.mapper;

import org.springframework.stereotype.Component;

import com.bancosol.dto.CodigoPostalDTO;
import com.bancosol.entities.CodigoPostal;

@Component
public class CodigoPostalMapper extends MapperDTO <CodigoPostalDTO, CodigoPostal> {

    public CodigoPostalDTO toDTO (CodigoPostal cp) {

        CodigoPostalDTO dto = new CodigoPostalDTO();

        dto.setId(cp.getId());
        dto.setCodigo(cp.getCodigo());

        return dto;
    }
}