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
import java.util.stream.Collectors;

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

    // Añade esto a tus inyecciones (si no lo tenías)
    // private final CadenaRepository cadenaRepo;

    @Transactional
    public void guardar(CampaniaDTO dto) {
        Campania campania = repo.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Campaña no encontrada"));

        // 1. Actualizar textos y fechas
        campania.setNombre(dto.getNombre());
        campania.setFechaInicio(dto.getFechaInicio());
        campania.setFechaFin(dto.getFechaFin());

        // 2. Actualizar las cadenas seleccionadas
        // Limpiamos la lista actual y la rellenamos con las que vienen del formulario
        campania.getCadenas().clear();
        if (dto.getIdsCadenas() != null && !dto.getIdsCadenas().isEmpty()) {
            List<Cadena> cadenasSeleccionadas = cadenaRepo.findAllById(dto.getIdsCadenas());
            campania.getCadenas().addAll(cadenasSeleccionadas);
        }

        // El Dirty Checking de @Transactional se encarga del UPDATE
        repo.save(campania);
    }

    @Transactional
    public void eliminar(Long id) {
        repo.deleteById(id);
    }





}