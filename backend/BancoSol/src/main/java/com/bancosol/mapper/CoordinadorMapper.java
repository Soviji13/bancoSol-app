package com.bancosol.mapper;

import com.bancosol.dto.CoordinadorDTO;
import com.bancosol.entities.Campania;
import com.bancosol.entities.Coordinador;
import com.bancosol.entities.EntidadColaboradora;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CoordinadorMapper extends MapperDTO<CoordinadorDTO, Coordinador> {
    public CoordinadorDTO toDTO(Coordinador c) {
        return CoordinadorDTO.builder()
                .id(c.getId())
                .area(c.getArea())
                .tiendas(c.getTiendas())
                .permisoModificar(c.getPermisoModificar())

                .usuarioId(c.getUsuario() != null ? c.getUsuario().getId() : null)
                .contactoId(c.getContacto() != null ? c.getContacto().getId() : null)

                .nombreContacto(c.getContacto() != null ? c.getContacto().getNombre() : null)
                .emailContacto(c.getContacto() != null ? c.getContacto().getEmail() : null)
                .telefonoContacto(c.getContacto() != null ? c.getContacto().getTelefono() : null)

                .idsCampanias(c.getCampanias() == null ? List.of() :
                        c.getCampanias().stream()
                                .map(Campania::getId)
                                .collect(Collectors.toList()))

                .idsEntidades(c.getEntidades() == null ? List.of() :
                        c.getEntidades().stream()
                                .map(EntidadColaboradora::getId)
                                .collect(Collectors.toList()))
                .build();
    }
}
