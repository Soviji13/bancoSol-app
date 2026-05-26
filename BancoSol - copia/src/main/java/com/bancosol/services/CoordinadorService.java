package com.bancosol.services;

import com.bancosol.dao.CampaniaRepository;
import com.bancosol.dao.ContactoRepository;
import com.bancosol.dao.CoordinadorRepository;
import com.bancosol.dao.UsuarioRepository;
import com.bancosol.dto.CampaniaDTO;
import com.bancosol.dto.ContactoDTO;
import com.bancosol.dto.CoordinadorCompletoDTO;
import com.bancosol.dto.CoordinadorDTO;
import com.bancosol.dto.CoordinadorFormDTO;
import com.bancosol.entities.Campania;
import com.bancosol.entities.Contacto;
import com.bancosol.entities.Coordinador;
import com.bancosol.entities.Tienda;
import com.bancosol.entities.Usuario;
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

    public CoordinadorService(CoordinadorRepository repo,
                              UsuarioRepository usuarioRepository,
                              ContactoRepository contactoRepository,
                              CampaniaRepository campaniaRepository) {
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

    public CoordinadorFormDTO buscarFormularioPorId(Long id) {
        Coordinador coordinador = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe el coordinador con id: " + id));

        CoordinadorFormDTO formDTO = new CoordinadorFormDTO();

        Contacto contacto = coordinador.getContacto();
        Usuario usuario = coordinador.getUsuario();

        formDTO.setNombre(contacto != null ? contacto.getNombre() : null);
        formDTO.setEmail(contacto != null ? contacto.getEmail() : null);
        formDTO.setTelefono(contacto != null ? contacto.getTelefono() : null);

        formDTO.setArea(coordinador.getArea());
        formDTO.setTiendas(coordinador.getTiendas());
        formDTO.setPermisoModificar(coordinador.getPermisoModificar());

        formDTO.setContactoId(contacto != null ? contacto.getId() : null);
        formDTO.setUsuarioId(usuario != null ? usuario.getId() : null);
        formDTO.setIdsCampanias(obtenerIdsCampanias(coordinador));

        return formDTO;
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
        Coordinador coordinador = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe el coordinador con id: " + id));

        Usuario usuario = coordinador.getUsuario();

        if (coordinador.getCampanias() != null) {
            coordinador.getCampanias().clear();
        }

        repo.saveAndFlush(coordinador);
        repo.delete(coordinador);
        repo.flush();

        eliminarUsuarioSiQuedaHuerfano(usuario);
    }

    private void eliminarUsuarioSiQuedaHuerfano(Usuario usuario) {
        if (usuario == null || usuario.getId() == null) {
            return;
        }

        boolean usadoPorOtroCoordinador = repo.existsByUsuario_Id(usuario.getId());

        if (!usadoPorOtroCoordinador) {
            usuarioRepository.delete(usuario);
        }
    }

    @Transactional
    public CoordinadorDTO crearCompleto(CoordinadorCompletoDTO dto) {
        validarCoordinadorCompleto(dto);

        Contacto contacto = obtenerOCrearContacto(dto);
        Usuario usuario = obtenerOCrearUsuario(contacto.getEmail());

        Coordinador coordinador = new Coordinador();

        coordinador.setArea(normalizarTexto(dto.getArea()));
        coordinador.setTiendas(dto.getTiendas() != null ? dto.getTiendas() : 0);
        coordinador.setPermisoModificar(dto.getPermisoModificar() != null ? dto.getPermisoModificar() : true);
        coordinador.setContacto(contacto);
        coordinador.setUsuario(usuario);

        asignarCampanias(coordinador, dto.getIdsCampanias());

        Coordinador guardado = repo.save(coordinador);

        return toDTO(guardado);
    }

    private void aplicarDatosFormulario(Coordinador coordinador, CoordinadorFormDTO dto) {
        validarFormulario(dto);

        Contacto contacto = obtenerOActualizarContacto(dto);
        Usuario usuario = obtenerOActualizarUsuario(dto, contacto.getEmail());

        coordinador.setArea(normalizarTexto(dto.getArea()));
        coordinador.setTiendas(dto.getTiendas() != null ? dto.getTiendas() : 0);
        coordinador.setPermisoModificar(dto.getPermisoModificar() != null ? dto.getPermisoModificar() : false);
        coordinador.setContacto(contacto);
        coordinador.setUsuario(usuario);

        asignarCampanias(coordinador, dto.getIdsCampanias());
    }

    private void validarFormulario(CoordinadorFormDTO dto) {
        if (dto.getNombre() == null || dto.getNombre().isBlank()) {
            throw new RuntimeException("El nombre del coordinador es obligatorio.");
        }

        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new RuntimeException("El email del coordinador es obligatorio.");
        }

        if (dto.getArea() == null || dto.getArea().isBlank()) {
            throw new RuntimeException("El área del coordinador es obligatoria.");
        }

        if (dto.getIdsCampanias() == null || dto.getIdsCampanias().isEmpty()) {
            throw new RuntimeException("Debe seleccionar al menos una campaña.");
        }

        if (dto.getTiendas() != null && dto.getTiendas() < 0) {
            throw new RuntimeException("El número de tiendas no es válido.");
        }
    }

    private Contacto obtenerOActualizarContacto(CoordinadorFormDTO dto) {
        String nombre = normalizarTexto(dto.getNombre());
        String email = normalizarEmail(dto.getEmail());
        String telefono = normalizarTexto(dto.getTelefono());

        Contacto contacto = null;

        if (dto.getContactoId() != null) {
            contacto = contactoRepository.findById(dto.getContactoId())
                    .orElseThrow(() -> new RuntimeException("No existe el contacto con id: " + dto.getContactoId()));
        }

        if (contacto == null && email != null) {
            contacto = contactoRepository.findByEmail(email).orElse(null);
        }

        if (contacto == null && telefono != null) {
            contacto = contactoRepository.findByTelefono(telefono).orElse(null);
        }

        if (contacto == null) {
            contacto = new Contacto();
        }

        contacto.setNombre(nombre);
        contacto.setEmail(email);
        contacto.setTelefono(telefono);

        return contactoRepository.save(contacto);
    }

    private Usuario obtenerOActualizarUsuario(CoordinadorFormDTO dto, String email) {
        String emailNormalizado = normalizarEmail(email);

        Usuario usuario = null;

        if (dto.getUsuarioId() != null) {
            usuario = usuarioRepository.findById(dto.getUsuarioId())
                    .orElseThrow(() -> new RuntimeException("No existe el usuario con id: " + dto.getUsuarioId()));
        }

        if (usuario == null && emailNormalizado != null) {
            usuario = usuarioRepository.findByEmail(emailNormalizado).orElse(null);
        }

        if (usuario == null) {
            usuario = new Usuario();
            usuario.setContrasenia("1234");
            usuario.setRol(TipoRol.COORDINADOR);
        }

        usuario.setEmail(emailNormalizado);

        return usuarioRepository.save(usuario);
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
        Short numeroTiendas = calcularNumeroTiendas(c);

        return CoordinadorDTO.builder()
                .id(c.getId())

                .nombre(obtenerNombre(c))
                .area(c.getArea())
                .tiendas(numeroTiendas)
                .permisoModificar(c.getPermisoModificar())
                .usuarioId(c.getUsuario() != null ? c.getUsuario().getId() : null)
                .contactoId(contacto != null ? contacto.getId() : null)
                .email(contacto != null ? contacto.getEmail() : null)
                .telefono(contacto != null ? contacto.getTelefono() : null)
                .idsCampanias(obtenerIdsCampanias(c))
                .nombresCampanias(obtenerNombresCampanias(c))

                .zonaGeografica(c.getArea())
                .numeroTiendas(numeroTiendas)
                .contacto(toContactoDTO(contacto))
                .campanias(mapearCampanias(c))
                .build();
    }

    private Short calcularNumeroTiendas(Coordinador c) {
        if (c.getCampanias() == null) {
            return 0;
        }

        long total = c.getCampanias()
                .stream()
                .filter(campania -> campania.getColaboradores() != null)
                .flatMap(campania -> campania.getColaboradores().stream())
                .filter(colaborador -> colaborador.getTiendas() != null)
                .flatMap(colaborador -> colaborador.getTiendas().stream())
                .filter(tienda -> tienda.getId() != null)
                .map(Tienda::getId)
                .distinct()
                .count();

        return (short) total;
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
        String email = normalizarEmail(dto.getEmail());
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
        String emailNormalizado = normalizarEmail(email);

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

    private String normalizarEmail(String email) {
        if (email == null || email.isBlank()) {
            return null;
        }

        return email.trim().toLowerCase();
    }
}