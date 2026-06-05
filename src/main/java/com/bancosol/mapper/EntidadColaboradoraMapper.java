// Creación Mapper básico para poder avanzar con entidad colaboradora
// Sofía Sí Villalba Jiménez (IA Generativa para casos específicos, mostrada en los comentarios)

package com.bancosol.mapper;

import java.util.stream.Collectors;
import java.util.List;

import org.springframework.stereotype.Component;

import com.bancosol.dao.ResponsableEntidadRepository;
import com.bancosol.dto.EntidadColaboradoraDTO;
import com.bancosol.entities.EntidadColaboradora;
import com.bancosol.entities.ResponsableEntidad;

import lombok.AllArgsConstructor;

import com.bancosol.entities.Campania;


@Component
@AllArgsConstructor
public class EntidadColaboradoraMapper extends MapperDTO <EntidadColaboradoraDTO, EntidadColaboradora> {

    private final ResponsableEntidadMapper responsableEntidadMapper;
    private final DireccionMapper direccionMapper;

    private final ResponsableEntidadRepository responsableEntidadRepository;

    public EntidadColaboradoraDTO toDTO (EntidadColaboradora entidad) {

        EntidadColaboradoraDTO dto = new EntidadColaboradoraDTO();

        dto.setId(entidad.getId());
        dto.setNombre(entidad.getNombre());
        dto.setEstadoActivo(entidad.getEstadoActivo());
        dto.setObservaciones(entidad.getObservaciones());
        
        // Ayuda de la IA generativa para saber asignar IDs de tiendas
        /* Ya no me es necesario
        dto.setIdsTiendas (
            entidad.getTiendas() != null ? 
            entidad.getTiendas().stream()
                .map(Tienda::getId)
                .collect(Collectors.toList()) 
            : List.of()
        );
        */
        // Fin IA

        dto.setIdsResponsables (
            entidad.getResponsables() != null ? 
            entidad.getResponsables().stream()
                .map(ResponsableEntidad::getId)
                .collect(Collectors.toList())
            : List.of()
        );

        dto.setIdsCampanias (
            entidad.getCampanias() != null ?
            entidad.getCampanias().stream()
            .map(Campania::getId)
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

        // Datos directos para poder mostrarlos por tabla sin realizar demasiadas consultas
        // ni sin tener que acceder a la entidad directamente

        /* 
        dto.setDomicilio (
            entidad.getDireccion() != null ? 
            entidad.getDireccion().getCalle() + ", " + entidad.getDireccion().getNumero()
            : "-"
        );
        */

        dto.setContactoPrincipal (
            entidad.getResponsables() != null ?
            this.responsableEntidadMapper.toDTO(
                this.responsableEntidadRepository
                .findPrincipalByEntidadId(entidad.getId()) 
            )
            : null
        );

        dto.setDireccion (
            entidad.getDireccion() != null ?
            this.direccionMapper.toDTO(entidad.getDireccion())
            : null
        );

        dto.setResponsablesEntidad (
            entidad.getResponsables() != null && entidad.getResponsables().size() > 0 ?
            this.responsableEntidadMapper.toDTOList(entidad.getResponsables())
            : null
        );

        return dto;
    }
}
