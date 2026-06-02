// Creación Mapper básico para poder avanzar con entidad colaboradora
// Sofía Sí Villalba Jiménez (IA Generativa 0%)

package com.bancosol.mapper;

import org.springframework.stereotype.Component;

import com.bancosol.dto.TiendaDTO;
import com.bancosol.entities.Tienda;

@Component
public class TiendaMapper extends MapperDTO <TiendaDTO, Tienda> {

    public TiendaDTO toDTO (Tienda tienda) {

        // Sofía
        TiendaDTO dto = new TiendaDTO();

        dto.setId(tienda.getId());
        dto.setNombre(tienda.getNombre());

        // Fin sofía

        return dto;
    }
}
