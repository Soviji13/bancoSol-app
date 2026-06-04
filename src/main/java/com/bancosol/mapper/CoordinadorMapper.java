package com.bancosol.mapper;

import com.bancosol.dto.CoordinadorDTO;
import com.bancosol.entities.Campania;
import com.bancosol.entities.Contacto;
import com.bancosol.entities.Coordinador;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CoordinadorMapper extends MapperDTO<CoordinadorDTO, Coordinador> {

    @Override
    public CoordinadorDTO toDTO(Coordinador coordinador) {
        if (coordinador == null) {
            return null;
        }

        Contacto contacto = coordinador.getContacto();

        return CoordinadorDTO.builder()
                .id(coordinador.getId())
                .nombre(contacto != null ? contacto.getNombre() : null)
                .email(contacto != null ? contacto.getEmail() : null)
                .telefono(contacto != null ? contacto.getTelefono() : null)
                .area(coordinador.getArea())
                .tiendas(coordinador.getTiendas())
                .permisoModificar(coordinador.getPermisoModificar())
                .usuarioId(coordinador.getUsuario() != null ? coordinador.getUsuario().getId() : null)
                .contactoId(contacto != null ? contacto.getId() : null)
                .entidadId(null)
                .idsCampanias(extraerIdsCampanias(coordinador))
                .nombresCampanias(extraerNombresCampanias(coordinador))
                .build();
    }

    public Coordinador toEntity(CoordinadorDTO dto) {
        if (dto == null) {
            return null;
        }

        Coordinador coordinador = new Coordinador();

        coordinador.setId(dto.getId());
        coordinador.setArea(dto.getArea());
        coordinador.setTiendas(dto.getTiendas());
        coordinador.setPermisoModificar(dto.getPermisoModificar());

        return coordinador;
    }

    private List<Long> extraerIdsCampanias(Coordinador coordinador) {
        if (coordinador.getCampanias() == null) {
            return List.of();
        }

        return coordinador.getCampanias()
                .stream()
                .map(Campania::getId)
                .filter(id -> id != null)
                .toList();
    }

    private List<String> extraerNombresCampanias(Coordinador coordinador) {
        if (coordinador.getCampanias() == null) {
            return List.of();
        }

        return coordinador.getCampanias()
                .stream()
                .map(Campania::getNombre)
                .filter(nombre -> nombre != null && !nombre.isBlank())
                .toList();
    }
}