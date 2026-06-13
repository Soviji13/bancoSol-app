package com.bancosol.services;

import com.bancosol.dao.ResponsableTiendaRepository;
import com.bancosol.dto.ResponsableTiendaDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import com.bancosol.mapper.ResponsableTiendaMapper;

import java.util.List;

@Service
@AllArgsConstructor
public class ResponsableTiendaService {

    private final ResponsableTiendaRepository responsableTiendaRepository;
    private final ResponsableTiendaMapper responsableTiendaMapper; // Inyectamos tu mapper

    public List<ResponsableTiendaDTO> listarTodos() {
        return responsableTiendaMapper.toDTOList(responsableTiendaRepository.findAll());
    }

    //francisco javier garcia sierra ia0%
    public List<ResponsableTiendaDTO> listarLibres() {
        return responsableTiendaMapper.toDTOList(responsableTiendaRepository.findResponsablesSinTienda());
    }

    public ResponsableTiendaDTO buscarPorId(Long id) {
        return responsableTiendaRepository.findById(id)
                .map(responsableTiendaMapper::toDTO)
                .orElse(null);
    }
}
