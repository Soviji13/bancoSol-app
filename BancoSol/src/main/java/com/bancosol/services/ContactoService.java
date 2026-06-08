package com.bancosol.services;

import com.bancosol.dao.ContactoRepository;
import com.bancosol.dto.ContactoDTO;
import com.bancosol.entities.Contacto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContactoService {

    private final ContactoRepository repo;

    public ContactoService(ContactoRepository repo) {
        this.repo = repo;
    }

    public List<ContactoDTO> listarTodos() {
        return repo.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ContactoDTO buscarPorId(Long id) {
        Contacto contacto = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe el contacto con id: " + id));

        return toDTO(contacto);
    }

    public ContactoDTO crear(ContactoDTO dto) {
        Contacto contacto = new Contacto();

        contacto.setNombre(normalizarTexto(dto.getNombre()));
        contacto.setEmail(normalizarTexto(dto.getEmail()));
        contacto.setTelefono(normalizarTexto(dto.getTelefono()));

        Contacto guardado = repo.save(contacto);

        return toDTO(guardado);
    }

    public ContactoDTO actualizar(Long id, ContactoDTO dto) {
        Contacto contacto = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe el contacto con id: " + id));

        contacto.setNombre(normalizarTexto(dto.getNombre()));
        contacto.setEmail(normalizarTexto(dto.getEmail()));
        contacto.setTelefono(normalizarTexto(dto.getTelefono()));

        Contacto actualizado = repo.save(contacto);

        return toDTO(actualizado);
    }

    public void eliminar(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("No existe el contacto con id: " + id);
        }

        repo.deleteById(id);
    }

    private ContactoDTO toDTO(Contacto c) {
        return ContactoDTO.builder()
                .id(c.getId())
                .nombre(c.getNombre())
                .email(c.getEmail())
                .telefono(c.getTelefono())
                .idsEntidades(obtenerIdsEntidades(c))
                .build();
    }

    private List<Long> obtenerIdsEntidades(Contacto contacto) {
        if (contacto == null || contacto.getResponsableEntidad() == null) {
            return List.of();
        }

        return contacto.getResponsableEntidad()
                .stream()
                .filter(relacion -> relacion.getColaborador() != null)
                .map(relacion -> relacion.getColaborador().getId())
                .distinct()
                .collect(Collectors.toList());
    }

    private String normalizarTexto(String texto) {
        if (texto == null || texto.isBlank()) {
            return null;
        }

        return texto.trim();
    }
}
