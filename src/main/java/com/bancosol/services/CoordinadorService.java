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
import com.bancosol.mapper.CampaniaMapper;
import com.bancosol.mapper.CoordinadorMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

// Sofía
import java.util.Map;
import com.bancosol.dto.TiendaDTO;
import com.bancosol.dto.CampaniaDTO;
import com.bancosol.services.TiendaService;

@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class CoordinadorService {

    private static final String PASSWORD_TEMPORAL = "changeme";

    private final CoordinadorRepository coordinadorRepository;
    private final ContactoRepository contactoRepository;
    private final EntidadColaboradoraRepository entidadRepository;
    private final UsuarioRepository usuarioRepository;
    private final CampaniaRepository campaniaRepository;
    private final CoordinadorMapper coordinadorMapper;

    private final CampaniaService campaniaService; // Sofía
    private final TiendaService tiendaService;

    public List<CoordinadorDTO> listarTodos() {
        return coordinadorRepository.findAll()
                .stream()
                .map(this::convertirAListado)
                .toList();
    }

    public CoordinadorDTO findById(Long id) {
        if (id == null) {
            return null;
        }

        return coordinadorRepository.findById(id)
                .map(this::convertirAListado)
                .orElse(null);
    }

    public List<CoordinadorDTO> findAllById(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }

        return coordinadorRepository.findAllById(ids)
                .stream()
                .map(this::convertirAListado)
                .toList();
    }

    public CoordinadorFormDTO buscarFormularioPorId(Long id) {
        Coordinador coordinador = buscarCoordinadorPorId(id);

        return convertirAFormulario(coordinador);
    }

    @Transactional
    public Long crear(CoordinadorFormDTO dto) {
        validarFormulario(dto);

        Coordinador coordinador = new Coordinador();

        cargarDatosBasicos(coordinador, dto);
        cargarContacto(coordinador, dto);
        cargarUsuario(coordinador, dto);

        Coordinador coordinadorGuardado = coordinadorRepository.save(coordinador);

        actualizarCampanias(coordinadorGuardado, dto.getIdsCampanias());
        actualizarEntidad(coordinadorGuardado, dto.getEntidadId());

        return coordinadorGuardado.getId();
    }

    @Transactional
    public Long actualizar(Long id, CoordinadorFormDTO dto) {
        validarFormulario(dto);

        Coordinador coordinador = buscarCoordinadorPorId(id);

        cargarDatosBasicos(coordinador, dto);
        cargarContacto(coordinador, dto);
        cargarUsuario(coordinador, dto);

        actualizarCampanias(coordinador, dto.getIdsCampanias());
        actualizarEntidad(coordinador, dto.getEntidadId());

        /*
         * No llamamos a save().
         * El coordinador ya está gestionado por JPA dentro de la transacción.
         */
        return coordinador.getId();
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
        if (id == null) {
            return;
        }

        Coordinador coordinador = coordinadorRepository.findById(id).orElse(null);

        if (coordinador == null) {
            return;
        }

        Contacto contacto = coordinador.getContacto();
        Usuario usuario = coordinador.getUsuario();

        desasociarEntidades(coordinador);
        desasociarCampanias(coordinador);

        coordinadorRepository.delete(coordinador);
        coordinadorRepository.flush();

        eliminarContactoSiProcede(contacto);
        eliminarUsuarioSiProcede(usuario);
    }

    private Coordinador buscarCoordinadorPorId(Long id) {
        validarId(id, "coordinador");

        return coordinadorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "No existe el coordinador con id: " + id
                ));
    }

    private CoordinadorDTO convertirAListado(Coordinador coordinador) {
        CoordinadorDTO dto = coordinadorMapper.toDTO(coordinador);

        if (dto == null) {
            return null;
        }

        dto.setEntidadId(obtenerEntidadId(coordinador));

        return dto;
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

    private void cargarDatosBasicos(Coordinador coordinador, CoordinadorFormDTO dto) {
        coordinador.setArea(normalizarTextoObligatorio(dto.getArea(), "área"));
        coordinador.setTiendas(obtenerTiendas(dto));
        coordinador.setPermisoModificar(Boolean.TRUE.equals(dto.getPermisoModificar()));
    }

    private void cargarContacto(Coordinador coordinador, CoordinadorFormDTO dto) {
        Contacto contacto = obtenerContacto(
                coordinador.getContacto(),
                dto.getContactoId()
        );

        contacto.setNombre(normalizarTextoObligatorio(dto.getNombre(), "nombre"));
        contacto.setEmail(normalizarEmailObligatorio(dto.getEmail()));
        contacto.setTelefono(normalizarTextoOpcional(dto.getTelefono()));

        coordinador.setContacto(contactoRepository.save(contacto));
    }

    private void cargarUsuario(Coordinador coordinador, CoordinadorFormDTO dto) {
        String emailNormalizado = normalizarEmailObligatorio(dto.getEmail());

        Usuario usuario = obtenerUsuario(
                coordinador.getUsuario(),
                dto.getUsuarioId(),
                emailNormalizado
        );

        usuario.setEmail(emailNormalizado);

        if (!tieneTexto(usuario.getContrasenia())) {
            usuario.setContrasenia(PASSWORD_TEMPORAL);
        }

        if (usuario.getRol() == null) {
            usuario.setRol(TipoRol.RESPONSABLE_TIENDA);
        }

        coordinador.setUsuario(usuarioRepository.save(usuario));
    }

    private Contacto obtenerContacto(Contacto contactoActual, Long contactoId) {
        if (contactoId != null) {
            return contactoRepository.findById(contactoId)
                    .orElseThrow(() -> new EntityNotFoundException(
                            "No existe el contacto con id: " + contactoId
                    ));
        }

        if (contactoActual != null) {
            return contactoActual;
        }

        return new Contacto();
    }

    private Usuario obtenerUsuario(Usuario usuarioActual, Long usuarioId, String email) {
        if (usuarioId != null) {
            return usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new EntityNotFoundException(
                            "No existe el usuario con id: " + usuarioId
                    ));
        }

        if (usuarioActual != null) {
            return usuarioActual;
        }

        return usuarioRepository.findByEmail(email)
                .orElseGet(Usuario::new);
    }

    private void actualizarCampanias(Coordinador coordinador, List<Long> idsCampanias) {
        desasociarCampanias(coordinador);

        if (idsCampanias == null || idsCampanias.isEmpty()) {
            return;
        }

        List<Campania> campanias = campaniaRepository.findAllById(idsCampanias);

        if (coordinador.getCampanias() == null) {
            coordinador.setCampanias(new ArrayList<>());
        }

        for (Campania campania : campanias) {
            asociarCampania(coordinador, campania);
        }
    }

    private void asociarCampania(Coordinador coordinador, Campania campania) {
        if (!coordinador.getCampanias().contains(campania)) {
            coordinador.getCampanias().add(campania);
        }

        if (campania.getCoordinadores() != null
                && !campania.getCoordinadores().contains(coordinador)) {
            campania.getCoordinadores().add(coordinador);
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

        EntidadColaboradora entidad = entidadRepository.findById(entidadId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "No existe la entidad colaboradora con id: " + entidadId
                ));

        entidad.setCoordinador(coordinador);
    }

    private void desasociarEntidades(Coordinador coordinador) {
        if (coordinador.getId() == null) {
            return;
        }

        List<EntidadColaboradora> entidades = entidadRepository.findByCoordinador_Id(coordinador.getId());

        for (EntidadColaboradora entidad : entidades) {
            entidad.setCoordinador(null);
        }
    }

    private Long obtenerEntidadId(Coordinador coordinador) {
        if (coordinador == null || coordinador.getId() == null) {
            return null;
        }

        return entidadRepository.findByCoordinador_Id(coordinador.getId())
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
            contactoRepository.delete(contacto);
        }
    }

    private void eliminarUsuarioSiProcede(Usuario usuario) {
        if (usuario != null && !coordinadorRepository.existsByUsuario_Id(usuario.getId())) {
            usuarioRepository.delete(usuario);
        }
    }

    private void validarFormulario(CoordinadorFormDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Los datos del coordinador son obligatorios.");
        }

        validarDatosBasicos(
                dto.getNombre(),
                dto.getEmail(),
                dto.getArea(),
                dto.getTiendas()
        );
    }

    private void validarDTO(CoordinadorDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Los datos del coordinador son obligatorios.");
        }

        validarDatosBasicos(
                dto.getNombre(),
                dto.getEmail(),
                dto.getArea(),
                dto.getTiendas()
        );
    }

    private void validarDatosBasicos(String nombre,
                                     String email,
                                     String area,
                                     Short tiendas) {
        validarTextoObligatorio(nombre, "nombre");
        validarTextoObligatorio(email, "email");
        validarTextoObligatorio(area, "área");

        if (tiendas != null && tiendas < 0) {
            throw new IllegalArgumentException("El número de tiendas no es válido.");
        }
    }

    private void validarId(Long id, String nombreCampo) {
        if (id == null) {
            throw new IllegalArgumentException("El id de " + nombreCampo + " es obligatorio.");
        }

        if (id <= 0) {
            throw new IllegalArgumentException("El id de " + nombreCampo + " no es válido: " + id);
        }
    }

    private void validarTextoObligatorio(String texto, String nombreCampo) {
        if (!tieneTexto(texto)) {
            throw new IllegalArgumentException("El campo " + nombreCampo + " es obligatorio.");
        }
    }

    private Short obtenerTiendas(CoordinadorFormDTO dto) {
        if (dto.getTiendas() == null) {
            return 0;
        }

        return dto.getTiendas();
    }

    private String normalizarTextoObligatorio(String texto, String nombreCampo) {
        validarTextoObligatorio(texto, nombreCampo);
        return texto.trim();
    }

    private String normalizarTextoOpcional(String texto) {
        if (!tieneTexto(texto)) {
            return null;
        }

        return texto.trim();
    }

    private String normalizarEmailObligatorio(String email) {
        validarTextoObligatorio(email, "email");
        return email.trim().toLowerCase();
    }

    private boolean tieneTexto(String texto) {
        return texto != null && !texto.isBlank();
    }

    // Añado código Sofía Si Villalba Jiménez (0% IA generativa) --------------------------

    // He decidido reusar código de mi compañero, y no romperle ninguna funcionalidad en el resto de capas
    // para asegurar de que su parte vaya bien

    // Obtiene campañas con tiendas de la entidad correspondiente
    public Map<CampaniaDTO, List<TiendaDTO>> obtenerCampaniasConTiendas (Long coordinadorId) {

        Map <CampaniaDTO, List<TiendaDTO>> campaniasConTienda = new HashMap<>();

        // Obtenemos el coordinador correspondiente
        Coordinador coordinador = this.coordinadorRepository.findById(coordinadorId).get();

        // Obtenemos los Ids de sus campañas
        List <Long> idCampaniasCoordinador = obtenerIdsCampanias(coordinador);

        // Obtenemos todas las campañas
        List <CampaniaDTO> campaniasCoordinador = this.campaniaService.findAllById(idCampaniasCoordinador);

        // Pasamos por cada campaña, obteniendo además cada tienda de la campaña
        for (CampaniaDTO c : campaniasCoordinador) {
            List<TiendaDTO> tiendasCampania = this.tiendaService.findAllById(c.getIdsTiendas());

            campaniasConTienda.put(c, tiendasCampania);
        }

        return campaniasConTienda;

    }
}