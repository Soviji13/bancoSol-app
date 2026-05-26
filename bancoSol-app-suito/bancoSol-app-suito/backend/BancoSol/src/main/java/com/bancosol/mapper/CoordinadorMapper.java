package com.bancosol.mapper;

import com.bancosol.dto.CampaniaDTO;
import com.bancosol.dto.ContactoDTO;
import com.bancosol.dto.CoordinadorDTO;
import com.bancosol.entities.Campania;
import com.bancosol.entities.Contacto;
import com.bancosol.entities.Coordinador;
import com.bancosol.entities.EntidadColaboradora;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

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
                .entidadId(obtenerEntidadId(coordinador))
                .idsCampanias(obtenerIdsCampanias(coordinador))
                .nombresCampanias(obtenerNombresCampanias(coordinador))
                .contacto(toContactoDTO(contacto))
                .campanias(mapearCampanias(coordinador))
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

    private Long obtenerEntidadId(Coordinador coordinador) {
        if (coordinador.getEntidades() == null || coordinador.getEntidades().isEmpty()) {
            return null;
        }

        return coordinador.getEntidades()
                .stream()
                .filter(entidad -> entidad.getId() != null)
                .map(EntidadColaboradora::getId)
                .findFirst()
                .orElse(null);
    }

    private List<Long> obtenerIdsCampanias(Coordinador coordinador) {
        if (coordinador.getCampanias() == null) {
            return List.of();
        }

        return coordinador.getCampanias()
                .stream()
                .filter(campania -> campania.getId() != null)
                .map(Campania::getId)
                .collect(Collectors.toList());
    }

    private List<String> obtenerNombresCampanias(Coordinador coordinador) {
        if (coordinador.getCampanias() == null) {
            return List.of();
        }

        return coordinador.getCampanias()
                .stream()
                .map(Campania::getNombre)
                .collect(Collectors.toList());
    }

    private List<CampaniaDTO> mapearCampanias(Coordinador coordinador) {
        if (coordinador.getCampanias() == null) {
            return List.of();
        }

        return coordinador.getCampanias()
                .stream()
                .map(this::toCampaniaDTO)
                .collect(Collectors.toList());
    }

    private CampaniaDTO toCampaniaDTO(Campania campania) {
        if (campania == null) {
            return null;
        }

        return CampaniaDTO.builder()
                .id(campania.getId())
                .nombre(campania.getNombre())
                .activa(campania.getActiva())
                .fechaInicio(campania.getFechaInicio())
                .fechaFin(campania.getFechaFin())
                .anio(campania.getAnio())
                .build();
    }

    private ContactoDTO toContactoDTO(Contacto contacto) {
        if (contacto == null) {
            return null;
        }

        return ContactoDTO.builder()
                .id(contacto.getId())
                .nombre(contacto.getNombre())
                .email(contacto.getEmail())
                .telefono(contacto.getTelefono())
                .build();
    }
}