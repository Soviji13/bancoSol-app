package com.bancosol.services;

import com.bancosol.dao.CadenaRepository;
import com.bancosol.dto.CadenaDTO;
import com.bancosol.entities.Cadena;
import com.bancosol.mapper.CadenaMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class CadenaService {

    private final CadenaRepository repo;
    private final CadenaMapper cadenaMapper;

    @Transactional(readOnly = true)
    public List<CadenaDTO> listarTodas() {
        return cadenaMapper.toDTOList(repo.findAll());
    }

    @Transactional(readOnly = true)
    public CadenaDTO findById(Long id) {
        return repo.findById(id)
                .map(cadenaMapper::toDTO)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public List<CadenaDTO> findAllById(List<Long> ids) {
        return cadenaMapper.toDTOList(repo.findAllById(ids));
    }

    @Transactional
    public void guardar(CadenaDTO dto) {
        Cadena cadena;

        if (dto.getId() != null) {
            cadena = repo.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Cadena no encontrada"));
        } else {
            cadena = new Cadena();
        }

        cadena.setNombre(dto.getNombre());
        cadena.setCodigo(dto.getCodigo());

        repo.save(cadena);
    }

    @Transactional
    public void eliminar(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
        }
    }
}