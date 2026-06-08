package com.bancosol.services;

import com.bancosol.dao.ResponsableTiendaRepository;
import com.bancosol.dao.ContactoRepository;
import com.bancosol.dao.UsuarioRepository;
import com.bancosol.dto.ResponsableTiendaDTO;
import com.bancosol.dto.ResponsableTiendaNuevoDTO;
import com.bancosol.entities.Campania;
import com.bancosol.entities.Contacto;
import com.bancosol.entities.ResponsableTienda;
import com.bancosol.entities.Usuario;
import com.bancosol.entities.enums.TipoRol;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResponsableTiendaService {
    private final ResponsableTiendaRepository repo;
    private final ContactoRepository contactoRepo;
    private final UsuarioRepository usuarioRepo;

    public ResponsableTiendaService(ResponsableTiendaRepository repo, ContactoRepository contactoRepo, UsuarioRepository usuarioRepo) {
        this.repo = repo;
        this.contactoRepo = contactoRepo;
        this.usuarioRepo = usuarioRepo;
    }

    public List<ResponsableTiendaDTO> listarTodos() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    // NUEVO: CREACIÓN EN CASCADA COMPLETA
    @Transactional
    public ResponsableTiendaDTO crearResponsable(ResponsableTiendaNuevoDTO dto) {
        Contacto contacto = Contacto.builder()
                .nombre(dto.getNombre())
                .email(dto.getEmail())
                .telefono(dto.getTelefono())
                .build();
        contacto = contactoRepo.save(contacto);

        Usuario usuario = Usuario.builder()
                .email(dto.getEmail())
                .contrasenia(dto.getContrasenia())
                .rol(TipoRol.valueOf("RESPONSABLE_TIENDA")) //valueof pq lo escribo como un string
                .build();
        usuario = usuarioRepo.save(usuario);

        ResponsableTienda resp = ResponsableTienda.builder()
                .nombre(dto.getNombre().toUpperCase())
                .contacto(contacto)
                .usuario(usuario)
                .build();
        resp = repo.save(resp);

        return toDTO(resp);
    }

    private ResponsableTiendaDTO toDTO(ResponsableTienda r) {
        return ResponsableTiendaDTO.builder()
                .id(r.getId())
                .nombre(r.getNombre())
                .usuarioId(r.getUsuario() != null ? r.getUsuario().getId() : null)
                .contactoId(r.getContacto() != null ? r.getContacto().getId() : null)
                .idsTiendas(List.of())
                .idsCampanias(List.of()) // Devolvemos vacío para evitar consultar la tabla inexistente
                .build();
    }
}