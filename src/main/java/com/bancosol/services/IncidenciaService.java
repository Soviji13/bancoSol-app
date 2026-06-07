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
import com.bancosol.mapper.IncidenciaMapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class IncidenciaService {

    private static final EstadoIncidencia ESTADO_POR_DEFECTO = EstadoIncidencia.PENDIENTE;

    private final IncidenciaRepository incidenciaRepository;
    private final ResponsableTiendaRepository responsableTiendaRepository;
    private final ResponsableEntidadRepository responsableEntidadRepository;
    private final IncidenciaMapper incidenciaMapper;

    public IncidenciaService(IncidenciaRepository incidenciaRepository,
                             ResponsableTiendaRepository responsableTiendaRepository,
                             ResponsableEntidadRepository responsableEntidadRepository,
                             IncidenciaMapper incidenciaMapper) {
        this.incidenciaRepository = incidenciaRepository;
        this.responsableTiendaRepository = responsableTiendaRepository;
        this.responsableEntidadRepository = responsableEntidadRepository;
        this.incidenciaMapper = incidenciaMapper;
    }

    public List<IncidenciaDTO> listarTodas() {
        return incidenciaMapper.toDTOList(
                incidenciaRepository.findAllByOrderByFechaHoraDesc()
        );
    }

    public List<IncidenciaDTO> listarPorEstado(String estado) {
        if (!tieneTexto(estado)) {
            return listarTodas();
        }

        EstadoIncidencia estadoIncidencia = convertirEstado(estado);

        return incidenciaMapper.toDTOList(
                incidenciaRepository.findByEstadoOrderByFechaHoraDesc(estadoIncidencia)
        );
    }

    public IncidenciaDTO buscarPorId(Long id) {
        return incidenciaMapper.toDTO(
                buscarEntidadPorId(id)
        );
    }

    @Transactional
    public IncidenciaDTO crear(IncidenciaFormDTO formDTO) {
        validarFormulario(formDTO);

        Incidencia incidencia = new Incidencia();
        cargarDatosFormulario(incidencia, formDTO);

        Incidencia incidenciaGuardada = incidenciaRepository.save(incidencia);

        return incidenciaMapper.toDTO(incidenciaGuardada);
    }

    @Transactional
    public IncidenciaDTO actualizar(Long id, IncidenciaFormDTO formDTO) {
        validarFormulario(formDTO);

        Incidencia incidencia = buscarEntidadPorId(id);
        cargarDatosFormulario(incidencia, formDTO);

        /*
         * No hace falta llamar a save().
         * La entidad ya está gestionada por JPA dentro de la transacción.
         * Al finalizar el método, Hibernate sincroniza los cambios automáticamente.
         */
        return incidenciaMapper.toDTO(incidencia);
    }

    @Transactional
    public void eliminar(Long id) {
        Incidencia incidencia = buscarEntidadPorId(id);
        incidenciaRepository.delete(incidencia);
    }

    @Transactional
    public IncidenciaDTO cambiarEstado(Long id, String nuevoEstado) {
        Incidencia incidencia = buscarEntidadPorId(id);
        incidencia.setEstado(convertirEstado(nuevoEstado));

        /*
         * Tampoco hace falta save().
         * La incidencia está gestionada por la transacción.
         */
        return incidenciaMapper.toDTO(incidencia);
    }

    private Incidencia buscarEntidadPorId(Long id) {
        validarId(id, "incidencia");

        return incidenciaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "No existe la incidencia con id: " + id
                ));
    }

    private void cargarDatosFormulario(Incidencia incidencia, IncidenciaFormDTO formDTO) {
        incidencia.setFechaHora(obtenerFechaHora(formDTO));
        incidencia.setAsunto(normalizarTextoObligatorio(formDTO.getAsunto(), "asunto"));
        incidencia.setDescripcion(normalizarTextoOpcional(formDTO.getDescripcion()));
        incidencia.setEstado(convertirEstado(formDTO.getEstado()));

        cargarResponsable(incidencia, formDTO);
    }

    private void validarFormulario(IncidenciaFormDTO formDTO) {
        if (formDTO == null) {
            throw new IllegalArgumentException("Los datos de la incidencia son obligatorios.");
        }

        validarTextoObligatorio(formDTO.getAsunto(), "asunto");
        validarResponsableUnico(formDTO);
    }

    private void validarResponsableUnico(IncidenciaFormDTO formDTO) {
        boolean tieneResponsableTienda = formDTO.getResponsableTiendaId() != null;
        boolean tieneResponsableEntidad = formDTO.getResponsableEntidadId() != null;

        if (!tieneResponsableTienda && !tieneResponsableEntidad) {
            throw new IllegalArgumentException("La incidencia debe tener un responsable asociado.");
        }

        if (tieneResponsableTienda && tieneResponsableEntidad) {
            throw new IllegalArgumentException(
                    "La incidencia no puede tener responsable de tienda y responsable de entidad a la vez."
            );
        }
    }

    private void cargarResponsable(Incidencia incidencia, IncidenciaFormDTO formDTO) {
        incidencia.setResponsableTienda(null);
        incidencia.setResponsableEntidad(null);

        if (formDTO.getResponsableTiendaId() != null) {
            incidencia.setResponsableTienda(
                    buscarResponsableTienda(formDTO.getResponsableTiendaId())
            );
            return;
        }

        incidencia.setResponsableEntidad(
                buscarResponsableEntidad(formDTO.getResponsableEntidadId())
        );
    }

    private ResponsableTienda buscarResponsableTienda(Long id) {
        validarId(id, "responsable de tienda");

        return responsableTiendaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "No existe el responsable de tienda con id: " + id
                ));
    }

    private ResponsableEntidad buscarResponsableEntidad(Long id) {
        validarId(id, "responsable de entidad");

        return responsableEntidadRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "No existe el responsable de entidad con id: " + id
                ));
    }

    private LocalDateTime obtenerFechaHora(IncidenciaFormDTO formDTO) {
        if (formDTO.getFechaHora() != null) {
            return formDTO.getFechaHora();
        }

        return LocalDateTime.now();
    }

    private EstadoIncidencia convertirEstado(String estado) {
        if (!tieneTexto(estado)) {
            return ESTADO_POR_DEFECTO;
        }

        try {
            return EstadoIncidencia.valueOf(estado.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Estado de incidencia no válido: " + estado);
        }
    }

    private void validarId(Long id, String nombreCampo) {
        if (id == null) {
            throw new IllegalArgumentException("El id de " + nombreCampo + " es obligatorio.");
        }

        if (id <= 0) {
            throw new IllegalArgumentException("El id de " + nombreCampo + " no es válido: " + id);
        }
    }

    private void validarTextoObligatorio(String texto, String nombreCampo) {
        if (!tieneTexto(texto)) {
            throw new IllegalArgumentException("El campo " + nombreCampo + " es obligatorio.");
        }
    }

    private String normalizarTextoObligatorio(String texto, String nombreCampo) {
        validarTextoObligatorio(texto, nombreCampo);
        return texto.trim();
    }

    private String normalizarTextoOpcional(String texto) {
        if (!tieneTexto(texto)) {
            return null;
        }

        return texto.trim();
    }

    private boolean tieneTexto(String texto) {
        return texto != null && !texto.isBlank();
    }
}