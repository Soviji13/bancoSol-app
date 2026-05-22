package com.bancosol.services;

import com.bancosol.dao.SolicitudCambioRepository;
import com.bancosol.dto.SolicitudCambioDTO;
import com.bancosol.entities.SolicitudCambio;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SolicitudCambioService {
    private final SolicitudCambioRepository repo;
    public SolicitudCambioService(SolicitudCambioRepository repo) { this.repo = repo; }

    public List<SolicitudCambioDTO> listarTodas() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private SolicitudCambioDTO toDTO(SolicitudCambio s) {
        return SolicitudCambioDTO.builder()
                .id(s.getId()).asunto(s.getAsunto()).descripcion(s.getDescripcion())
                .interfaz(s.getInterfaz()).estadoSolicitud(s.getEstadoSolicitud())
                .coordinadorId(s.getCoordinador().getId()).build();
    }
}