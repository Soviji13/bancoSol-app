// Creación Mapper básico para poder avanzar con entidad colaboradora
// Sofía Sí Villalba Jiménez (IA Generativa 0%)

package com.bancosol.mapper;

import com.bancosol.dto.TiendaDTO;
import com.bancosol.entities.Tienda;

public class TiendaMapper {

    public TiendaDTO toDTO (Tienda tienda) {

        // Sofía
        TiendaDTO dto = new TiendaDTO();

        dto.setId(tienda.getId());
        dto.setNombre(tienda.getNombre());

        // Fin sofía

        return dto;
    }
}
