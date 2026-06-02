package com.bancosol.services;

import com.bancosol.dao.CampaniaRepository;
import com.bancosol.dao.ContactoRepository;
import com.bancosol.dao.CoordinadorRepository;
import com.bancosol.dao.EntidadColaboradoraRepository;
import com.bancosol.dao.UsuarioRepository;
import com.bancosol.dto.CoordinadorDTO;
import com.bancosol.dto.CoordinadorFormDTO;
import com.bancosol.entities.Campania;
import com.bancosol.entities.Contacto;
import com.bancosol.entities.Coordinador;
import com.bancosol.entities.EntidadColaboradora;
import com.bancosol.entities.Usuario;
import com.bancosol.entities.enums.TipoRol;
import com.bancosol.mapper.CoordinadorMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class CoordinadorService {

    private static final String PASSWORD_TEMPORAL = "changeme";

    private final CoordinadorRepository repo;
    private final ContactoRepository contactoRepo;
    private final EntidadColaboradoraRepository entidadRepo;
    private final UsuarioRepository usuarioRepo;
    private final CampaniaRepository campaniaRepo;
    private final CoordinadorMapper coordinadorMapper;

    @Transactional(readOnly = true)
    public List<CoordinadorDTO> listarTodos() {
        return coordinadorMapper.toDTOList(repo.findAll());
    }

    @Transactional(readOnly = true)
    public CoordinadorDTO findById(Long id) {
        return repo.findById(id)
                .map(coordinadorMapper::toDTO)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public List<CoordinadorDTO> findAllById(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }

        return coordinadorMapper.toDTOList(repo.findAllById(ids));
    }

    @Transactional(readOnly = true)
    public CoordinadorFormDTO buscarFormularioPorId(Long id) {
        Coordinador coordinador = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Coordinador no encontrado"));

        return convertirAFormulario(coordinador);
    }

    @Transactional
    public Long crear(CoordinadorFormDTO dto) {
        validarFormulario(dto);

        Coordinador coordinador = new Coordinador();

        aplicarDatosFormulario(coordinador, dto);

        Coordinador coordinadorGuardado = repo.save(coordinador);

        actualizarCampanias(coordinadorGuardado, dto.getIdsCampanias());
        actualizarEntidad(coordinadorGuardado, dto.getEntidadId());

        return coordinadorGuardado.getId();
    }

    @Transactional
    public Long actualizar(Long id, CoordinadorFormDTO dto) {
        validarFormulario(dto);

        Coordinador coordinador = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Coordinador no encontrado"));

        aplicarDatosFormulario(coordinador, dto);

        Coordinador coordinadorGuardado = repo.save(coordinador);

        actualizarCampanias(coordinadorGuardado, dto.getIdsCampanias());
        actualizarEntidad(coordinadorGuardado, dto.getEntidadId());

        return coordinadorGuardado.getId();
    }

    @Transactional
    public Long guardar(CoordinadorDTO dto) {
        validarDTO(dto);

        CoordinadorFormDTO formDTO = convertirDTOAFormulario(dto);

        if (dto.getId() == null) {
            return crear(formDTO);
        }

        return actualizar(dto.getId(), formDTO);
    }

    @Transactional
    public void eliminar(Long id) {
        Coordinador coordinador = repo.findById(id).orElse(null);

        if (coordinador == null) {
            return;
        }

        Contacto contacto = coordinador.getContacto();
        Usuario usuario = coordinador.getUsuario();

        desasociarEntidades(coordinador);
        desasociarCampanias(coordinador);

        repo.delete(coordinador);
        repo.flush();

        eliminarContactoSiProcede(contacto);
        eliminarUsuarioSiProcede(usuario);
    }

    private CoordinadorFormDTO convertirAFormulario(Coordinador coordinador) {
        CoordinadorFormDTO dto = new CoordinadorFormDTO();

        Contacto contacto = coordinador.getContacto();
        Usuario usuario = coordinador.getUsuario();

        dto.setNombre(contacto != null ? contacto.getNombre() : null);
        dto.setEmail(contacto != null ? contacto.getEmail() : null);
        dto.setTelefono(contacto != null ? contacto.getTelefono() : null);

        dto.setArea(coordinador.getArea());
        dto.setTiendas(coordinador.getTiendas());
        dto.setPermisoModificar(coordinador.getPermisoModificar());

        dto.setUsuarioId(usuario != null ? usuario.getId() : null);
        dto.setContactoId(contacto != null ? contacto.getId() : null);

        dto.setEntidadId(obtenerEntidadId(coordinador));
        dto.setIdsCampanias(obtenerIdsCampanias(coordinador));

        return dto;
    }

    private CoordinadorFormDTO convertirDTOAFormulario(CoordinadorDTO dto) {
        CoordinadorFormDTO formDTO = new CoordinadorFormDTO();

        formDTO.setNombre(dto.getNombre());
        formDTO.setEmail(dto.getEmail());
        formDTO.setTelefono(dto.getTelefono());
        formDTO.setArea(dto.getArea());
        formDTO.setTiendas(dto.getTiendas());
        formDTO.setPermisoModificar(dto.getPermisoModificar());
        formDTO.setUsuarioId(dto.getUsuarioId());
        formDTO.setContactoId(dto.getContactoId());
        formDTO.setEntidadId(dto.getEntidadId());
        formDTO.setIdsCampanias(dto.getIdsCampanias());

        return formDTO;
    }

    private void aplicarDatosFormulario(Coordinador coordinador, CoordinadorFormDTO dto) {
        coordinador.setArea(normalizarTexto(dto.getArea()));
        coordinador.setTiendas(dto.getTiendas() != null ? dto.getTiendas() : 0);
        coordinador.setPermisoModificar(dto.getPermisoModificar() != null ? dto.getPermisoModificar() : false);

        Contacto contacto = obtenerOcrearContacto(
                coordinador.getContacto(),
                dto.getContactoId(),
                dto.getNombre(),
                dto.getEmail(),
                dto.getTelefono()
        );

        coordinador.setContacto(contacto);

        Usuario usuario = obtenerOcrearUsuario(
                coordinador.getUsuario(),
                dto.getUsuarioId(),
                dto.getEmail()
        );

        coordinador.setUsuario(usuario);
    }

    private Contacto obtenerOcrearContacto(Contacto contactoActual,
                                           Long contactoId,
                                           String nombre,
                                           String email,
                                           String telefono) {
        Contacto contacto;

        if (contactoId != null) {
            contacto = contactoRepo.findById(contactoId)
                    .orElseThrow(() -> new RuntimeException("Contacto no encontrado"));
        } else if (contactoActual != null) {
            contacto = contactoActual;
        } else {
            contacto = new Contacto();
        }

        contacto.setNombre(normalizarTexto(nombre));
        contacto.setEmail(normalizarEmail(email));
        contacto.setTelefono(normalizarTexto(telefono));

        return contactoRepo.save(contacto);
    }

    private Usuario obtenerOcrearUsuario(Usuario usuarioActual,
                                         Long usuarioId,
                                         String email) {
        Usuario usuario;
        String emailNormalizado = normalizarEmail(email);

        if (usuarioId != null) {
            usuario = usuarioRepo.findById(usuarioId)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        } else if (usuarioActual != null) {
            usuario = usuarioActual;
        } else {
            usuario = usuarioRepo.findByEmail(emailNormalizado)
                    .orElseGet(Usuario::new);
        }

        usuario.setEmail(emailNormalizado);

        if (usuario.getContrasenia() == null || usuario.getContrasenia().isBlank()) {
            usuario.setContrasenia(PASSWORD_TEMPORAL);
        }

        if (usuario.getRol() == null) {
            usuario.setRol(TipoRol.RESPONSABLE_TIENDA);
        }

        return usuarioRepo.save(usuario);
    }

    private void actualizarCampanias(Coordinador coordinador, List<Long> idsCampanias) {
        desasociarCampanias(coordinador);

        if (idsCampanias == null || idsCampanias.isEmpty()) {
            return;
        }

        List<Campania> campanias = campaniaRepo.findAllById(idsCampanias);

        if (coordinador.getCampanias() == null) {
            coordinador.setCampanias(new ArrayList<>());
        }

        for (Campania campania : campanias) {
            if (!coordinador.getCampanias().contains(campania)) {
                coordinador.getCampanias().add(campania);
            }

            if (campania.getCoordinadores() != null
                    && !campania.getCoordinadores().contains(coordinador)) {
                campania.getCoordinadores().add(coordinador);
            }
        }
    }

    private void desasociarCampanias(Coordinador coordinador) {
        if (coordinador.getCampanias() == null || coordinador.getCampanias().isEmpty()) {
            return;
        }

        List<Campania> campaniasActuales = new ArrayList<>(coordinador.getCampanias());

        for (Campania campania : campaniasActuales) {
            if (campania.getCoordinadores() != null) {
                campania.getCoordinadores().removeIf(c ->
                        c.getId() != null && c.getId().equals(coordinador.getId())
                );
            }
        }

        coordinador.getCampanias().clear();
    }

    private void actualizarEntidad(Coordinador coordinador, Long entidadId) {
        desasociarEntidades(coordinador);

        if (entidadId == null) {
            return;
        }

        EntidadColaboradora entidad = entidadRepo.findById(entidadId)
                .orElseThrow(() -> new RuntimeException("Entidad colaboradora no encontrada"));

        entidad.setCoordinador(coordinador);
    }

    private void desasociarEntidades(Coordinador coordinador) {
        if (coordinador.getId() == null) {
            return;
        }

        List<EntidadColaboradora> entidades = entidadRepo.findByCoordinador_Id(coordinador.getId());

        for (EntidadColaboradora entidad : entidades) {
            entidad.setCoordinador(null);
        }
    }

    private Long obtenerEntidadId(Coordinador coordinador) {
        if (coordinador.getId() == null) {
            return null;
        }

        return entidadRepo.findByCoordinador_Id(coordinador.getId())
                .stream()
                .filter(entidad -> entidad.getId() != null)
                .map(EntidadColaboradora::getId)
                .findFirst()
                .orElse(null);
    }

    private List<Long> obtenerIdsCampanias(Coordinador coordinador) {
        if (coordinador.getCampanias() == null) {
            return List.of();
        }

        return coordinador.getCampanias()
                .stream()
                .filter(campania -> campania.getId() != null)
                .map(Campania::getId)
                .toList();
    }

    private void eliminarContactoSiProcede(Contacto contacto) {
        if (contacto != null) {
            contactoRepo.delete(contacto);
        }
    }

    private void eliminarUsuarioSiProcede(Usuario usuario) {
        if (usuario != null && !repo.existsByUsuario_Id(usuario.getId())) {
            usuarioRepo.delete(usuario);
        }
    }

    private void validarFormulario(CoordinadorFormDTO dto) {
        validarDatosBasicos(
                dto,
                dto != null ? dto.getNombre() : null,
                dto != null ? dto.getEmail() : null,
                dto != null ? dto.getArea() : null,
                dto != null ? dto.getTiendas() : null
        );
    }

    private void validarDTO(CoordinadorDTO dto) {
        validarDatosBasicos(
                dto,
                dto != null ? dto.getNombre() : null,
                dto != null ? dto.getEmail() : null,
                dto != null ? dto.getArea() : null,
                dto != null ? dto.getTiendas() : null
        );
    }

    private void validarDatosBasicos(Object dto,
                                     String nombre,
                                     String email,
                                     String area,
                                     Short tiendas) {
        if (dto == null) {
            throw new RuntimeException("Los datos del coordinador son obligatorios.");
        }

        if (nombre == null || nombre.isBlank()) {
            throw new RuntimeException("El nombre del coordinador es obligatorio.");
        }

        if (email == null || email.isBlank()) {
            throw new RuntimeException("El email del coordinador es obligatorio.");
        }

        if (area == null || area.isBlank()) {
            throw new RuntimeException("El área del coordinador es obligatoria.");
        }

        if (tiendas != null && tiendas < 0) {
            throw new RuntimeException("El número de tiendas no es válido.");
        }
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