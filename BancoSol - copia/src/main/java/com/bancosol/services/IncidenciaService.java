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
import java.util.stream.Collectors;

@Service
public class IncidenciaService {

    private final IncidenciaRepository repo;
    private final ResponsableTiendaRepository responsableTiendaRepository;
    private final ResponsableEntidadRepository responsableEntidadRepository;

    public IncidenciaService(
            IncidenciaRepository repo,
            ResponsableTiendaRepository responsableTiendaRepository,
            ResponsableEntidadRepository responsableEntidadRepository
    ) {
        this.repo = repo;
        this.responsableTiendaRepository = responsableTiendaRepository;
        this.responsableEntidadRepository = responsableEntidadRepository;
    }

    public List<IncidenciaDTO> listarTodas() {
        return repo.findAllByOrderByFechaHoraDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public IncidenciaDTO buscarPorId(Long id) {
        Incidencia incidencia = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe la incidencia con id: " + id));

        return toDTO(incidencia);
    }

    public List<IncidenciaDTO> buscarPorEstado(String estado) {
        EstadoIncidencia estadoIncidencia = parsearEstado(estado);

        return repo.findByEstadoOrderByFechaHoraDesc(estadoIncidencia)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<IncidenciaDTO> buscarPorResponsableTienda(Long responsableTiendaId) {
        return repo.findByResponsableTienda_IdOrderByFechaHoraDesc(responsableTiendaId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<IncidenciaDTO> buscarPorResponsableEntidad(Long responsableEntidadId) {
        return repo.findByResponsableEntidad_IdOrderByFechaHoraDesc(responsableEntidadId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public IncidenciaDTO crear(IncidenciaFormDTO dto) {
        Incidencia incidencia = new Incidencia();

        aplicarDatosFormulario(incidencia, dto);

        Incidencia guardada = repo.save(incidencia);

        return toDTO(guardada);
    }

    @Transactional
    public IncidenciaDTO actualizar(Long id, IncidenciaFormDTO dto) {
        Incidencia incidencia = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe la incidencia con id: " + id));

        aplicarDatosFormulario(incidencia, dto);

        Incidencia actualizada = repo.save(incidencia);

        return toDTO(actualizada);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("No existe la incidencia con id: " + id);
        }

        repo.deleteById(id);
    }

    private void aplicarDatosFormulario(Incidencia incidencia, IncidenciaFormDTO dto) {
        validarFormulario(dto);

        incidencia.setFechaHora(
                dto.getFechaHora() != null
                        ? dto.getFechaHora()
                        : LocalDateTime.now()
        );

        incidencia.setAsunto(normalizarTexto(dto.getAsunto()));
        incidencia.setDescripcion(normalizarTexto(dto.getDescripcion()));
        incidencia.setEstado(parsearEstado(dto.getEstado()));

        asignarResponsables(
                incidencia,
                dto.getResponsableTiendaId(),
                dto.getResponsableEntidadId()
        );
    }

    private void validarFormulario(IncidenciaFormDTO dto) {
        if (dto.getAsunto() == null || dto.getAsunto().isBlank()) {
            throw new RuntimeException("El asunto de la incidencia es obligatorio.");
        }

        boolean tieneResponsableTienda = dto.getResponsableTiendaId() != null;
        boolean tieneResponsableEntidad = dto.getResponsableEntidadId() != null;

        if (!tieneResponsableTienda && !tieneResponsableEntidad) {
            throw new RuntimeException("La incidencia debe tener un responsable asociado.");
        }

        if (tieneResponsableTienda && tieneResponsableEntidad) {
            throw new RuntimeException("La incidencia no puede tener responsable de tienda y responsable de entidad a la vez.");
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

    private void asignarResponsables(
            Incidencia incidencia,
            Long responsableTiendaId,
            Long responsableEntidadId
    ) {
        incidencia.setResponsableTienda(null);
        incidencia.setResponsableEntidad(null);

        if (responsableTiendaId != null) {
            ResponsableTienda responsableTienda = responsableTiendaRepository.findById(responsableTiendaId)
                    .orElseThrow(() -> new RuntimeException("No existe el responsable de tienda con id: " + responsableTiendaId));

            incidencia.setResponsableTienda(responsableTienda);
            return;
        }

        if (responsableEntidadId != null) {
            ResponsableEntidad responsableEntidad = responsableEntidadRepository.findById(responsableEntidadId)
                    .orElseThrow(() -> new RuntimeException("No existe el responsable de entidad con id: " + responsableEntidadId));

            incidencia.setResponsableEntidad(responsableEntidad);
        }
    }

    private IncidenciaDTO toDTO(Incidencia i) {
        ResponsableTienda responsableTienda = i.getResponsableTienda();
        ResponsableEntidad responsableEntidad = i.getResponsableEntidad();

        return IncidenciaDTO.builder()
                .id(i.getId())
                .fechaHora(i.getFechaHora())
                .asunto(i.getAsunto())
                .descripcion(i.getDescripcion())
                .estado(i.getEstado() != null ? i.getEstado().name() : null)

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

                .reportadoPorTipo(obtenerReportadoPorTipo(i))
                .reportadoPorNombre(obtenerReportadoPorNombre(i))
                .build();
    }

    private String obtenerReportadoPorTipo(Incidencia i) {
        if (i.getResponsableTienda() != null) {
            return "RESPONSABLE_TIENDA";
        }

        if (i.getResponsableEntidad() != null) {
            return "RESPONSABLE_ENTIDAD";
        }

        return null;
    }

    private String obtenerReportadoPorNombre(Incidencia i) {
        if (i.getResponsableTienda() != null) {
            return obtenerNombreResponsableTienda(i.getResponsableTienda());
        }

        if (i.getResponsableEntidad() != null) {
            return obtenerNombreResponsableEntidad(i.getResponsableEntidad());
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

        return null;
    }

    private String normalizarTexto(String texto) {
        if (texto == null || texto.isBlank()) {
            return null;
        }

        return texto.trim();
    }
}