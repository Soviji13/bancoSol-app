//francisco javier garcia sierra 0% ia

package com.bancosol.mapper;

import com.bancosol.dto.ResponsableTiendaDTO;
import com.bancosol.entities.Campania;
import com.bancosol.entities.ResponsableTienda;
import com.bancosol.entities.Tienda;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ResponsableTiendaMapper extends MapperDTO<ResponsableTiendaDTO, ResponsableTienda> {

    @Override
    public ResponsableTiendaDTO toDTO(ResponsableTienda r) {
        Tienda tiendaAsociada = r.getTienda();

        return ResponsableTiendaDTO.builder()
                .id(r.getId())
                .nombre(r.getNombre())
                .usuarioId(r.getUsuario() != null ? r.getUsuario().getId() : null)
                .contactoId(r.getContacto() != null ? r.getContacto().getId() : null)

                //envolvemos el ID de su única tienda en una lista para no romper tu DTO
                .idsTiendas(tiendaAsociada != null ? List.of(tiendaAsociada.getId()) : List.of())

                //sacamos las campañas directamente desde su tienda asociada
                .idsCampanias((tiendaAsociada != null && tiendaAsociada.getCampanias() != null) ?
                        tiendaAsociada.getCampanias().stream()
                                .map(Campania::getId)
                                .distinct()
                                .collect(Collectors.toList()) : List.of())
                .build();
    }
}