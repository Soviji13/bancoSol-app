package com.bancosol.services;

import com.bancosol.dao.CampaniaRepository;
import com.bancosol.dto.CampaniaDTO;
import com.bancosol.entities.*;
import com.bancosol.mapper.CampaniaMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CampaniaService {
    private final CampaniaRepository repo;
    private final CampaniaMapper campaniaMapper;

    public List<CampaniaDTO> listarTodas() {
        return campaniaMapper.toDTOList(repo.findAll());
    }

    public CampaniaDTO findById(Long id) {
        return campaniaMapper.toDTO(repo.findById(id).orElse(null));
    }

}