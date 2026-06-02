package com.bancosol.services;

import com.bancosol.dao.ContactoRepository;
import com.bancosol.dao.UsuarioRepository;
import com.bancosol.dto.ContactoDTO;
import com.bancosol.dto.UsuarioDTO;
import com.bancosol.entities.Usuario;
import com.bancosol.mapper.ContactoMapper;
import com.bancosol.mapper.UsuarioMapper;

import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UsuarioService {

    // Refactorización Sofía (0 IA) --------------------------------------

    private final UsuarioRepository usuarioRepo;
    private final UsuarioMapper usuarioMapper;

    public List <UsuarioDTO> listarTodos () {
        return usuarioMapper.toDTOList(usuarioRepo.findAll());
    }

    public UsuarioDTO findById (Long id) {
        return usuarioMapper.toDTO(usuarioRepo.findById(id).orElse(null));
    }

    // Devuelve todas las que se encuentren en el Array de Ids
    public List<UsuarioDTO> findAllById(List<Long> ids) {
        return usuarioMapper.toDTOList(usuarioRepo.findAllById(ids));
    }

    // Final parte Sofía ------------------------------------------

    /* 
    private final UsuarioRepository repo;
    public UsuarioService(UsuarioRepository repo) { this.repo = repo; }

    public List<UsuarioDTO> listarTodos() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private UsuarioDTO toDTO(Usuario u) {
        return UsuarioDTO.builder().id(u.getId()).email(u.getEmail()).rol(u.getRol()).build();
    }
    */
}