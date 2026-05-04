package com.bancosol.services;

import com.bancosol.dao.UsuarioRepository;
import com.bancosol.dto.UsuarioDTO;
import com.bancosol.entities.Usuario;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {
    private final UsuarioRepository repo;
    public UsuarioService(UsuarioRepository repo) { this.repo = repo; }

    public List<UsuarioDTO> listarTodos() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private UsuarioDTO toDTO(Usuario u) {
        return UsuarioDTO.builder().id(u.getId()).email(u.getEmail()).rol(u.getRol()).build();
    }
}