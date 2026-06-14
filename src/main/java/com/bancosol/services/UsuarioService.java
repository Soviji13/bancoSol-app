package com.bancosol.services;

import com.bancosol.dao.CoordinadorRepository;
import com.bancosol.dao.ResponsableEntidadRepository;
import com.bancosol.dao.ResponsableTiendaRepository;
import com.bancosol.dao.UsuarioRepository;
import com.bancosol.dto.UsuarioDTO;
import com.bancosol.entities.Coordinador;
import com.bancosol.entities.ResponsableEntidad;
import com.bancosol.entities.ResponsableTienda;
import com.bancosol.entities.Usuario;
import com.bancosol.mapper.UsuarioMapper;

import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
@AllArgsConstructor
public class UsuarioService {

    // Refactorización Sofía (IA SOLO DONDE SE COMENTA)
    // --------------------------------------

    private final UsuarioRepository usuarioRepo;
    private final UsuarioMapper usuarioMapper;

    public List<UsuarioDTO> listarTodos() {
        return usuarioMapper.toDTOList(usuarioRepo.findAll());
    }

    public UsuarioDTO findById(Long id) {
        return usuarioMapper.toDTO(usuarioRepo.findById(id).orElse(null));
    }

    // Devuelve todas las que se encuentren en el Array de Ids
    public List<UsuarioDTO> findAllById(List<Long> ids) {
        return usuarioMapper.toDTOList(usuarioRepo.findAllById(ids));
    }

    // IA para automatizar el proceso de validar usuario y añadirle al DTO los
    // atributos extra

    // Repositorios para investigar quién es el dueño
    private final CoordinadorRepository coordinadorRepo;
    private final ResponsableEntidadRepository respEntidadRepo;
    private final ResponsableTiendaRepository respTiendaRepo;

    // AUTENTICACIÓN Y ENRIQUECIMIENTO DE DTO
    public UsuarioDTO autenticar(String username, String password) {
        Usuario user = usuarioRepo.findByEmail(username).orElse(null);

        if (user == null || !user.getContrasenia().equals(password)) {
            return null;
        }

        UsuarioDTO dto = usuarioMapper.toDTO(user);
        String rolName = user.getRol() != null ? user.getRol().name() : "";

        if (rolName.equals("ADMIN")) {

            dto.setNombreMostrado(user.getEmail());
            dto.setRolMostrado("Administrador del Sistema");
            dto.setIdReferencia(user.getId());
            dto.setPuedeModificar(true);

        } else if (rolName.equals("COORDINADOR")) {

            Coordinador coord = coordinadorRepo.findByUsuarioId(user.getId()).orElse(null);

            if (coord != null && coord.getContacto() != null) {
                dto.setNombreMostrado(coord.getContacto().getNombre());
                dto.setIdReferencia(coord.getId()); // ID específico de Coordinador
                dto.setPuedeModificar(coord.getPermisoModificar());
            }
            dto.setRolMostrado("Coordinador");

        } else if (rolName.equals("RESPONSABLE_ENTIDAD")) {

            ResponsableEntidad respEnt = respEntidadRepo.findByUsuarioId(user.getId()).orElse(null);
            if (respEnt != null && respEnt.getContacto() != null) {
                dto.setNombreMostrado(respEnt.getContacto().getNombre());
                dto.setIdReferencia(respEnt.getColaborador().getId()); // ID específico de la entidad colaboradora
            }
            dto.setPuedeModificar(false);
            dto.setRolMostrado("Responsable de Entidad");

        } else if (rolName.equals("RESPONSABLE_TIENDA")) {
            ResponsableTienda respTienda = respTiendaRepo.findByUsuarioId(user.getId()).orElse(null);
            if (respTienda != null && respTienda.getContacto() != null) {
                dto.setNombreMostrado(respTienda.getContacto().getNombre());
                dto.setIdReferencia(respTienda.getTienda().getId()); // ID específico de la tienda
            }
            dto.setRolMostrado("Responsable de Tienda");
            dto.setPuedeModificar(false);
        }

        return dto;
    }

    // Final parte Sofía ------------------------------------------

    /*
     * private final UsuarioRepository repo;
     * public UsuarioService(UsuarioRepository repo) { this.repo = repo; }
     * 
     * public List<UsuarioDTO> listarTodos() {
     * return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
     * }
     * 
     * private UsuarioDTO toDTO(Usuario u) {
     * return
     * UsuarioDTO.builder().id(u.getId()).email(u.getEmail()).rol(u.getRol()).build(
     * );
     * }
     */
}