package com.bancosol.mapper;

import com.bancosol.dto.CoordinadorDTO;
import com.bancosol.dto.CoordinadorFormDTO;
import com.bancosol.entities.Campania;
import com.bancosol.entities.Contacto;
import com.bancosol.entities.Coordinador;
import com.bancosol.entities.Usuario;

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
        Usuario usuario = coordinador.getUsuario();

        return CoordinadorDTO.builder()
                .id(coordinador.getId())
                .nombre(contacto != null ? contacto.getNombre() : null)
                .email(contacto != null ? contacto.getEmail() : null)
                .telefono(contacto != null ? contacto.getTelefono() : null)
                .area(coordinador.getArea())
                .tiendas(coordinador.getTiendas())
                .permisoModificar(coordinador.getPermisoModificar())
                .usuarioId(usuario != null ? usuario.getId() : null)
                .contactoId(contacto != null ? contacto.getId() : null)

                /*
                 * entidadId no se rellena aquí porque no pertenece directamente
                 * a Coordinador. Se completa en el Service usando EntidadColaboradoraRepository.
                 */
                .entidadId(null)

                .idsCampanias(extraerIdsCampanias(coordinador))
                .nombresCampanias(extraerNombresCampanias(coordinador))
                .build();
    }

    public List<CoordinadorDTO> toDTOList(List<Coordinador> coordinadores) {
        if (coordinadores == null || coordinadores.isEmpty()) {
            return List.of();
        }

        return coordinadores.stream()
                .map(this::toDTO)
                .toList();
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

    public CoordinadorFormDTO toFormDTO(Coordinador coordinador) {
        if (coordinador == null) {
            return null;
        }

        Contacto contacto = coordinador.getContacto();
        Usuario usuario = coordinador.getUsuario();

        CoordinadorFormDTO dto = new CoordinadorFormDTO();

        dto.setNombre(contacto != null ? contacto.getNombre() : null);
        dto.setEmail(contacto != null ? contacto.getEmail() : null);
        dto.setTelefono(contacto != null ? contacto.getTelefono() : null);

        dto.setArea(coordinador.getArea());
        dto.setTiendas(coordinador.getTiendas());
        dto.setPermisoModificar(coordinador.getPermisoModificar());

        dto.setUsuarioId(usuario != null ? usuario.getId() : null);
        dto.setContactoId(contacto != null ? contacto.getId() : null);

        /*
         * entidadId se completa en el Service.
         */
        dto.setEntidadId(null);

        dto.setIdsCampanias(extraerIdsCampanias(coordinador));

        return dto;
    }

    public CoordinadorFormDTO toFormDTO(CoordinadorDTO dto) {
        if (dto == null) {
            return null;
        }

        CoordinadorFormDTO formDTO = new CoordinadorFormDTO();

        formDTO.setNombre(dto.getNombre());
        formDTO.setEmail(dto.getEmail());
        formDTO.setTelefono(dto.getTelefono());

        formDTO.setArea(dto.getArea());
        formDTO.setTiendas(dto.getTiendas());
        formDTO.setPermisoModificar(dto.getPermisoModificar());

        formDTO.setUsuarioId(dto.getUsuarioId());
        formDTO.setContactoId(dto.getContactoId());

        formDTO.setEntidadId(dto.getEntidadId());
        formDTO.setIdsCampanias(dto.getIdsCampanias());

        return formDTO;
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