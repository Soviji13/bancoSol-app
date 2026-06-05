// Creación Mapper básico para poder avanzar con entidad colaboradora
// Sofía Sí Villalba Jiménez (IA Generativa para casos específicos, mostrada en los comentarios)

package com.bancosol.mapper;

import org.springframework.stereotype.Component;

import com.bancosol.dto.DireccionDTO;
import com.bancosol.entities.Direccion;

@Component
public class DireccionMapper extends MapperDTO <DireccionDTO, Direccion> {

    public DireccionDTO toDTO (Direccion dir) {

        DireccionDTO dto = new DireccionDTO();

        dto.setId(dir.getId());
        dto.setCalle(dir.getCalle());
        dto.setNumero(dir.getNumero());
        dto.setDatosAdicionales(dir.getDatosAdicionales());
        dto.setEsCapital(dir.getEsCapital());
        
        dto.setLocalidadId (
            dir.getLocalidad() != null ? 
                dir.getLocalidad().getId()
                : null
        );

        dto.setCodigoPostalId (
            dir.getCodigoPostal() != null ? 
                dir.getCodigoPostal().getId()
                : null
        );

        dto.setDistritoId (
            dir.getDistrito() != null ? 
                dir.getDistrito().getId()
                : null
        );

        // Para mostrarse en la tabla (Refactorización Sofía 0% IA)
        dto.setZonaGeografica (
            dir.getLocalidad() != null && dir.getLocalidad().getZonaGeografica() != null ?
            dir.getLocalidad().getZonaGeografica().getNombre()
            : null
        );

        dto.setLocalidad (
            dir.getLocalidad() != null ?
            dir.getLocalidad().getNombre()
            : null
        );

        dto.setCodigoPostal (
            dir.getCodigoPostal() != null ?
            dir.getCodigoPostal().getCodigo()
            : null
        );

        return dto;
    }
}
