package com.bancosol.mapper;

import com.bancosol.dto.IncidenciaDTO;
import com.bancosol.entities.Incidencia;
import com.bancosol.entities.ResponsableEntidad;
import com.bancosol.entities.ResponsableTienda;
import org.springframework.stereotype.Component;

@Component
public class IncidenciaMapper extends MapperDTO<IncidenciaDTO, Incidencia> {

    @Override
    public IncidenciaDTO toDTO(Incidencia incidencia) {
        if (incidencia == null) {
            return null;
        }

        ResponsableTienda responsableTienda = incidencia.getResponsableTienda();
        ResponsableEntidad responsableEntidad = incidencia.getResponsableEntidad();

        return IncidenciaDTO.builder()
                .id(incidencia.getId())
                .fechaHora(incidencia.getFechaHora())
                .asunto(incidencia.getAsunto())
                .descripcion(incidencia.getDescripcion())
                .estado(incidencia.getEstado())

                .responsableTiendaId(
                        responsableTienda != null
                                ? responsableTienda.getId()
                                : null
                )
                .responsableTiendaNombre(
                        obtenerNombreResponsableTienda(responsableTienda)
                )

                .responsableEntidadId(
                        responsableEntidad != null
                                ? responsableEntidad.getId()
                                : null
                )
                .responsableEntidadNombre(
                        obtenerNombreResponsableEntidad(responsableEntidad)
                )

                .reportadoPorTipo(
                        obtenerReportadoPorTipo(responsableTienda, responsableEntidad)
                )
                .reportadoPorNombre(
                        obtenerReportadoPorNombre(responsableTienda, responsableEntidad)
                )
                .build();
    }

    public Incidencia toEntity(IncidenciaDTO dto) {
        if (dto == null) {
            return null;
        }

        Incidencia incidencia = new Incidencia();

        incidencia.setId(dto.getId());
        incidencia.setFechaHora(dto.getFechaHora());
        incidencia.setAsunto(dto.getAsunto());
        incidencia.setDescripcion(dto.getDescripcion());
        incidencia.setEstado(dto.getEstado());

        return incidencia;
    }

    private String obtenerReportadoPorTipo(ResponsableTienda responsableTienda,
                                           ResponsableEntidad responsableEntidad) {
        if (responsableTienda != null) {
            return "RESPONSABLE_TIENDA";
        }

        if (responsableEntidad != null) {
            return "RESPONSABLE_ENTIDAD";
        }

        return null;
    }

    private String obtenerReportadoPorNombre(ResponsableTienda responsableTienda,
                                             ResponsableEntidad responsableEntidad) {
        if (responsableTienda != null) {
            return obtenerNombreResponsableTienda(responsableTienda);
        }

        if (responsableEntidad != null) {
            return obtenerNombreResponsableEntidad(responsableEntidad);
        }

        return null;
    }

    private String obtenerNombreResponsableTienda(ResponsableTienda responsableTienda) {
        if (responsableTienda == null) {
            return null;
        }

        if (responsableTienda.getContacto() != null
                && responsableTienda.getContacto().getNombre() != null) {
            return responsableTienda.getContacto().getNombre();
        }

        return responsableTienda.getNombre();
    }

    private String obtenerNombreResponsableEntidad(ResponsableEntidad responsableEntidad) {
        if (responsableEntidad == null) {
            return null;
        }

        if (responsableEntidad.getContacto() != null
                && responsableEntidad.getContacto().getNombre() != null) {
            return responsableEntidad.getContacto().getNombre();
        }

        return "Responsable entidad " + responsableEntidad.getId();
    }
}