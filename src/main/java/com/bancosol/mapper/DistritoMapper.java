// Creación Mapper básico para poder avanzar con entidad colaboradora
// Sofía Sí Villalba Jiménez (IA Generativa para casos específicos, mostrada en los comentarios)

package com.bancosol.mapper;

import org.springframework.stereotype.Component;

import com.bancosol.dto.DireccionDTO;
import com.bancosol.dto.DistritoDTO;
import com.bancosol.entities.Direccion;
import com.bancosol.entities.Distrito;

@Component
public class DistritoMapper extends MapperDTO <DistritoDTO, Distrito> {

    public DistritoDTO toDTO (Distrito dis) {

        DistritoDTO dto = new DistritoDTO();

        dto.setId(dis.getId());

        return dto;
    }
}