package com.bancosol.services;

import com.bancosol.dao.IncidenciaRepository;
import com.bancosol.dao.ResponsableEntidadRepository;
import com.bancosol.dao.ResponsableTiendaRepository;
import com.bancosol.dto.IncidenciaDTO;
import com.bancosol.dto.IncidenciaFormDTO;
import com.bancosol.entities.Incidencia;
import com.bancosol.entities.ResponsableEntidad;
import com.bancosol.entities.ResponsableTienda;
import com.bancosol.entities.enums.EstadoIncidencia;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class IncidenciaService {

    private final IncidenciaRepository incidenciaRepository;
    private final ResponsableTiendaRepository responsableTiendaRepository;
    private final ResponsableEntidadRepository responsableEntidadRepository;

    public IncidenciaService(
            IncidenciaRepository incidenciaRepository,
            ResponsableTiendaRepository responsableTiendaRepository,
            ResponsableEntidadRepository responsableEntidadRepository
    ) {
        this.incidenciaRepository = incidenciaRepository;
        this.responsableTiendaRepository = responsableTiendaRepository;
        this.responsableEntidadRepository = responsableEntidadRepository;
    }

    public List<IncidenciaDTO> listarTodas() {
        return incidenciaRepository.findAllByOrderByFechaHoraDesc()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public List<IncidenciaDTO> listarPorEstado(String estado) {
        if (estado == null || estado.isBlank()) {
            return listarTodas();
        }

        EstadoIncidencia estadoIncidencia = parsearEstado(estado);

        return incidenciaRepository.findByEstadoOrderByFechaHoraDesc(estadoIncidencia)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public IncidenciaDTO buscarPorId(Long id) {
        Incidencia incidencia = obtenerEntidadPorId(id);
        return toDTO(incidencia);
    }

    @Transactional
    public IncidenciaDTO crear(IncidenciaFormDTO formDTO) {
        Incidencia incidencia = new Incidencia();

        aplicarDatosFormulario(incidencia, formDTO);

        Incidencia incidenciaGuardada = incidenciaRepository.save(incidencia);

        return toDTO(incidenciaGuardada);
    }

    @Transactional
    public IncidenciaDTO actualizar(Long id, IncidenciaFormDTO formDTO) {
        Incidencia incidencia = obtenerEntidadPorId(id);

        aplicarDatosFormulario(incidencia, formDTO);

        Incidencia incidenciaActualizada = incidenciaRepository.save(incidencia);

        return toDTO(incidenciaActualizada);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!incidenciaRepository.existsById(id)) {
            throw new RuntimeException("No existe la incidencia con id: " + id);
        }

        incidenciaRepository.deleteById(id);
    }

    @Transactional
    public IncidenciaDTO cambiarEstado(Long id, String nuevoEstado) {
        Incidencia incidencia = obtenerEntidadPorId(id);

        incidencia.setEstado(parsearEstado(nuevoEstado));

        Incidencia incidenciaActualizada = incidenciaRepository.save(incidencia);

        return toDTO(incidenciaActualizada);
    }

    private Incidencia obtenerEntidadPorId(Long id) {
        return incidenciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe la incidencia con id: " + id));
    }

    private void aplicarDatosFormulario(Incidencia incidencia, IncidenciaFormDTO formDTO) {
        validarFormulario(formDTO);

        incidencia.setFechaHora(
                formDTO.getFechaHora() != null
                        ? formDTO.getFechaHora()
                        : LocalDateTime.now()
        );

        incidencia.setAsunto(normalizarTexto(formDTO.getAsunto()));
        incidencia.setDescripcion(normalizarTexto(formDTO.getDescripcion()));
        incidencia.setEstado(parsearEstado(formDTO.getEstado()));

        asignarResponsable(
                incidencia,
                formDTO.getResponsableTiendaId(),
                formDTO.getResponsableEntidadId()
        );
    }

    private void validarFormulario(IncidenciaFormDTO formDTO) {
        if (formDTO == null) {
            throw new RuntimeException("Los datos de la incidencia son obligatorios.");
        }

        if (formDTO.getAsunto() == null || formDTO.getAsunto().isBlank()) {
            throw new RuntimeException("El asunto de la incidencia es obligatorio.");
        }

        boolean tieneResponsableTienda = formDTO.getResponsableTiendaId() != null;
        boolean tieneResponsableEntidad = formDTO.getResponsableEntidadId() != null;

        if (!tieneResponsableTienda && !tieneResponsableEntidad) {
            throw new RuntimeException("La incidencia debe tener un responsable asociado.");
        }

        if (tieneResponsableTienda && tieneResponsableEntidad) {
            throw new RuntimeException("La incidencia no puede tener responsable de tienda y responsable de entidad a la vez.");
        }
    }

    private void asignarResponsable(
            Incidencia incidencia,
            Long responsableTiendaId,
            Long responsableEntidadId
    ) {
        incidencia.setResponsableTienda(null);
        incidencia.setResponsableEntidad(null);

        if (responsableTiendaId != null) {
            ResponsableTienda responsableTienda = responsableTiendaRepository.findById(responsableTiendaId)
                    .orElseThrow(() -> new RuntimeException(
                            "No existe el responsable de tienda con id: " + responsableTiendaId
                    ));

            incidencia.setResponsableTienda(responsableTienda);
            return;
        }

        if (responsableEntidadId != null) {
            ResponsableEntidad responsableEntidad = responsableEntidadRepository.findById(responsableEntidadId)
                    .orElseThrow(() -> new RuntimeException(
                            "No existe el responsable de entidad con id: " + responsableEntidadId
                    ));

            incidencia.setResponsableEntidad(responsableEntidad);
        }
    }

    private EstadoIncidencia parsearEstado(String estado) {
        if (estado == null || estado.isBlank()) {
            return EstadoIncidencia.PENDIENTE;
        }

        try {
            return EstadoIncidencia.valueOf(estado.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado de incidencia no válido: " + estado);
        }
    }

    private IncidenciaDTO toDTO(Incidencia incidencia) {
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

    private String obtenerReportadoPorTipo(
            ResponsableTienda responsableTienda,
            ResponsableEntidad responsableEntidad
    ) {
        if (responsableTienda != null) {
            return "RESPONSABLE_TIENDA";
        }

        if (responsableEntidad != null) {
            return "RESPONSABLE_ENTIDAD";
        }

        return null;
    }

    private String obtenerReportadoPorNombre(
            ResponsableTienda responsableTienda,
            ResponsableEntidad responsableEntidad
    ) {
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

    private String normalizarTexto(String texto) {
        if (texto == null || texto.isBlank()) {
            return null;
        }

        return texto.trim();
    }
}