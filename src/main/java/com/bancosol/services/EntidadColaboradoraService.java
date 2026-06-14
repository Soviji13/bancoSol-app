package com.bancosol.services;

import com.bancosol.dao.CampaniaRepository;
import com.bancosol.dao.CodigoPostalRepository;
import com.bancosol.dao.ContactoRepository;
import com.bancosol.dao.CoordinadorRepository;
import com.bancosol.dao.DireccionRepository;
import com.bancosol.dao.DistritoRepository;
import com.bancosol.dao.EntidadColaboradoraRepository;
import com.bancosol.dao.LocalidadRepository;
import com.bancosol.dao.ResponsableEntidadRepository;
import com.bancosol.dao.TiendaColaboradorRepository;

import com.bancosol.dao.TiendaRepository;
import com.bancosol.dao.UsuarioRepository;
import com.bancosol.dto.CampaniaDTO;
import com.bancosol.dto.EntidadColaboradoraDTO;
import com.bancosol.dto.TiendaDTO;
import com.bancosol.dto.actualizacionEntidad.ActualizacionEntidadDTO;
import com.bancosol.dto.actualizacionEntidad.ResponsableActualizadoDTO;
import com.bancosol.dto.registroEntidad.CampaniaRegistroDTO;
import com.bancosol.dto.registroEntidad.RegistroEntidadDTO;
import com.bancosol.dto.registroEntidad.ResponsableDTO;

import com.bancosol.entities.CodigoPostal;
import com.bancosol.entities.Contacto;
import com.bancosol.entities.Coordinador;
import com.bancosol.entities.Direccion;
import com.bancosol.entities.Distrito;
import com.bancosol.entities.EntidadColaboradora;
import com.bancosol.entities.Localidad;
import com.bancosol.entities.ResponsableEntidad;
import com.bancosol.entities.Tienda;
import com.bancosol.entities.Campania;
// Intentar no hacerlo
import com.bancosol.entities.TiendaColaborador;
import com.bancosol.entities.Usuario;
import com.bancosol.entities.enums.TipoRol;
import com.bancosol.mapper.CampaniaMapper;
import com.bancosol.mapper.EntidadColaboradoraMapper;
import com.bancosol.mapper.TiendaMapper;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class EntidadColaboradoraService {

    // Refactorización de Sofía (IA para acceso a tabla de triple entidad SOLO DONDE
    // SE INDICA)

    // MOSTRAR INFO
    // ----------------------------------------------------------------------------------------

    private final TiendaRepository tiendaRepository;
    private final ResponsableEntidadRepository responsableEntidadRepository;
    private final UsuarioRepository usuarioRepository;
    private final ContactoRepository contactoRepository;
    private final DireccionRepository direccionRepository;
    private final EntidadColaboradoraRepository entidadRepo;
    private final TiendaColaboradorRepository tiendaColabRepo;
    private final CoordinadorRepository coordinadorRepository;
    private final LocalidadRepository localidadRepository;
    private final CodigoPostalRepository codigoPostalRepository;
    private final DistritoRepository distritoRepository;
    private final CampaniaRepository campaniaRepository;

    private final EntidadColaboradoraMapper entidadMapper;
    private final TiendaMapper tiendaMapper;
    private final CampaniaMapper campaniaMapper;

    private final CampaniaService campaniaService;

    public List<EntidadColaboradoraDTO> listarTodas() {
        return entidadMapper.toDTOList(entidadRepo.findAll());
    }

    public EntidadColaboradoraDTO findById(Long id) {
        return entidadMapper.toDTO(entidadRepo.findById(id).orElse(null));
    }

    // Devuelve todas las que se encuentren en el Array de Ids
    public List<EntidadColaboradoraDTO> findAllById(List<Long> ids) {
        return entidadMapper.toDTOList(entidadRepo.findAllById(ids));
    }

    // Uso de IA aquí (como ayuda)
    // Devuelve las de una campaña específica con sus tiendas únicamente respectivas
    // Única función que le añade al DTO las tiendas asignadas
    public List<EntidadColaboradoraDTO> findAllByCampaniaId(Long campaniaId) {

        // Se obtiene la tabla intermedia
        List<TiendaColaborador> tiendasConColaboradorEnCampania = this.tiendaColabRepo
                .findTiendaColabByCampaniaId(campaniaId);

        List<EntidadColaboradoraDTO> entidadesConTiendas =
                // Recorremos la tabla intermedia
                tiendasConColaboradorEnCampania.stream()
                        // Se agrupan dependiendo del colaborador (clave colaborador, valor tabla
                        // intermedia)
                        .collect(Collectors.groupingBy(TiendaColaborador::getColaborador))
                        .entrySet().stream()
                        // Recorremos cada entidad colaboradora
                        .map(e -> {

                            // Obtenemos el colaborador con e.getKey
                            // Obtenemos la tabla intermedia con e.getValue()

                            // Pasamos casi todos los parámetros a DTO
                            EntidadColaboradoraDTO dto = entidadMapper.toDTO(e.getKey());

                            // Pasamos las tiendas correspondientes
                            List<String> nombresTiendas = e.getValue().stream()
                                    .map(tc -> tc.getTienda().getNombre())
                                    .distinct()
                                    .collect(Collectors.toList());

                            dto.setNombresTiendas(nombresTiendas);

                            return dto;
                        })
                        .collect(Collectors.toList());

        return entidadesConTiendas;
    }

    // Ayuda de la IA para filtrar, razonamiento mío
    // Devuelve una entidad específica con sus tiendas asignadas a esa campaña por
    // el ID de la entidad
    public EntidadColaboradoraDTO findByCampaniaId(Long campaniaId, Long entidadId) {

        // Se obtiene la tabla intermedia
        List<TiendaColaborador> tiendasConColaboradorEnCampania = this.tiendaColabRepo
                .findTiendaColabByCampaniaId(campaniaId);

        // Se filtran solo las que el id del colaborador coincide con entidadId
        List<TiendaColaborador> tiendasEntidadFiltrada = tiendasConColaboradorEnCampania.stream()
                .filter(tiendaColab -> tiendaColab.getColaborador().getId().equals(entidadId))
                .collect(Collectors.toList());

        // Obtenemos una entidad de las filtradas, p.e la primera (todas son la misma)
        // La pasamos ya a DTO
        EntidadColaboradoraDTO dto = entidadMapper.toDTO(
                tiendasEntidadFiltrada.get(0).getColaborador());

        // Le añadimos las tiendas
        List<String> nombresTiendas = tiendasEntidadFiltrada.stream()
                .map(tc -> tc.getTienda().getNombre())
                .distinct()
                .collect(Collectors.toList());

        dto.setNombresTiendas(nombresTiendas);

        return dto;
    }

    // Devuelve todos las tiendas de la entidad colaboradora
    public List<TiendaDTO> devolverTodasLasTiendas(Long entidadId) {

        List<TiendaColaborador> todasTiendasEntidad = this.tiendaColabRepo.findByColaboradorId(entidadId);

        return todasTiendasEntidad.stream()
                .map(tc -> this.tiendaMapper.toDTO(tc.getTienda()))
                .distinct()
                .collect(Collectors.toList());
    }

    // Devuelve las campañas de la entidad colaboradora
    public List<CampaniaDTO> devolverTodasLasCampanias(Long entidadId) {

        List<TiendaColaborador> todasTiendasEntidad = this.tiendaColabRepo.findByColaboradorId(entidadId);

        return todasTiendasEntidad.stream()
                .map(tc -> this.campaniaMapper.toDTO(tc.getCampania()))
                .distinct()
                .collect(Collectors.toList());
    }

    // Devuelve todos los nombres de tiendas de la entidad colaboradora y de la
    // campaña concreta
    public List<TiendaDTO> devolverTiendasPorCampania(Long entidadId, Long campaniaId) {

        List<TiendaColaborador> todasTiendasEntidad = this.tiendaColabRepo.findByColaboradorId(entidadId);

        return todasTiendasEntidad.stream()
                .filter(tc -> tc.getColaborador().getId().equals(entidadId)
                        && tc.getCampania().getId().equals(campaniaId))
                .map(tc -> this.tiendaMapper.toDTO(tc.getTienda()))
                .distinct()
                .collect(Collectors.toList());
    }

    // Devuelve todas las campañas en las que participa junto a todas sus tiendas
    public Map<Long, List<TiendaDTO>> devolverCampaniasConTodasTiendas(Long entidadId) {

        List<CampaniaDTO> campaniasEntidad = devolverTodasLasCampanias(entidadId);

        Map<Long, List<TiendaDTO>> res = new HashMap<>();

        for (CampaniaDTO c : campaniasEntidad) {
            if (c != null) {
                res.put(c.getId(), this.campaniaService.devolverTiendas(c.getId()));
            }
        }

        return res;
    }

    // Devuelve todas las campañas en las que participa junto a las tiendas
    // respectivas en las que participa
    public Map<Long, List<TiendaDTO>> devolverCampaniasConTiendas(Long entidadId) {

        List<CampaniaDTO> campaniasEntidad = devolverTodasLasCampanias(entidadId);

        Map<Long, List<TiendaDTO>> res = new HashMap<>();

        for (CampaniaDTO c : campaniasEntidad) {
            if (c != null) {
                res.put(c.getId(), devolverTiendasPorCampania(entidadId, c.getId()));
            }
        }

        return res;
    }

    // Devuelve la última campaña (Solo su nombre)
    public String obtenerUltimaCampania(Long entidadId) {

        List<CampaniaDTO> campaniasEntidad = devolverTodasLasCampanias(entidadId);

        // Ayuda IA para obtenerla
        return campaniasEntidad.stream()
                .max(Comparator.comparing(CampaniaDTO::getFechaInicio))
                .map(CampaniaDTO::getNombre)
                .orElse(null);

    }

    // CREAR ENTIDAD
    // -------------------------------------------------------------------------------

    @Transactional
    public void crearEntidad(RegistroEntidadDTO datos) {

        // Primero creamos la nueva entidad
        EntidadColaboradora nuevaEntidad = new EntidadColaboradora();

        // -- Obtenemos los datos básicos para añadírselos --
        nuevaEntidad.setNombre(datos.getInformacionGeneral().getNombre());
        nuevaEntidad.setEstadoActivo(datos.getInformacionGeneral().getEstadoActivo());

        if (datos.getInformacionGeneral().getObservaciones() != null &&
                datos.getInformacionGeneral().getObservaciones().isBlank()) {
            nuevaEntidad.setObservaciones(datos.getInformacionGeneral().getObservaciones());
        }
        Coordinador coordinadorEntidad = this.coordinadorRepository.findById(
                datos.getInformacionGeneral().getIdCoordinador()).get();
        nuevaEntidad.setCoordinador(coordinadorEntidad);

        // Creamos la nueva dirección y la añadimos
        Direccion nuevaDireccion = new Direccion();

        nuevaDireccion.setCalle(datos.getLocalizacion().getCalle());
        nuevaDireccion.setEsCapital(datos.getLocalizacion().getEsCapital());
        nuevaDireccion.setNumero(datos.getLocalizacion().getNumero());

        CodigoPostal codigoAsignado = this.codigoPostalRepository.findById(
                datos.getLocalizacion().getCp()).get();
        nuevaDireccion.setCodigoPostal(codigoAsignado);

        Localidad localidadAsignada = this.localidadRepository.findById(
                datos.getLocalizacion().getLocalidad()).get();
        nuevaDireccion.setLocalidad(localidadAsignada);

        // Si es capital, añadimos también el distrito
        if (nuevaDireccion.getEsCapital()) {
            Distrito distritoAsignado = this.distritoRepository.findById(
                    datos.getLocalizacion().getIdDistrito()).get();
            nuevaDireccion.setDistrito(distritoAsignado);
        }

        this.direccionRepository.save(nuevaDireccion);
        nuevaEntidad.setDireccion(nuevaDireccion);

        // Vamos iterando sobre los responsables creados
        for (ResponsableDTO r : datos.getResponsables()) {
            ResponsableEntidad nuevoResponsable = new ResponsableEntidad();
            Contacto nuevoContacto = new Contacto();
            Usuario nuevoUsuario = new Usuario();

            nuevoContacto.setEmail(r.getEmail() != null ? r.getEmail() : null);
            nuevoContacto.setNombre(r.getNombre());
            nuevoContacto.setTelefono(r.getTelefono() != null ? r.getTelefono() : null);
            this.contactoRepository.save(nuevoContacto);

            nuevoResponsable.setContacto(nuevoContacto);

            nuevoUsuario.setEmail(r.getUser());
            nuevoUsuario.setContrasenia(r.getPass());
            nuevoUsuario.setRol(TipoRol.RESPONSABLE_ENTIDAD);
            this.usuarioRepository.save(nuevoUsuario);

            nuevoResponsable.setUsuario(nuevoUsuario);

            nuevoResponsable.setEsContactoPrincipal(r.getEsPrincipal());

            // Guardamos aquí la entidad para que el responsable pueda guardarla
            this.entidadRepo.save(nuevaEntidad);

            nuevoResponsable.setColaborador(nuevaEntidad);

            if (nuevaEntidad.getResponsables() == null) {
                nuevaEntidad.setResponsables(new ArrayList<>());
            }
            this.responsableEntidadRepository.save(nuevoResponsable);
            nuevaEntidad.getResponsables().add(nuevoResponsable);
        }

        // Vamos iterando sobre las campañas para ir obteniedno el ID y las tiendas
        List<Campania> campaniasEntidad = new ArrayList<>();

        for (CampaniaRegistroDTO c : datos.getCampanias()) {
            Campania nuevaCampania = this.campaniaRepository.findById(c.getIdCampania()).get();
            campaniasEntidad.add(nuevaCampania);

            // Iteramos ahora sobre los IDS de las tiendas
            for (Long idTienda : c.getIdsTiendas()) {
                TiendaColaborador nuevaRelacionTiendaColab = new TiendaColaborador();
                nuevaRelacionTiendaColab.setCampania(nuevaCampania);
                nuevaRelacionTiendaColab.setTienda(this.tiendaRepository.findById(idTienda).get());
                nuevaRelacionTiendaColab.setColaborador(nuevaEntidad);

                this.tiendaColabRepo.save(nuevaRelacionTiendaColab);
            }
            nuevaCampania.getColaboradores().add(nuevaEntidad);
        }
        nuevaEntidad.setCampanias(campaniasEntidad);

        // En campaña me pasa igual, campaña tiene una lista de entidades colaboradora,
        // debo asociarlo tmb?
        this.entidadRepo.save(nuevaEntidad);
    }

    // ACTUALIZAR ENTIDAD (Ayuda de IA para algunas relaciones complejas)
    // --------------------------------------------------------------------------------------------
    @Transactional
    public void sobreescribirEntidad(ActualizacionEntidadDTO datos) {
        // Primero obtenemos la entidad
        EntidadColaboradora nuevaEntidad = this.entidadRepo.findById(datos.getIdEntidad()).orElse(null);

        // Si existe
        if (nuevaEntidad != null) {
            // Primero registramos sus datos básicos
            nuevaEntidad.setNombre(datos.getInformacionGeneral().getNombre());
            nuevaEntidad.setObservaciones(datos.getInformacionGeneral().getObservaciones());
            nuevaEntidad.setEstadoActivo(datos.getInformacionGeneral().getEstadoActivo());

            // Ahora actualizamos su dirección
            Direccion nuevaDireccion = nuevaEntidad.getDireccion();
            nuevaDireccion.setCalle(datos.getLocalizacion().getCalle());
            nuevaDireccion.setNumero(datos.getLocalizacion().getNumero());
            nuevaDireccion.setEsCapital(datos.getLocalizacion().getEsCapital());

            // Obtenemos el nuevo código
            nuevaDireccion.setCodigoPostal(
                    this.codigoPostalRepository.findById(
                            datos.getLocalizacion().getCp()).orElse(null));

            // Obtenemos la nueva localidad
            nuevaDireccion.setLocalidad(
                    this.localidadRepository.findById(
                            datos.getLocalizacion().getLocalidad()).orElse(null));

            // Ponemos si es capital
            nuevaDireccion.setEsCapital(datos.getLocalizacion().getEsCapital());

            // Si es capital
            if (datos.getLocalizacion().getEsCapital()) {
                // Le asignamos distrito
                nuevaDireccion.setDistrito(
                        this.distritoRepository.findById(
                                datos.getLocalizacion().getIdDistrito()).orElse(null));
            }

            this.direccionRepository.save(nuevaDireccion);

            // Ahora actualizamos sus responsables de entidad

            // Primero eliminamos los que el usuario ha eliminado
            if (datos.getResponsables().getIdsEliminados() != null
                    && datos.getResponsables().getIdsEliminados().size() > 0) {
                for (Long idEliminar : datos.getResponsables().getIdsEliminados()) {
                    ResponsableEntidad repEliminar = this.responsableEntidadRepository.findById(idEliminar)
                            .orElse(null);

                    if (repEliminar != null) {
                        Contacto contactoEliminar = repEliminar.getContacto();
                        if (contactoEliminar != null)
                            this.contactoRepository.delete(contactoEliminar);

                        Usuario usuarioEliminar = repEliminar.getUsuario();
                        if (usuarioEliminar != null)
                            this.usuarioRepository.delete(usuarioEliminar);

                        this.responsableEntidadRepository.deleteById(idEliminar);
                    }
                }

                this.responsableEntidadRepository.flush();
            }

            // Actualizamos los que están actualmente
            if (datos.getResponsables().getActualizados() != null
                    && datos.getResponsables().getActualizados().size() > 0) {
                for (ResponsableActualizadoDTO r : datos.getResponsables().getActualizados()) {
                    ResponsableEntidad respActualizado = this.responsableEntidadRepository.findById(r.getId())
                            .orElse(null);

                    if (respActualizado != null) {
                        respActualizado.setEsContactoPrincipal(r.getEsPrincipal());

                        Contacto contactoResp = respActualizado.getContacto();
                        if (contactoResp != null) {
                            contactoResp.setEmail(r.getEmail());
                            contactoResp.setNombre(r.getNombre());
                            contactoResp.setTelefono(r.getTelefono());
                            this.contactoRepository.save(contactoResp);
                        }
                        this.responsableEntidadRepository.save(respActualizado);
                    }
                }
                this.responsableEntidadRepository.flush();
            }

            // Añadimos los nuevos
            if (datos.getResponsables().getNuevos() != null && datos.getResponsables().getNuevos().size() > 0) {
                for (ResponsableDTO r : datos.getResponsables().getNuevos()) {
                    ResponsableEntidad nuevoResponsable = new ResponsableEntidad();
                    Contacto nuevoContacto = new Contacto();
                    Usuario nuevoUsuario = new Usuario();

                    nuevoContacto.setEmail(r.getEmail() != null ? r.getEmail() : null);
                    nuevoContacto.setNombre(r.getNombre());
                    nuevoContacto.setTelefono(r.getTelefono() != null ? r.getTelefono() : null);
                    this.contactoRepository.save(nuevoContacto);

                    nuevoResponsable.setContacto(nuevoContacto);

                    nuevoUsuario.setEmail(r.getUser());
                    nuevoUsuario.setContrasenia(r.getPass());
                    nuevoUsuario.setRol(TipoRol.RESPONSABLE_ENTIDAD);
                    this.usuarioRepository.save(nuevoUsuario);

                    nuevoResponsable.setUsuario(nuevoUsuario);
                    nuevoResponsable.setEsContactoPrincipal(r.getEsPrincipal());

                    nuevoResponsable.setColaborador(nuevaEntidad);

                    if (nuevaEntidad.getResponsables() == null) {
                        nuevaEntidad.setResponsables(new ArrayList<>());
                    }

                    this.responsableEntidadRepository.save(nuevoResponsable);
                    nuevaEntidad.getResponsables().add(nuevoResponsable);
                }
                this.responsableEntidadRepository.flush();
            }

            // Ahora las campañas y tiendas pertenecientes -> ENTENDERLO
            if (datos.getCampanias() != null && datos.getCampanias().size() > 0) {

                // 1. Limpiamos la tabla intermedia de TiendaColaborador (Lo que ya tenías)
                this.tiendaColabRepo.deleteByColaboradorId(datos.getIdEntidad());
                this.tiendaColabRepo.flush();

                // 2. 🔥 SOLUCIÓN AL NUEVO ERROR: Desvincular las campañas antiguas de la
                // relación ManyToMany
                // Recorremos las campañas en las que participaba antes y nos borramos de su
                // lista de colaboradores
                if (nuevaEntidad.getCampanias() != null) {
                    for (Campania amp : nuevaEntidad.getCampanias()) {
                        if (amp.getColaboradores() != null) {
                            amp.getColaboradores().remove(nuevaEntidad); // Nos quitamos de la campaña
                        }
                    }
                    nuevaEntidad.getCampanias().clear(); // Vaciamos nuestra propia lista en memoria
                }

                // Forzamos a Hibernate a que rompa esos enlaces viejos físicamente en la BD YA
                this.entidadRepo.saveAndFlush(nuevaEntidad);

                // 3. Ahora sí, reconstruimos la relación desde cero de forma limpia
                List<Campania> campaniasEntidad = new ArrayList<>();

                for (CampaniaRegistroDTO c : datos.getCampanias()) {
                    Campania nuevaCampania = this.campaniaRepository.findById(c.getIdCampania()).orElse(null);

                    if (nuevaCampania != null) {
                        campaniasEntidad.add(nuevaCampania);

                        // Iteramos ahora sobre los IDS de las tiendas (Esto no se toca, va genial)
                        for (Long idTienda : c.getIdsTiendas()) {
                            Tienda tiendaEncontrada = this.tiendaRepository.findById(idTienda).orElse(null);
                            if (tiendaEncontrada != null) {
                                TiendaColaborador nuevaRelacionTiendaColab = new TiendaColaborador();
                                nuevaRelacionTiendaColab.setCampania(nuevaCampania);
                                nuevaRelacionTiendaColab.setTienda(tiendaEncontrada);
                                nuevaRelacionTiendaColab.setColaborador(nuevaEntidad);

                                this.tiendaColabRepo.save(nuevaRelacionTiendaColab);
                            }
                        }

                        // Volvemos a añadir de forma bidireccional segura
                        if (nuevaCampania.getColaboradores() == null) {
                            nuevaCampania.setColaboradores(new ArrayList<>());
                        }
                        if (!nuevaCampania.getColaboradores().contains(nuevaEntidad)) {
                            nuevaCampania.getColaboradores().add(nuevaEntidad);
                        }
                    }
                }
                nuevaEntidad.setCampanias(campaniasEntidad);

                // Guardado definitivo sin duplicados
                this.entidadRepo.save(nuevaEntidad);
            }
        }
    }

    // PARA ELIMINAR UNA ENTIDAD (Ayuda de la IA para relaciones complejas)
    // -----------------------------------------
    @Transactional
    public void eliminarEntidad(Long entidadId) {
        // Primero obtenemos la entidad
        EntidadColaboradora entidadEliminar = this.entidadRepo.findById(entidadId).orElse(null);

        // Si la entidad no es null
        if (entidadEliminar != null) {
            // Cogemos todas las relaciones que tiene 1:1 o 1:M (NO DEBEMOS ELIMINAR SUS
            // RELACIONES PUESTO QUE SON "ENUMS")
            Direccion direccionEliminar = entidadEliminar.getDireccion();

            for (ResponsableEntidad r : entidadEliminar.getResponsables()) {
                // Eliminamos el contacto y el usuario
                if (r.getContacto() != null) {
                    this.contactoRepository.delete(r.getContacto());
                }
                if (r.getUsuario() != null) {
                    this.usuarioRepository.delete(r.getUsuario());
                }

                // Eliminamos el responsable de la entidad
                this.responsableEntidadRepository.delete(r);
            }

            // Ahora debemos eliminar las M:M
            if (entidadEliminar.getCampanias() != null) {
                for (Campania c : entidadEliminar.getCampanias()) {
                    if (c.getColaboradores() != null) {
                        c.getColaboradores().remove(entidadEliminar);
                    }
                }
                entidadEliminar.getCampanias().clear();
            }

            // La tabla intermedia de las 3 entidades
            this.tiendaColabRepo.deleteByColaboradorId(entidadId);
            // Eliminamos la entidad
            this.entidadRepo.delete(entidadEliminar);
            // La dirección
            this.direccionRepository.delete(direccionEliminar);
        }
    }

    // Aplicar filtros (QUERYS HECHAS POR IA PERO SUPERVISADAS POR MÍ Y CORREGIDAS)
    public Map<CampaniaDTO, List<EntidadColaboradoraDTO>> filtrarEntidades(
            String nombreTienda, Long localidadId, Boolean todasCampanias,
            Boolean esCapital, Boolean activo, Long campaniaId) {

        String filtroTienda = (nombreTienda != null && !nombreTienda.trim().isEmpty()) ? nombreTienda.trim() : null;

        List<CampaniaDTO> campaniasAProcesar = new ArrayList<>();
        if (todasCampanias != null && todasCampanias) {
            campaniasAProcesar = campaniaService.listarTodas();
        } else {
            campaniasAProcesar.add(campaniaService.findById(campaniaId));
        }

        Map<CampaniaDTO, List<EntidadColaboradoraDTO>> mapaResultado = new HashMap<>();

        for (CampaniaDTO campania : campaniasAProcesar) {
            // La BD nos trae ya las entidades listas y filtradas
            List<EntidadColaboradora> entidadesFiltradas = this.tiendaColabRepo.findFiltrosByCampania(
                    campania.getId(), activo, esCapital, localidadId, filtroTienda);

            if (entidadesFiltradas != null && !entidadesFiltradas.isEmpty()) {
                List<EntidadColaboradoraDTO> dtoList = entidadesFiltradas.stream()
                        .map(entidad -> {
                            EntidadColaboradoraDTO dto = entidadMapper.toDTO(entidad);

                            // Le cargamos las tiendas asignadas para esta campaña específica
                            List<String> nombresTiendas = this
                                    .devolverTiendasPorCampania(entidad.getId(), campania.getId()).stream()
                                    .map(TiendaDTO::getNombre)
                                    .collect(Collectors.toList());
                            dto.setNombresTiendas(nombresTiendas);

                            return dto;
                        })
                        .collect(Collectors.toList());

                mapaResultado.put(campania, dtoList);
            }
        }
        return mapaResultado;
    }

    // Final parte Sofía

    /*
     * private final EntidadColaboradoraRepository repo;
     * public EntidadColaboradoraService(EntidadColaboradoraRepository repo) {
     * this.repo = repo; }
     * 
     * public List<EntidadColaboradoraDTO> listarTodas() {
     * return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
     * }
     * 
     * private EntidadColaboradoraDTO toDTO(EntidadColaboradora e) {
     * return EntidadColaboradoraDTO.builder()
     * .id(e.getId())
     * .nombre(e.getNombre())
     * .estadoActivo(e.getEstadoActivo())
     * .observaciones(e.getObservaciones())
     * .numTiendas(e.getNumTiendas())
     * .numTurnos(e.getNumTurnos())
     * .numVoluntarios(e.getNumVoluntarios())
     * .coordinadorId(e.getCoordinador() != null ? e.getCoordinador().getId() :
     * null)
     * .direccionId(e.getDireccion() != null ? e.getDireccion().getId() : null)
     * 
     * // 1. IDs de Tiendas (Relación directa ManyToMany refactorizada)
     * .idsTiendas(e.getTiendas() == null ? List.of() :
     * e.getTiendas().stream()
     * .map(Tienda::getId)
     * .collect(Collectors.toList()))
     * 
     * // 2. IDs de Contactos (Responsables)
     * // Si borraste ResponsableEntidad, aquí mapeas la relación directa que hayas
     * dejado
     * .idsContactos(List.of()) // Ajustar según la nueva relación directa en la
     * Entity
     * 
     * .build();
     * }
     */
}