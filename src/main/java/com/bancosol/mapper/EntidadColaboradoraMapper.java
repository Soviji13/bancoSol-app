// Creación Mapper básico para poder avanzar con entidad colaboradora
// Sofía Sí Villalba Jiménez (IA Generativa para casos específicos, mostrada en los comentarios)

package com.bancosol.mapper;

import java.util.stream.Collectors;
import java.util.List;

import org.springframework.stereotype.Component;

import com.bancosol.dto.EntidadColaboradoraDTO;
import com.bancosol.entities.EntidadColaboradora;
import com.bancosol.entities.ResponsableEntidad;
import com.bancosol.entities.Tienda;


@Component
public class EntidadColaboradoraMapper extends MapperDTO <EntidadColaboradoraDTO, EntidadColaboradora> {

    public EntidadColaboradoraDTO toDTO (EntidadColaboradora entidad) {

        EntidadColaboradoraDTO dto = new EntidadColaboradoraDTO();

        dto.setId(entidad.getId());
        dto.setNombre(entidad.getNombre());
        dto.setEstadoActivo(entidad.getEstadoActivo());
        dto.setObservaciones(entidad.getObservaciones());
        
        // Ayuda de la IA generativa para saber asignar IDs de tiendas
        dto.setIdsTiendas (
            entidad.getTiendas() != null ? 
            entidad.getTiendas().stream()
                .map(Tienda::getId)
                .collect(Collectors.toList()) 
            : List.of()
        );
        // Fin IA

        dto.setIdsResponsables (
            entidad.getResponsables() != null ? 
            entidad.getResponsables().stream()
                .map(ResponsableEntidad::getId)
                .collect(Collectors.toList())
            : List.of()
        );

        dto.setDireccionId (
            entidad.getDireccion() != null ?
            entidad.getDireccion().getId()
            : null 
        );

        dto.setCoordinadorId (
            entidad.getCoordinador() != null ?
            entidad.getCoordinador().getId()
            : null
        );

        return dto;
    }
}
