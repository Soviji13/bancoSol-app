package com.bancosol.services;

import com.bancosol.dto.ActualizarEntidadColaboradoraDTO;
import com.bancosol.entities.enums.TipoRol;
import jakarta.persistence.EntityManager;
import org.springframework.transaction.annotation.Transactional;
import com.bancosol.dao.*;
import com.bancosol.dto.EntidadColaboradoraDTO;
import com.bancosol.entities.*;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.bancosol.dto.EntidadColaboradoraDTO.ResponsableDetalleDTO;
import com.bancosol.dto.RegistroEntidadColaboradoraDTO;
import java.util.ArrayList;

import static com.bancosol.entities.enums.TipoRol.RESPONSABLE_ENTIDAD;

@Service
public class EntidadColaboradoraService {

    private final EntidadColaboradoraRepository repo;
    private final DireccionRepository direccionRepository;
    private final LocalidadRepository localidadRepository;
    private final CodigoPostalRepository codigoPostalRepository;
    private final DistritoRepository distritoRepository;
    private final ContactoRepository contactoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ResponsableEntidadRepository responsableRepo;
    private final TiendaRepository tiendaRepo;
    private final CampaniaRepository campaniaRepo;
    private final CoordinadorRepository coordinadorRepo;
    private final EntityManager entityManager;
    private final ZonaGeograficaRepository zonaRepo;

    public EntidadColaboradoraService(
            EntidadColaboradoraRepository repo,
            DireccionRepository direccionRepository,
            LocalidadRepository localidadRepository,
            CodigoPostalRepository codigoPostalRepository,
            DistritoRepository distritoRepository,
            ContactoRepository contactoRepository,
            UsuarioRepository usuarioRepository,
            ResponsableEntidadRepository responsableRepo,
            TiendaRepository tiendaRepo,
            CampaniaRepository campaniaRepo,
            CoordinadorRepository coordinadorRepo,
            ZonaGeograficaRepository zonaRepo,
            EntityManager entityManager) {
        this.repo = repo;
        this.direccionRepository = direccionRepository;
        this.localidadRepository = localidadRepository;
        this.codigoPostalRepository = codigoPostalRepository;
        this.distritoRepository = distritoRepository;
        this.contactoRepository = contactoRepository;
        this.usuarioRepository = usuarioRepository;
        this.responsableRepo = responsableRepo;
        this.tiendaRepo = tiendaRepo;
        this.campaniaRepo = campaniaRepo;
        this.coordinadorRepo = coordinadorRepo;
        this.entityManager = entityManager;
        this.zonaRepo = zonaRepo;
    }

    public List<EntidadColaboradoraDTO> listarTodas() {
        // 🌟 AÑADIMOS t.id a la query para traernos los IDs de las tiendas
        List<Object[]> asignacionesRaw = entityManager.createNativeQuery(
                        "SELECT tc.colaborador_id, tc.campania_id, t.nombre, t.id " +
                                "FROM \"Tienda_colaborador\" tc " +
                                "JOIN \"Tienda\" t ON tc.tienda_id = t.id")
                .getResultList();

        return repo.findAll().stream()
                .map(e -> {
                    Map<Long, List<String>> mapaNombres = asignacionesRaw.stream()
                            .filter(row -> ((Number) row[0]).longValue() == e.getId())
                            .collect(Collectors.groupingBy(row -> ((Number) row[1]).longValue(),
                                    Collectors.mapping(row -> (String) row[2], Collectors.toList())));

                    // 🌟 NUEVO MAPA DE IDs PARA EL FRONTEND
                    Map<Long, List<Long>> mapaIds = asignacionesRaw.stream()
                            .filter(row -> ((Number) row[0]).longValue() == e.getId())
                            .collect(Collectors.groupingBy(row -> ((Number) row[1]).longValue(),
                                    Collectors.mapping(row -> ((Number) row[3]).longValue(), Collectors.toList())));

                    EntidadColaboradoraDTO dto = toDTO(e, mapaNombres);
                    dto.setIdsTiendasPorCampania(mapaIds); // Se lo inyectamos al DTO final
                    return dto;
                }).collect(Collectors.toList());
    }

    // Modificamos el método toDTO para que reciba la matriz estructurada de tiendas
    private EntidadColaboradoraDTO toDTO(EntidadColaboradora e, Map<Long, List<String>> tiendasPorCampania) {
        // --- LÓGICA DE DIRECCIÓN --- (Mantenemos tu lógica intacta)
        String domicilioCompleto = "Sin dirección";
        String localidadNombre = "Sin localidad";
        String cpReal = "0000";
        String zonaNombre = "Sin zona";
        String distritoNombre = "";

        if (e.getDireccion() != null) {
            domicilioCompleto = e.getDireccion().getCalle() + ", " + e.getDireccion().getNumero();
            if (e.getDireccion().getLocalidad() != null) {
                localidadNombre = e.getDireccion().getLocalidad().getNombre();
                // 🌟 Extraemos la zona desde la localidad
                if (e.getDireccion().getLocalidad().getZonaGeografica() != null) {
                    zonaNombre = e.getDireccion().getLocalidad().getZonaGeografica().getNombre();
                }
            }
            if (e.getDireccion().getCodigoPostal() != null) {
                cpReal = e.getDireccion().getCodigoPostal().getCodigo().toString();
            }
            // 🌟 Extraemos el distrito si es capital
            if (e.getDireccion().getDistrito() != null) {
                distritoNombre = e.getDireccion().getDistrito().getNombre();
            }
        }

        // --- LÓGICA DE RESPONSABLES --- (Mantenemos tu lógica intacta)
        List<ResponsableDetalleDTO> listaResponsables = (e.getResponsables() == null)
                ? List.of()
                : e.getResponsables().stream()
                .map(rp -> {
                    Contacto c = rp.getContacto();
                    return ResponsableDetalleDTO.builder()
                            .nombre(c != null ? c.getNombre() : "Sin nombre")
                            .email(c != null ? c.getEmail() : "")
                            .telefono(c != null ? c.getTelefono() : "")
                            .esPrincipal(rp.getEsContactoPrincipal() != null && rp.getEsContactoPrincipal())
                            .build();
                })
                .collect(Collectors.toList());

        // --- MAPEO DE CAMPAÑAS ---
        List<String> nombresCampanias = (e.getCampanias() == null) ? List.of() :
                e.getCampanias().stream().map(Campania::getNombre).distinct().collect(Collectors.toList());

        List<Long> idsCampanias = (e.getCampanias() == null) ? List.of() :
                e.getCampanias().stream().map(Campania::getId).distinct().collect(Collectors.toList());

        // --- BUILDER ACTUALIZADO CON EL CONTEXTO ---
        return EntidadColaboradoraDTO.builder()
                .id(e.getId())
                .nombre(e.getNombre())
                .estadoActivo(e.getEstadoActivo())
                .esCapital(e.getDireccion() != null && e.getDireccion().getEsCapital())
                .observaciones(e.getObservaciones())
                .numVoluntarios(e.getNumVoluntarios())
                .domicilioCompleto(domicilioCompleto)
                .localidadNombre(localidadNombre)
                .codigoPostal(cpReal)
                .zonaNombre(zonaNombre)
                .distritoNombre(distritoNombre)
                .responsables(listaResponsables)
                .nombresCampanias(nombresCampanias)
                .idsCampanias(idsCampanias)
                // Inyectamos el mapa relacional que consumirá el front
                .tiendasPorCampania(tiendasPorCampania)
                .build();
    }

    @Transactional
    public void registrarEntidadCompleta(RegistroEntidadColaboradoraDTO dto) {

        ZonaGeografica zona = zonaRepo.buscarPorNombre(dto.getNombreZonaGeografica())
                .orElseGet(() -> {
                    ZonaGeografica nueva = new ZonaGeografica();
                    nueva.setNombre(dto.getNombreZonaGeografica());
                    return zonaRepo.save(nueva);
                });

        // --- PASO 1: LOCALIDAD ---
        // Si es nueva, le pasamos la zona que acabamos de obtener
        Localidad localidad = localidadRepository.buscarPorNombre(dto.getNombreLocalidad())
                .orElseGet(() -> {
                    Localidad n = new Localidad();
                    n.setNombre(dto.getNombreLocalidad());
                    n.setZonaGeografica(zona); // <--- VINCULACIÓN AQUÍ
                    return localidadRepository.save(n);
                });

        // --- PASO 2: CÓDIGO POSTAL ---
        Integer cpInt = Integer.parseInt(dto.getNumeroCP());
        CodigoPostal cp = codigoPostalRepository.buscarPorCodigo(cpInt)
                .orElseGet(() -> {
                    CodigoPostal n = new CodigoPostal(); n.setCodigo(cpInt.shortValue());
                    return codigoPostalRepository.save(n);
                });

        // --- PASO 3: DISTRITO Y DIRECCIÓN ---
        Distrito distrito = null;
        if (Boolean.TRUE.equals(dto.getEsCapital()) && dto.getNombreDistrito() != null) {
            distrito = distritoRepository.buscarPorNombre(dto.getNombreDistrito())
                    .orElseGet(() -> {
                        Distrito n = new Distrito(); n.setNombre(dto.getNombreDistrito());
                        return distritoRepository.save(n);
                    });
        }

        final Localidad localidadFinal = localidad;
        final CodigoPostal cpFinal = cp;
        final Distrito distritoFinal = distrito;

// 🌟 NORMALIZAMOS Y ABRAZAMOS EL FILTRO ESTRICTO DE 6 PARÁMETROS
        String calleUpper = dto.getCalle().trim().toUpperCase();
        Long cpId = cpFinal.getId();
        Long distId = (distritoFinal != null) ? distritoFinal.getId() : null;

        Direccion dir = direccionRepository.buscarDireccionExacta(
                        calleUpper,
                        dto.getNumero().shortValue(),
                        localidadFinal.getId(),
                        cpId,
                        distId,
                        dto.getEsCapital()
                )
                .orElseGet(() -> Direccion.builder()
                        .calle(calleUpper)
                        .numero(dto.getNumero().shortValue())
                        .esCapital(dto.getEsCapital())
                        .localidad(localidadFinal)
                        .codigoPostal(cpFinal)
                        .distrito(distritoFinal)
                        .build()
                );

// 🌟 CONTROL DE INTEGRIDAD PREVIO (El Guardián del Front)
        if (dir.getId() != null) {
            // Usamos el entityManager que ya tienes inyectado para ver si otra entidad ya usa esta ID de dirección
            boolean yaAsignada = !entityManager.createQuery(
                            "SELECT e FROM EntidadColaboradora e WHERE e.direccion.id = :dirId", EntidadColaboradora.class)
                    .setParameter("dirId", dir.getId())
                    .getResultList().isEmpty();

            if (yaAsignada) {
                throw new IllegalArgumentException("No puedes añadir esta entidad colaboradora porque la dirección a la que la has asociado ya existe");
            }
        }

        // Si pasa el control, guardamos la dirección normalmente y continuamos
        dir = direccionRepository.save(dir);

        // --- PASO 2: ENTIDAD COLABORADORA ---

        // NUEVO: Buscar al coordinador real
        Coordinador coordinador = coordinadorRepo.findById(dto.getIdCoordinador())
                .orElseThrow(() -> new RuntimeException("El coordinador seleccionado no existe"));

        EntidadColaboradora entidad = EntidadColaboradora.builder()
                .nombre(dto.getNombre())
                .estadoActivo(dto.getEstadoActivo() != null ? dto.getEstadoActivo() : false)
                .observaciones(dto.getObservaciones())
                .direccion(dir)
                .numVoluntarios((short) 0)
                .coordinador(coordinador)
                .tiendas(new ArrayList<>())
                .campanias(new ArrayList<>())
                .numTiendas((short) 0)
                .numTurnos((short) 0)
                .build();

        // Guardamos la entidad para tener su ID generado
        final EntidadColaboradora entidadGuardada = repo.save(entidad);

        // --- PASO 2.5: ASIGNACIÓN DE TIENDAS Y CAMPAÑAS (Triple Unión) ---
        if (dto.getIdsCampanias() != null) {
            for (Long campId : dto.getIdsCampanias()) {
                entityManager.createNativeQuery(
                                "INSERT INTO \"Colaborador_campania\" (entidad_id, campania_id, participa) VALUES (?, ?, ?)")
                        .setParameter(1, entidadGuardada.getId()) // Usa entidadGuardada.getId() si estás en registrarEntidad
                        .setParameter(2, campId)
                        .setParameter(3, true)
                        .executeUpdate();

                // 🌟 LEEMOS DEL MAPA EXCLUSIVO DE ESTA CAMPAÑA
                if (dto.getTiendasPorCampania() != null && dto.getTiendasPorCampania().containsKey(campId)) {
                    for (Long tiendaId : dto.getTiendasPorCampania().get(campId)) {
                        entityManager.createNativeQuery(
                                        "INSERT INTO \"Tienda_colaborador\" (colaborador_id, tienda_id, campania_id) VALUES (?, ?, ?)")
                                .setParameter(1, entidadGuardada.getId()) // Igual, entidadGuardada.getId() en registrar
                                .setParameter(2, tiendaId)
                                .setParameter(3, campId)
                                .executeUpdate();
                    }
                }
            }
        }

        // --- PASO 3: RESPONSABLES (El Bucle Mágico) ---
        if (dto.getResponsables() != null) {
            for (var rDto : dto.getResponsables()) {
                // A. Crear el Contacto
                Contacto contacto = new Contacto();
                contacto.setNombre(rDto.getNombre());
                contacto.setEmail(rDto.getEmail());
                contacto.setTelefono(rDto.getTelefono());
                contacto = contactoRepository.save(contacto);

                // B. Crear el Usuario
                Usuario usuario = new Usuario();
                usuario.setEmail(rDto.getUsername());
                usuario.setContrasenia(rDto.getPassword()); // ¡Ojo! Aquí deberías usar un Encoder en el futuro
                usuario.setRol(RESPONSABLE_ENTIDAD);
                usuario = usuarioRepository.save(usuario);

                // C. Crear la relación ResponsableEntidad
                ResponsableEntidad re = new ResponsableEntidad();
                re.setColaborador(entidadGuardada); // Enlazamos con la entidad
                re.setContacto(contacto);           // Enlazamos con el contacto
                re.setUsuario(usuario);             // Enlazamos con el usuario
                re.setEsContactoPrincipal(rDto.getEsPrincipal());

                responsableRepo.save(re);
            }
        }
    }

    @Transactional
    public void eliminarEntidadCompleta(Long idEntidad) {
        // 1. Buscamos la entidad para tener acceso a sus hijos
        EntidadColaboradora entidad = repo.findById(idEntidad)
                .orElseThrow(() -> new RuntimeException("Entidad no encontrada"));

        // 2. Limpiamos las tablas intermedias M:M (SQL Nativo)
        // Borramos los registros donde participe esta entidad, pero NO borramos las tiendas ni campañas
        entityManager.createNativeQuery("DELETE FROM \"Tienda_colaborador\" WHERE colaborador_id = ?")
                .setParameter(1, idEntidad).executeUpdate();

        entityManager.createNativeQuery("DELETE FROM \"Colaborador_campania\" WHERE entidad_id = ?")
                .setParameter(1, idEntidad).executeUpdate();

        // 3. Borramos los Responsables y sus datos sensibles (Usuario y Contacto)
        if (entidad.getResponsables() != null) {
            for (ResponsableEntidad re : entidad.getResponsables()) {
                Usuario user = re.getUsuario();
                Contacto cont = re.getContacto();

                // Borramos primero la relación
                responsableRepo.delete(re);

                // Borramos el usuario y el contacto asociados a ese responsable
                if (user != null) usuarioRepository.delete(user);
                if (cont != null) contactoRepository.delete(cont);
            }
        }

        // 4. Borramos la Entidad
        repo.delete(entidad);

        // 5. Por último, borramos la Dirección (si no la comparte nadie más)
        if (entidad.getDireccion() != null) {
            direccionRepository.delete(entidad.getDireccion());
        }
    }

    @Transactional
    public void actualizarEntidadCompleta(Long idEntidad, ActualizarEntidadColaboradoraDTO dto) {
        // 1. Recuperamos la entidad (Variable final para que las lambdas no fallen)
        final EntidadColaboradora entidad = repo.findById(idEntidad)
                .orElseThrow(() -> new RuntimeException("Entidad no encontrada"));

        // NORMALIZACIÓN A MAYÚSCULAS
        entidad.setNombre(dto.getNombre().trim().toUpperCase());
        entidad.setEstadoActivo(dto.getEstadoActivo());
        entidad.setObservaciones(dto.getObservaciones());

        // --- 2. DIRECCIÓN (Con variables final para lambdas) ---
        final Direccion direccionAntigua = entidad.getDireccion();

        String calleUpper = dto.getCalle().trim().toUpperCase();
        String locUpper = dto.getNombreLocalidad().trim().toUpperCase();

        ZonaGeografica zonaTmp = null;
        if (dto.getNombreZonaGeografica() != null && !dto.getNombreZonaGeografica().isBlank()) {
            final String zonaUpper = dto.getNombreZonaGeografica().trim().toUpperCase();
            zonaTmp = zonaRepo.buscarPorNombre(zonaUpper)
                    .orElseGet(() -> {
                        ZonaGeografica z = new ZonaGeografica();
                        z.setNombre(zonaUpper);
                        return zonaRepo.save(z);
                    });
        }
        final ZonaGeografica zonaFinal = zonaTmp;

        final Localidad localidadFinal = localidadRepository.buscarPorNombre(locUpper)
                .orElseGet(() -> {
                    Localidad l = new Localidad();
                    l.setNombre(locUpper);
                    l.setZonaGeografica(zonaFinal);
                    return localidadRepository.save(l);
                });

        final Integer cpInt = Integer.parseInt(dto.getNumeroCP());
        final CodigoPostal cpFinal = codigoPostalRepository.buscarPorCodigo(cpInt)
                .orElseGet(() -> {
                    CodigoPostal n = new CodigoPostal();
                    n.setCodigo(cpInt.shortValue());
                    return codigoPostalRepository.save(n);
                });

        Distrito distTmp = null;
        if (Boolean.TRUE.equals(dto.getEsCapital()) && dto.getNombreDistrito() != null) {
            final String distNombreUpper = dto.getNombreDistrito().trim().toUpperCase();
            distTmp = distritoRepository.buscarPorNombre(distNombreUpper)
                    .orElseGet(() -> {
                        Distrito d = new Distrito();
                        d.setNombre(distNombreUpper);
                        return distritoRepository.save(d);
                    });
        }
        final Distrito distritoFinal = distTmp;

        // 4. Buscar o crear la dirección nueva
        // --- 4. Buscar o crear la dirección nueva (VINCULANDO EL CP) ---
        // Usamos los IDs de todo lo que acabamos de resolver (localidad, cp, distrito)
        final Long cpId = cpFinal.getId();
        final Long distId = (distritoFinal != null) ? distritoFinal.getId() : null;

        // --- 4. Buscar o crear la dirección nueva (VINCULACIÓN TOTAL) ---

        Direccion direccionNueva = direccionRepository.buscarDireccionExacta(
                        calleUpper,
                        dto.getNumero().shortValue(),
                        localidadFinal.getId(),
                        cpId,
                        distId,
                        dto.getEsCapital() // <--- Pasamos el boolean a la búsqueda
                )
                .orElseGet(() -> {
                    // Si no existe, creamos el "pack" completo
                    Direccion d = Direccion.builder()
                            .calle(calleUpper)
                            .numero(dto.getNumero().shortValue())
                            .localidad(localidadFinal)   // Vínculo con Localidad
                            .codigoPostal(cpFinal)       // Vínculo con CP
                            .distrito(distritoFinal)     // Vínculo con Distrito (puede ser null)
                            .esCapital(dto.getEsCapital())
                            .build();
                    return direccionRepository.save(d);
                });

        // 5. Actualizar el vínculo en la entidad
        if (direccionAntigua == null || !direccionAntigua.getId().equals(direccionNueva.getId())) {
            entidad.setDireccion(direccionNueva);
            repo.save(entidad);

            // Si la dirección antigua ya no la usa nadie, la borramos para no dejar basura
            if (direccionAntigua != null && repo.countByDireccion(direccionAntigua) == 0) {
                direccionRepository.delete(direccionAntigua);
            }
        }

        // --- 2. RELACIONES M:M (Igual que antes) ---
        entityManager.createNativeQuery("DELETE FROM \"Tienda_colaborador\" WHERE colaborador_id = ?").setParameter(1, idEntidad).executeUpdate();
        entityManager.createNativeQuery("DELETE FROM \"Colaborador_campania\" WHERE entidad_id = ?").setParameter(1, idEntidad).executeUpdate();

        if (dto.getIdsCampanias() != null) {
            for (Long campId : dto.getIdsCampanias()) {
                entityManager.createNativeQuery(
                                "INSERT INTO \"Colaborador_campania\" (entidad_id, campania_id, participa) VALUES (?, ?, ?)")
                        .setParameter(1, idEntidad) // Usa entidadGuardada.getId() si estás en registrarEntidad
                        .setParameter(2, campId)
                        .setParameter(3, true)
                        .executeUpdate();

                // 🌟 LEEMOS DEL MAPA EXCLUSIVO DE ESTA CAMPAÑA
                if (dto.getTiendasPorCampania() != null && dto.getTiendasPorCampania().containsKey(campId)) {
                    for (Long tiendaId : dto.getTiendasPorCampania().get(campId)) {
                        entityManager.createNativeQuery(
                                        "INSERT INTO \"Tienda_colaborador\" (colaborador_id, tienda_id, campania_id) VALUES (?, ?, ?)")
                                .setParameter(1, idEntidad) // Igual, entidadGuardada.getId() en registrar
                                .setParameter(2, tiendaId)
                                .setParameter(3, campId)
                                .executeUpdate();
                    }
                }
            }
        }


        // --- 3. RESPONSABLES: SINCRONIZACIÓN INTELIGENTE POR POSICIÓN E INTEGRIDAD DE LOGIN ---
        final List<ResponsableEntidad> antiguos = new ArrayList<>(entidad.getResponsables());
        final List<ResponsableEntidad> procesados = new ArrayList<>();

        // Recopilamos los IDs de los contactos actuales para las validaciones cruzadas de la propia entidad
        final List<Long> misContactoIds = entidad.getResponsables().stream()
                .map(re -> re.getContacto() != null ? re.getContacto().getId() : null)
                .filter(id -> id != null)
                .collect(Collectors.toList());

        if (dto.getResponsables() != null) {
            for (int i = 0; i < dto.getResponsables().size(); i++) {
                var rDto = dto.getResponsables().get(i);
                String emailUpper = rDto.getEmail().trim().toUpperCase();
                String telTrim = rDto.getTelefono() != null ? rDto.getTelefono().trim() : "";

                // 1. Resolvemos las instancias por índice de posición primero
                ResponsableEntidad re;
                Contacto contactoTmp;
                Usuario usuarioTmp;

                if (i < antiguos.size()) {
                    re = antiguos.get(i);
                    contactoTmp = re.getContacto() != null ? re.getContacto() : new Contacto();
                    usuarioTmp = re.getUsuario() != null ? re.getUsuario() : new Usuario();
                } else {
                    re = new ResponsableEntidad();
                    re.setColaborador(entidad);
                    contactoTmp = new Contacto();
                    usuarioTmp = new Usuario();
                    usuarioTmp.setRol(TipoRol.RESPONSABLE_ENTIDAD);
                    usuarioTmp.setContrasenia("BANCOSOL2026");
                }

                // 🌟 LÓGICA DE LOGIN INTEGRAL: Calculamos el nombre de usuario base deseado
                String userUpper = (rDto.getUsername() != null && !rDto.getUsername().isBlank())
                        ? rDto.getUsername().trim().toUpperCase()
                        : (usuarioTmp.getEmail() != null && !usuarioTmp.getEmail().isBlank()
                        ? usuarioTmp.getEmail().trim().toUpperCase()
                        : emailUpper);

                // 🌟 EL DESEMPATE ABSOLUTO: Si el username automático pertenece a otra cuenta externa,
                // le inyectamos el sufijo del ID de forma reactiva para que la edición pase limpia como el agua.
                if (rDto.getUsername() == null || rDto.getUsername().isBlank()) {
                    List<Usuario> coincidenciaGlobal = entityManager.createQuery(
                                    "SELECT u FROM Usuario u WHERE UPPER(u.email) = :email", Usuario.class)
                            .setParameter("email", userUpper)
                            .getResultList();

                    boolean esDeOtroCentro = coincidenciaGlobal.stream()
                            .anyMatch(u -> usuarioTmp.getId() == null || !u.getId().equals(usuarioTmp.getId()));

                    if (esDeOtroCentro) {
                        userUpper = userUpper + "_" + entidad.getId();
                    }
                }

                // 🌟 A. VALIDACIÓN DE TELÉFONO AUTO-EXCLUYENTE POR EQUIPO
                if (!telTrim.isBlank()) {
                    List<Contacto> listaConTel = entityManager.createQuery(
                                    "SELECT c FROM Contacto c WHERE c.telefono = :tel", Contacto.class)
                            .setParameter("tel", telTrim)
                            .getResultList();

                    boolean telExistePorOtro = listaConTel.stream()
                            .anyMatch(c -> !misContactoIds.contains(c.getId()));

                    if (telExistePorOtro) {
                        throw new IllegalArgumentException("El teléfono " + rDto.getTelefono() + " ya existe");
                    }
                }

                // 🌟 B. VALIDACIÓN DE EMAIL DE CONTACTO AUTO-EXCLUYENTE POR EQUIPO
                if (!emailUpper.isBlank()) {
                    List<Contacto> listaConEmail = entityManager.createQuery(
                                    "SELECT c FROM Contacto c WHERE UPPER(c.email) = :email", Contacto.class)
                            .setParameter("email", emailUpper)
                            .getResultList();

                    boolean emailExistePorOtro = listaConEmail.stream()
                            .anyMatch(c -> !misContactoIds.contains(c.getId()));

                    if (emailExistePorOtro) {
                        throw new IllegalArgumentException("El correo " + rDto.getEmail() + " ya existe");
                    }
                }

                // 🌟 C. GUARDIÁN FINAL DE SEGURIDAD ESTRICTA (Evita brechas de claves duplicadas)
                if (!userUpper.isBlank()) {
                    List<Usuario> usuariosConMismoEmail = entityManager.createQuery(
                                    "SELECT u FROM Usuario u WHERE UPPER(u.email) = :email", Usuario.class)
                            .setParameter("email", userUpper)
                            .getResultList();

                    boolean yaExisteParaOtro = usuariosConMismoEmail.stream()
                            .anyMatch(u -> usuarioTmp.getId() == null || !u.getId().equals(usuarioTmp.getId()));

                    if (yaExisteParaOtro) {
                        throw new IllegalArgumentException("El nombre de usuario/correo " + userUpper + " ya está registrado por otra cuenta en el sistema");
                    }
                }

                // Guardamos los datos directamente en el contacto asociado
                contactoTmp.setNombre(rDto.getNombre().trim().toUpperCase());
                contactoTmp.setEmail(emailUpper);
                contactoTmp.setTelefono(telTrim.isBlank() ? null : telTrim);
                final Contacto contactoFinal = contactoRepository.save(contactoTmp);

                // Guardamos los datos directamente en el usuario asociado
                usuarioTmp.setEmail(userUpper);
                if (rDto.getPassword() != null && !rDto.getPassword().isEmpty()) {
                    usuarioTmp.setContrasenia(rDto.getPassword());
                }
                final Usuario usuarioFinal = usuarioRepository.save(usuarioTmp);

                // Enlazamos las referencias cruzadas finales de la relación
                re.setContacto(contactoFinal);
                re.setUsuario(usuarioFinal);
                re.setEsContactoPrincipal(rDto.getEsPrincipal());

                procesados.add(responsableRepo.save(re));
            }
        }

        // --- 4. GESTIÓN DE ELIMINADOS Y VOLUNTARIOS ---
        // Buscamos un heredero entre los que SÍ se quedan
        final ResponsableEntidad heredero = procesados.stream()
                .filter(ResponsableEntidad::getEsContactoPrincipal)
                .findFirst()
                .orElse(procesados.isEmpty() ? null : procesados.get(0));

        for (ResponsableEntidad antiguo : antiguos) {
            // Si el antiguo no está en la lista de procesados, es que el usuario lo borró en el front
            if (!procesados.contains(antiguo)) {
                if (heredero != null) {
                    // Movemos sus voluntarios al responsable que se queda
                    entityManager.createNativeQuery(
                                    "UPDATE \"Voluntario\" SET responsable_entidad_id = ? WHERE responsable_entidad_id = ?")
                            .setParameter(1, heredero.getId())
                            .setParameter(2, antiguo.getId())
                            .executeUpdate();
                }
                entidad.getResponsables().remove(antiguo);
                responsableRepo.delete(antiguo);
            }
        }
        // ¡FIN! No añadas nada más después de esta llave.
    }
}