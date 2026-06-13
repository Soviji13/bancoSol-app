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

        ResponsableTiendaDTO dto = new ResponsableTiendaDTO();

        dto.setId(r.getId());
        dto.setNombre(r.getNombre());

        //comprobamos q tenga usuario y contacto para evitar nullpointers
        dto.setUsuarioId(r.getUsuario() != null ? r.getUsuario().getId() : null);
        dto.setContactoId(r.getContacto() != null ? r.getContacto().getId() : null);

        //id de su unica tienda, pasamos a usar Long directo en vez de lista!!!!
        dto.setIdTienda(tiendaAsociada != null ? tiendaAsociada.getId() : null);

        //sacamos campañas directamente de la lista de tienda asoci
        if (tiendaAsociada != null && tiendaAsociada.getCampanias() != null) {
            dto.setIdsCampanias(tiendaAsociada.getCampanias().stream()
                    .map(Campania::getId)
                    .distinct()
                    .collect(Collectors.toList()));
        } else {
            dto.setIdsCampanias(List.of()); //lista vacia
        }

        return dto;
    }
}