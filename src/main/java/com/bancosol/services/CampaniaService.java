package com.bancosol.services;

import com.bancosol.dao.CadenaRepository;
import com.bancosol.dao.CampaniaRepository;
import com.bancosol.dao.CoordinadorRepository;
import com.bancosol.dto.CampaniaDTO;
import com.bancosol.entities.*;
import com.bancosol.mapper.CampaniaMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class CampaniaService {
    private final CampaniaRepository repo;
    private final CampaniaMapper campaniaMapper;
    private final CoordinadorRepository coordinadorRepo;
    private final CadenaRepository cadenaRepo;

    public List<CampaniaDTO> listarTodas() {
        return campaniaMapper.toDTOList(repo.findAll());
    }

    public CampaniaDTO findById(Long id) {
        return campaniaMapper.toDTO(repo.findById(id).orElse(null));
    }

    public List<CampaniaDTO> findAllById(List<Long> ids) {
        return campaniaMapper.toDTOList(repo.findAllById(ids));
    }

    // Parte Sofía Si Villalba Jiménez (0% IA) --------------------------------------------------

    

    //------------------------------------------------------------------------------------------------

    @Transactional
    public void vincularCoordinador(Long campaniaId, Long coordinadorId) {
        Campania campania = repo.findById(campaniaId).orElse(null);
        Coordinador coordinador = coordinadorRepo.findById(coordinadorId).orElse(null);

        if (campania != null && coordinador != null) {
            if (!campania.getCoordinadores().contains(coordinador)) {
                campania.getCoordinadores().add(coordinador);
                repo.save(campania);
            }
        }
    }

    @Transactional
    public void desvincularCoordinador(Long campaniaId, Long coordinadorId) {
        Campania campania = repo.findById(campaniaId).orElse(null);
        Coordinador coordinador = coordinadorRepo.findById(coordinadorId).orElse(null);

        if (campania != null && coordinador != null) {
            campania.getCoordinadores().remove(coordinador);
            repo.save(campania);
        }
    }



    @Transactional
    public void eliminar(Long id) {
        repo.deleteById(id);
    }

    @Transactional
    public CampaniaDTO guardar(CampaniaDTO dto) {
        Campania campania;
        boolean esNuevo = (dto.getId() == null);

        if (!esNuevo) {
            campania = repo.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Campaña no encontrada"));
        } else {
            campania = new Campania();
            campania.setActiva(false); // Sigue naciendo desactivada por defecto

            if (dto.getFechaInicio() != null) {
                campania.setAnio((short) dto.getFechaInicio().getYear());
            }
        }

        // Datos básicos
        campania.setNombre(dto.getNombre());
        campania.setFechaInicio(dto.getFechaInicio());
        campania.setFechaFin(dto.getFechaFin());

        if (dto.getIdsCadenas() != null) {
            campania.getCadenas().clear();
            if (!dto.getIdsCadenas().isEmpty()) {
                List<Cadena> cadenasSeleccionadas = cadenaRepo.findAllById(dto.getIdsCadenas());
                campania.getCadenas().addAll(cadenasSeleccionadas);
            }
        } else if (!esNuevo) {
            campania.getCadenas().clear();
        }

        if (dto.getIdsCoordinadores() != null) {
            campania.getCoordinadores().clear();
            if (!dto.getIdsCoordinadores().isEmpty()) {
                List<Coordinador> coordsSeleccionados = coordinadorRepo.findAllById(dto.getIdsCoordinadores());
                campania.getCoordinadores().addAll(coordsSeleccionados);
            }
        } else if (!esNuevo) {
            campania.getCoordinadores().clear();
        }

        Campania saved = repo.save(campania);
        return campaniaMapper.toDTO(saved);
    }

    @Transactional
    public void cambiarEstado(Long id, boolean nuevoEstado) {
        Campania campaniaObjetivo = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaña no encontrada"));

        if (nuevoEstado) {
            repo.findByActivaTrue().ifPresent(activaAnterior -> {
                if (!activaAnterior.getId().equals(campaniaObjetivo.getId())) {
                    activaAnterior.setActiva(false);
                    // El Flush obliga a la BD a registrar el 'false' YA de forma prioritaria
                    repo.saveAndFlush(activaAnterior);
                }
            });
        }

        campaniaObjetivo.setActiva(nuevoEstado);
        repo.save(campaniaObjetivo);
    }





}