package com.bancosol.services;

import com.bancosol.dao.CadenaRepository;
import com.bancosol.dao.CampaniaRepository;
import com.bancosol.dao.CoordinadorRepository;
import com.bancosol.dto.CampaniaDTO;
import com.bancosol.dto.CampaniaFormDTO;
import com.bancosol.entities.Cadena;
import com.bancosol.entities.Campania;
import com.bancosol.entities.Coordinador;
import com.bancosol.entities.EntidadColaboradora;
import com.bancosol.entities.Tienda;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collection;
import java.util.List;

@Service
public class CampaniaService {

    private final CampaniaRepository repo;
    private final CadenaRepository cadenaRepository;
    private final CoordinadorRepository coordinadorRepository;

    public CampaniaService(
            CampaniaRepository repo,
            CadenaRepository cadenaRepository,
            CoordinadorRepository coordinadorRepository
    ) {
        this.repo = repo;
        this.cadenaRepository = cadenaRepository;
        this.coordinadorRepository = coordinadorRepository;
    }

    @Transactional(readOnly = true)
    public List<CampaniaDTO> listarTodas() {
        return repo.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public CampaniaDTO buscarPorId(Long id) {
        Campania campania = buscarEntidadPorId(id);
        return toDTO(campania);
    }

    @Transactional
    public CampaniaDTO crear(CampaniaFormDTO form) {
        validarFormulario(form);

        Campania campania = new Campania();
        campania.setNombre(form.getNombre().trim());
        campania.setFechaInicio(form.getFechaInicio());
        campania.setFechaFin(form.getFechaFin());
        campania.setActiva(form.getActiva() != null ? form.getActiva() : false);

        Campania guardada = repo.save(campania);

        return toDTO(guardada);
    }

    @Transactional
    public CampaniaDTO actualizar(Long id, CampaniaFormDTO form) {
        validarFormulario(form);

        Campania campania = buscarEntidadPorId(id);

        campania.setNombre(form.getNombre().trim());
        campania.setFechaInicio(form.getFechaInicio());
        campania.setFechaFin(form.getFechaFin());
        campania.setActiva(form.getActiva() != null ? form.getActiva() : campania.getActiva());

        Campania actualizada = repo.save(campania);

        return toDTO(actualizada);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "No existe una campaña con id " + id
            );
        }

        repo.deleteById(id);
    }

    @Transactional
    public CampaniaDTO actualizarCadenas(Long idCampania, List<Long> idsCadenas) {
        Campania campania = buscarEntidadPorId(idCampania);

        List<Cadena> cadenas = idsCadenas == null || idsCadenas.isEmpty()
                ? List.of()
                : cadenaRepository.findAllById(idsCadenas);

        if (idsCadenas != null && cadenas.size() != idsCadenas.size()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Alguna de las cadenas seleccionadas no existe"
            );
        }

        Collection<Cadena> cadenasActuales = campania.getCadenas();

        cadenasActuales.clear();
        cadenasActuales.addAll(cadenas);

        Campania guardada = repo.save(campania);

        return toDTO(guardada);
    }

    @Transactional
    public CampaniaDTO actualizarCoordinadores(Long idCampania, List<Long> idsCoordinadores) {
        Campania campania = buscarEntidadPorId(idCampania);

        List<Coordinador> coordinadores = idsCoordinadores == null || idsCoordinadores.isEmpty()
                ? List.of()
                : coordinadorRepository.findAllById(idsCoordinadores);

        if (idsCoordinadores != null && coordinadores.size() != idsCoordinadores.size()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Alguno de los coordinadores seleccionados no existe"
            );
        }

        Collection<Coordinador> coordinadoresActuales = campania.getCoordinadores();

        coordinadoresActuales.clear();
        coordinadoresActuales.addAll(coordinadores);

        Campania guardada = repo.save(campania);

        return toDTO(guardada);
    }

    private Campania buscarEntidadPorId(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existe una campaña con id " + id
                ));
    }

    private void validarFormulario(CampaniaFormDTO form) {
        if (form == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Los datos de la campaña son obligatorios"
            );
        }

        if (form.getNombre() == null || form.getNombre().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El nombre de la campaña es obligatorio"
            );
        }

        if (form.getFechaInicio() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La fecha de inicio es obligatoria"
            );
        }

        if (form.getFechaFin() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La fecha de fin es obligatoria"
            );
        }

        if (form.getFechaFin().isBefore(form.getFechaInicio())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La fecha de fin no puede ser anterior a la fecha de inicio"
            );
        }
    }

    private CampaniaDTO toDTO(Campania c) {
        return CampaniaDTO.builder()
                .id(c.getId())
                .nombre(c.getNombre())
                .activa(c.getActiva())
                .fechaInicio(c.getFechaInicio())
                .fechaFin(c.getFechaFin())
                .anio(c.getAnio())

                .idsCadenas(c.getCadenas() == null ? List.of() :
                        c.getCadenas().stream()
                                .map(Cadena::getId)
                                .toList())

                .idsTiendas(c.getTiendas() == null ? List.of() :
                        c.getTiendas().stream()
                                .map(Tienda::getId)
                                .toList())

                .idsColaboradores(c.getColaboradores() == null ? List.of() :
                        c.getColaboradores().stream()
                                .map(EntidadColaboradora::getId)
                                .toList())

                .idsCoordinadores(c.getCoordinadores() == null ? List.of() :
                        c.getCoordinadores().stream()
                                .map(Coordinador::getId)
                                .toList())

                .idsResponsables(List.of())
                .build();
    }
}