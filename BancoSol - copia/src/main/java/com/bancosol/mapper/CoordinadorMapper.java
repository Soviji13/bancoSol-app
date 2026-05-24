package com.bancosol.mapper;

import com.bancosol.dto.CampaniaDTO;
import com.bancosol.dto.ContactoDTO;
import com.bancosol.dto.CoordinadorDTO;
import com.bancosol.entities.Campania;
import com.bancosol.entities.Contacto;
import com.bancosol.entities.Coordinador;
import com.bancosol.entities.Tienda;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CoordinadorMapper {

    public CoordinadorDTO toDTO(Coordinador coordinador) {
        if (coordinador == null) {
            return null;
        }

        Contacto contacto = coordinador.getContacto();
        Integer numeroTiendas = calcularNumeroTiendas(coordinador);

        return CoordinadorDTO.builder()
                .id(coordinador.getId())

                // Campos usados por el frontend nuevo / JSP
                .nombre(obtenerNombre(coordinador))
                .area(coordinador.getArea())
                .tiendas(numeroTiendas.shortValue())
                .permisoModificar(coordinador.getPermisoModificar())
                .usuarioId(coordinador.getUsuario() != null ? coordinador.getUsuario().getId() : null)
                .contactoId(contacto != null ? contacto.getId() : null)
                .email(contacto != null ? contacto.getEmail() : null)
                .telefono(contacto != null ? contacto.getTelefono() : null)
                .idsCampanias(obtenerIdsCampanias(coordinador))
                .nombresCampanias(obtenerNombresCampanias(coordinador))

                // Campos antiguos conservados
                .zonaGeografica(coordinador.getArea())
                .numeroTiendas(numeroTiendas.shortValue())
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

        /*
         * Usuario, Contacto y Campanias NO se asignan aquí.
         * Esas relaciones se resuelven en el Service usando repositories.
         */

        return coordinador;
    }

    private Integer calcularNumeroTiendas(Coordinador coordinador) {
        if (coordinador.getCampanias() == null) {
            return 0;
        }

        return (int) coordinador.getCampanias()
                .stream()
                .filter(campania -> campania.getColaboradores() != null)
                .flatMap(campania -> campania.getColaboradores().stream())
                .filter(colaborador -> colaborador.getTiendas() != null)
                .flatMap(colaborador -> colaborador.getTiendas().stream())
                .filter(tienda -> tienda.getId() != null)
                .map(Tienda::getId)
                .distinct()
                .count();
    }

    private String obtenerNombre(Coordinador coordinador) {
        if (coordinador.getContacto() == null) {
            return null;
        }

        return coordinador.getContacto().getNombre();
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

    private List<Long> obtenerIdsCampanias(Coordinador coordinador) {
        if (coordinador.getCampanias() == null) {
            return List.of();
        }

        return coordinador.getCampanias()
                .stream()
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