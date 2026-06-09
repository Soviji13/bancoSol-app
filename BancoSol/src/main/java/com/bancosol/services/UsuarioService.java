package com.bancosol.services;

import com.bancosol.dao.UsuarioRepository;
import com.bancosol.dao.ResponsableTiendaRepository;
import com.bancosol.dao.CoordinadorRepository;
import com.bancosol.dao.ResponsableEntidadRepository;
import com.bancosol.dto.UsuarioDTO;
import com.bancosol.dto.UserLoginDTO;
import com.bancosol.entities.Usuario;
import org.springframework.stereotype.Service;
import com.bancosol.entities.Usuario;
import com.bancosol.entities.ResponsableTienda;
import com.bancosol.entities.Coordinador;
import com.bancosol.entities.ResponsableEntidad;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repo;
    private final ResponsableTiendaRepository tiendaRepo;
    private final CoordinadorRepository coordinadorRepo;
    private final ResponsableEntidadRepository entidadRepo;

    public List<UsuarioDTO> listarTodos() {
        return this.repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private UsuarioDTO toDTO(Usuario u) {
        return UsuarioDTO.builder().id(u.getId()).email(u.getEmail()).rol(u.getRol()).build();
    }

    public UsuarioDTO verificar(UserLoginDTO u) {
        String user = u.getUser();
        String pass = u.getPass();

        // Buscamos un usuario por su nombre de usuario
        Usuario usuario = this.repo.findByEmail(user).orElseThrow(
                () -> new RuntimeException("Usuario o contraseña incorrectos"));

        if (!usuario.getContrasenia().equals(pass)) {
            throw new RuntimeException("Usuario o contraseña incorrectos");
        }

        // Si todo ha ido bien, devolvemos un usuario DTO
        UsuarioDTO usuarioCorrecto = new UsuarioDTO();

        // Vamos comprobando los roles
        String nombreReal = "ADMINISTRADOR"; // Por defecto si es ADMIN

        switch (usuario.getRol()) {
            case RESPONSABLE_TIENDA:
                ResponsableTienda rt = this.tiendaRepo.findByUsuario(usuario)
                        .orElseThrow(() -> new RuntimeException("No se encontró el perfil de responsable de tienda"));
                if (rt.getContacto() != null) {
                    nombreReal = rt.getContacto().getNombre();
                }
                break;

            case COORDINADOR:
                Coordinador coord = this.coordinadorRepo.findByUsuario(usuario)
                        .orElseThrow(() -> new RuntimeException("No se encontró el perfil de coordinador"));
                if (coord.getContacto() != null) {
                    nombreReal = coord.getContacto().getNombre();
                }
                break;

            case RESPONSABLE_ENTIDAD:
                ResponsableEntidad re = this.entidadRepo.findByUsuario(usuario)
                        .orElseThrow(() -> new RuntimeException("No se encontró el perfil de responsable de entidad"));
                if (re.getContacto() != null) {
                    nombreReal = re.getContacto().getNombre();
                }
                break;

            case ADMIN:
                // Ya tiene el valor por defecto
                break;
        }

        // Le asignamos al usuario el nombre y el rol
        usuarioCorrecto.setNombre(nombreReal);
        usuarioCorrecto.setRol(usuario.getRol());

        return (usuarioCorrecto);
    }
}