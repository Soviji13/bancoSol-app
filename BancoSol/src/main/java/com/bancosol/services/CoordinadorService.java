package com.bancosol.services;

import com.bancosol.dao.CampaniaRepository;
import com.bancosol.dao.ContactoRepository;
import com.bancosol.dao.CoordinadorRepository;
import com.bancosol.dao.UsuarioRepository;
import com.bancosol.dto.CampaniaDTO;
import com.bancosol.dto.ContactoDTO;
import com.bancosol.dto.CoordinadorDTO;
import com.bancosol.dto.CoordinadorFormDTO;
import com.bancosol.entities.*;
import com.bancosol.dto.CoordinadorCompletoDTO;
import com.bancosol.entities.enums.TipoRol;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CoordinadorService {

    private final CoordinadorRepository repo;
    private final UsuarioRepository usuarioRepository;
    private final ContactoRepository contactoRepository;
    private final CampaniaRepository campaniaRepository;

    public CoordinadorService(
            CoordinadorRepository repo,
            UsuarioRepository usuarioRepository,
            ContactoRepository contactoRepository,
            CampaniaRepository campaniaRepository
    ) {
        this.repo = repo;
        this.usuarioRepository = usuarioRepository;
        this.contactoRepository = contactoRepository;
        this.campaniaRepository = campaniaRepository;
    }

    public List<CoordinadorDTO> listarTodos() {
        return repo.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public CoordinadorDTO buscarPorId(Long id) {
        Coordinador coordinador = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe el coordinador con id: " + id));

        return toDTO(coordinador);
    }

    @Transactional
    public CoordinadorDTO crear(CoordinadorFormDTO dto) {
        Coordinador coordinador = new Coordinador();

        aplicarDatosFormulario(coordinador, dto);

        Coordinador guardado = repo.save(coordinador);

        return toDTO(guardado);
    }

    @Transactional
    public CoordinadorDTO actualizar(Long id, CoordinadorFormDTO dto) {
        Coordinador coordinador = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe el coordinador con id: " + id));

        aplicarDatosFormulario(coordinador, dto);

        Coordinador actualizado = repo.save(coordinador);

        return toDTO(actualizado);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("No existe el coordinador con id: " + id);
        }

        repo.deleteById(id);
    }

    private void aplicarDatosFormulario(Coordinador coordinador, CoordinadorFormDTO dto) {
        coordinador.setArea(dto.getArea());
        coordinador.setTiendas(dto.getTiendas());
        coordinador.setPermisoModificar(dto.getPermisoModificar());

        asignarUsuario(coordinador, dto.getUsuarioId());
        asignarContacto(coordinador, dto.getContactoId());
        asignarCampanias(coordinador, dto.getIdsCampanias());
    }

    private void asignarUsuario(Coordinador coordinador, Long usuarioId) {
        if (usuarioId == null) {
            coordinador.setUsuario(null);
            return;
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("No existe el usuario con id: " + usuarioId));

        coordinador.setUsuario(usuario);
    }

    private void asignarContacto(Coordinador coordinador, Long contactoId) {
        if (contactoId == null) {
            coordinador.setContacto(null);
            return;
        }

        Contacto contacto = contactoRepository.findById(contactoId)
                .orElseThrow(() -> new RuntimeException("No existe el contacto con id: " + contactoId));

        coordinador.setContacto(contacto);
    }

    private void asignarCampanias(Coordinador coordinador, List<Long> idsCampanias) {
        if (idsCampanias == null || idsCampanias.isEmpty()) {
            coordinador.setCampanias(List.of());
            return;
        }

        List<Campania> campanias = campaniaRepository.findAllById(idsCampanias);

        if (campanias.size() != idsCampanias.size()) {
            throw new RuntimeException("Alguna campaña enviada no existe en la base de datos.");
        }

        coordinador.setCampanias(campanias);
    }

    private CoordinadorDTO toDTO(Coordinador c) {
        Contacto contacto = c.getContacto();
        Integer numeroTiendas = calcularNumeroTiendas(c);

        return CoordinadorDTO.builder()
                .id(c.getId())

                // Campos usados por el frontend nuevo
                .nombre(obtenerNombre(c))
                .area(c.getArea())
                .tiendas(numeroTiendas.shortValue())
                .permisoModificar(c.getPermisoModificar())
                .usuarioId(c.getUsuario() != null ? c.getUsuario().getId() : null)
                .contactoId(contacto != null ? contacto.getId() : null)
                .email(contacto != null ? contacto.getEmail() : null)
                .telefono(contacto != null ? contacto.getTelefono() : null)
                .idsCampanias(obtenerIdsCampanias(c))
                .nombresCampanias(obtenerNombresCampanias(c))

                // Campos antiguos conservados para no romper código existente
                .zonaGeografica(c.getArea())
                .numeroTiendas(numeroTiendas.shortValue())
                .contacto(toContactoDTO(contacto))
                .campanias(mapearCampanias(c))
                .build();
    }

    private Integer calcularNumeroTiendas(Coordinador c) {
        if (c.getCampanias() == null) {
            return 0;
        }

        return (int) c.getCampanias()
                .stream()
                .filter(campania -> campania.getColaboradores() != null)
                .flatMap(campania -> campania.getColaboradores().stream())
                .filter(colaborador -> colaborador.getTiendas() != null)
                .flatMap(colaborador -> colaborador.getTiendas().stream())
                .filter(tienda -> tienda.getId() != null)
                .map(Tienda::getId)
                .distinct()
                .count();
    }

    private String obtenerNombre(Coordinador c) {
        if (c.getContacto() == null) {
            return null;
        }

        return c.getContacto().getNombre();
    }

    private List<CampaniaDTO> mapearCampanias(Coordinador c) {
        if (c.getCampanias() == null) {
            return List.of();
        }

        return c.getCampanias()
                .stream()
                .map(this::toCampaniaDTO)
                .collect(Collectors.toList());
    }

    private List<Long> obtenerIdsCampanias(Coordinador c) {
        if (c.getCampanias() == null) {
            return List.of();
        }

        return c.getCampanias()
                .stream()
                .map(Campania::getId)
                .collect(Collectors.toList());
    }

    private List<String> obtenerNombresCampanias(Coordinador c) {
        if (c.getCampanias() == null) {
            return List.of();
        }

        return c.getCampanias()
                .stream()
                .map(Campania::getNombre)
                .collect(Collectors.toList());
    }


    private CampaniaDTO toCampaniaDTO(Campania campania) {
        return CampaniaDTO.builder()
                .id(campania.getId())
                .nombre(campania.getNombre())
                .activa(campania.getActiva())
                .fechaInicio(campania.getFechaInicio())
                .fechaFin(campania.getFechaFin())
                .anio(campania.getAnio())
                .build();
    }

    private ContactoDTO toContactoDTO(Contacto contacto) {
        if (contacto == null) {
            return null;
        }

        return ContactoDTO.builder()
                .id(contacto.getId())
                .nombre(contacto.getNombre())
                .email(contacto.getEmail())
                .telefono(contacto.getTelefono())
                .build();
    }

    @Transactional
    public CoordinadorDTO crearCompleto(CoordinadorCompletoDTO dto) {
        validarCoordinadorCompleto(dto);

        Contacto contacto = obtenerOCrearContacto(dto);

        Usuario usuario = obtenerOCrearUsuario(contacto.getEmail());

        Coordinador coordinador = new Coordinador();

        coordinador.setArea(normalizarTexto(dto.getArea()));
        coordinador.setTiendas(dto.getTiendas());
        coordinador.setPermisoModificar(dto.getPermisoModificar() != null ? dto.getPermisoModificar() : true);
        coordinador.setContacto(contacto);
        coordinador.setUsuario(usuario);

        asignarCampanias(coordinador, dto.getIdsCampanias());

        Coordinador guardado = repo.save(coordinador);

        return toDTO(guardado);
    }

    private void validarCoordinadorCompleto(CoordinadorCompletoDTO dto) {
        if (dto.getNombre() == null || dto.getNombre().isBlank()) {
            throw new RuntimeException("El nombre del coordinador es obligatorio.");
        }

        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new RuntimeException("El email del coordinador es obligatorio.");
        }

        if (dto.getArea() == null || dto.getArea().isBlank()) {
            throw new RuntimeException("El área del coordinador es obligatoria.");
        }

        if (dto.getTiendas() == null || dto.getTiendas() < 0) {
            throw new RuntimeException("El número de tiendas no es válido.");
        }

        if (dto.getIdsCampanias() == null || dto.getIdsCampanias().isEmpty()) {
            throw new RuntimeException("Debe seleccionar al menos una campaña.");
        }
    }

    private Contacto obtenerOCrearContacto(CoordinadorCompletoDTO dto) {
        String email = normalizarTexto(dto.getEmail());
        String telefono = normalizarTexto(dto.getTelefono());

        Contacto contactoPorEmail = contactoRepository.findByEmail(email).orElse(null);

        if (contactoPorEmail != null) {
            contactoPorEmail.setNombre(normalizarTexto(dto.getNombre()));

            if (telefono != null) {
                contactoPorEmail.setTelefono(telefono);
            }

            return contactoRepository.save(contactoPorEmail);
        }

        if (telefono != null) {
            Contacto contactoPorTelefono = contactoRepository.findByTelefono(telefono).orElse(null);

            if (contactoPorTelefono != null) {
                contactoPorTelefono.setNombre(normalizarTexto(dto.getNombre()));
                contactoPorTelefono.setEmail(email);

                return contactoRepository.save(contactoPorTelefono);
            }
        }

        Contacto nuevoContacto = new Contacto();

        nuevoContacto.setNombre(normalizarTexto(dto.getNombre()));
        nuevoContacto.setEmail(email);
        nuevoContacto.setTelefono(telefono);

        return contactoRepository.save(nuevoContacto);
    }

    private Usuario obtenerOCrearUsuario(String email) {
        String emailNormalizado = normalizarTexto(email);

        Usuario usuarioExistente = usuarioRepository.findByEmail(emailNormalizado).orElse(null);

        if (usuarioExistente != null) {
            return usuarioExistente;
        }

        Usuario nuevoUsuario = new Usuario();

        nuevoUsuario.setEmail(emailNormalizado);
        nuevoUsuario.setContrasenia("1234");
        nuevoUsuario.setRol(TipoRol.COORDINADOR);

        return usuarioRepository.save(nuevoUsuario);
    }

    private String normalizarTexto(String texto) {
        if (texto == null || texto.isBlank()) {
            return null;
        }

        return texto.trim();
    }
}