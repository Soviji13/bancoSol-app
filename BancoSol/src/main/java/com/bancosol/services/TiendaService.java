package com.bancosol.services;

import com.bancosol.dao.*;
import com.bancosol.dto.TiendaDTO;
import com.bancosol.dto.TiendaNuevaDTO;
import com.bancosol.entities.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TiendaService {
    private final TiendaRepository repo;
    private final CadenaRepository cadenaRepo;
    private final DireccionRepository direccionRepo;
    private final LocalidadRepository localidadRepo;
    private final CodigoPostalRepository cpRepo;
    private final DistritoRepository distritoRepo;
    private final ResponsableTiendaRepository responsableTiendaRepo;
    private final CampaniaRepository campaniaRepo; // <-- AÑADIDO

    public TiendaService(TiendaRepository repo, CadenaRepository cadenaRepo,
                         DireccionRepository direccionRepo, LocalidadRepository localidadRepo,
                         CodigoPostalRepository cpRepo, DistritoRepository distritoRepo,
                         ResponsableTiendaRepository responsableTiendaRepo,
                         CampaniaRepository campaniaRepo) { // <-- MODIFICADO
        this.repo = repo;
        this.cadenaRepo = cadenaRepo;
        this.direccionRepo = direccionRepo;
        this.localidadRepo = localidadRepo;
        this.cpRepo = cpRepo;
        this.distritoRepo = distritoRepo;
        this.responsableTiendaRepo = responsableTiendaRepo;
        this.campaniaRepo = campaniaRepo; // <-- AÑADIDO
    }

    public List<TiendaDTO> listarTodas() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<TiendaDTO> listarPorCampania(Long campaniaId) {
        return repo.findByCampaniasId(campaniaId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public TiendaDTO crearTienda(TiendaNuevaDTO dto) {
        // Buscamos la campaña destino si viene informada
        Campania campaniaTarget = null;
        if (dto.getCampaniaIdTarget() != null) {
            campaniaTarget = campaniaRepo.findById(dto.getCampaniaIdTarget()).orElse(null);
        }

        // CASE 1: LA TIENDA YA EXISTE: SOLO SE ASOCIA A LA NUEVA CAMPAÑA
        if (dto.getTiendaIdExistente() != null) {
            Tienda tiendaExistente = repo.findById(dto.getTiendaIdExistente())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tienda no encontrada"));

            if (campaniaTarget != null) {
                if (!tiendaExistente.getCampanias().contains(campaniaTarget)) {
                    tiendaExistente.getCampanias().add(campaniaTarget);
                }
                if (!campaniaTarget.getTiendas().contains(tiendaExistente)) {
                    campaniaTarget.getTiendas().add(tiendaExistente);
                }
                repo.save(tiendaExistente);
                campaniaRepo.save(campaniaTarget);
            }
            return toDTO(tiendaExistente);
        }


        // CASE 2: TIENDA NUEVA: SE CREA DESDE CERO

        Localidad loc = null;
        Boolean esCapital = false;
        if (dto.getLocalidadId() != null) {
            loc = localidadRepo.findById(dto.getLocalidadId()).orElse(null);
            if (loc != null && (loc.getNombre().toUpperCase().contains("MÁLAGA") || loc.getNombre().toUpperCase().contains("MALAGA"))) {
                esCapital = true;
            }
        }

        CodigoPostal cp = dto.getCpId() != null ? cpRepo.findById(dto.getCpId()).orElse(null) : null;
        Distrito dist = dto.getDistritoId() != null ? distritoRepo.findById(dto.getDistritoId()).orElse(null) : null;

        Direccion dir = Direccion.builder()
                .calle(dto.getCalle())
                .numero(dto.getNumero() != null ? dto.getNumero().shortValue() : null)
                .localidad(loc)
                .codigoPostal(cp)
                .distrito(dist)
                .esCapital(esCapital)
                .build();

        dir = direccionRepo.save(dir);
        Cadena cad = dto.getCadenaId() != null ? cadenaRepo.findById(dto.getCadenaId()).orElse(null) : null;

        ResponsableTienda respTienda = dto.getResponsableTiendaId() != null ?
                responsableTiendaRepo.findById(dto.getResponsableTiendaId()).orElse(null) : null;

        Tienda t = Tienda.builder()
                .nombre(dto.getNombre())
                .esFranquicia(dto.getEsFranquicia())
                .puntosRecogida((short) 0)
                .direccion(dir)
                .cadena(cad)
                .responsableTienda(respTienda)
                .campanias(new java.util.ArrayList<>())
                .build();

        if (campaniaTarget != null) {
            t.getCampanias().add(campaniaTarget);
            if (!campaniaTarget.getTiendas().contains(t)) {
                campaniaTarget.getTiendas().add(t);
            }
        }

        t = repo.save(t);
        if (campaniaTarget != null) {
            campaniaRepo.save(campaniaTarget);
        }
        return toDTO(t);
    }

    @Transactional
    public TiendaDTO actualizarTienda(Long id, TiendaDTO dto) {
        Tienda tienda = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tienda no encontrada"));

        tienda.setNombre(dto.getNombre());
        tienda.setPuntosRecogida(dto.getPuntosRecogida());
        tienda.setEsFranquicia(dto.getEsFranquicia());

        if (dto.getCadenaId() != null) {
            tienda.setCadena(cadenaRepo.findById(dto.getCadenaId()).orElse(null));
        }

        if (dto.getResponsableTiendaId() != null) {
            tienda.setResponsableTienda(responsableTiendaRepo.findById(dto.getResponsableTiendaId()).orElse(null));
        } else {
            tienda.setResponsableTienda(null);
        }

        Direccion dir = tienda.getDireccion();
        if (dir != null) {
            dir.setCalle(dto.getCalle());
            dir.setNumero(dto.getNumero());
            if (dto.getLocalidadId() != null) {
                Localidad loc = localidadRepo.findById(dto.getLocalidadId()).orElse(null);
                dir.setLocalidad(loc);
                dir.setEsCapital(loc != null && (loc.getNombre().toUpperCase().contains("MÁLAGA") || loc.getNombre().toUpperCase().contains("MALAGA")));
            }
            dir.setCodigoPostal(dto.getCpId() != null ? cpRepo.findById(dto.getCpId()).orElse(null) : null);
            dir.setDistrito(dto.getDistritoId() != null ? distritoRepo.findById(dto.getDistritoId()).orElse(null) : null);
            direccionRepo.save(dir);
        }

        repo.save(tienda);
        return toDTO(tienda);
    }

    @Transactional
    public void eliminarTiendas(List<Long> ids) {
        for (Long id : ids) {
            repo.findById(id).ifPresent(tienda -> {
                Direccion dir = tienda.getDireccion();
                repo.delete(tienda);
                if (dir != null) {
                    direccionRepo.delete(dir);
                }
            });
        }
    }

    private TiendaDTO toDTO(Tienda t) {
        List<TiendaDTO.ResponsableInfoDTO> listaInfo = t.getResponsables() == null ? List.of() :
                t.getResponsables().stream().map(r -> TiendaDTO.ResponsableInfoDTO.builder()
                        .nombre(r.getContacto() != null ? r.getContacto().getNombre() : "---")
                        .nombreEntidad(r.getColaborador() != null ? r.getColaborador().getNombre() : "---")
                        .build()
                ).collect(Collectors.toList());

        return TiendaDTO.builder()
                .id(t.getId())
                .nombre(t.getNombre())
                .puntosRecogida(t.getPuntosRecogida())
                .esFranquicia(t.getEsFranquicia())
                .cadenaId(t.getCadena() != null ? t.getCadena().getId() : null)
                .direccionId(t.getDireccion() != null ? t.getDireccion().getId() : null)
                .calle(t.getDireccion() != null ? t.getDireccion().getCalle() : null)
                .numero(t.getDireccion() != null ? t.getDireccion().getNumero() : null)
                .localidadId(t.getDireccion() != null && t.getDireccion().getLocalidad() != null ? t.getDireccion().getLocalidad().getId() : null)
                .cpId(t.getDireccion() != null && t.getDireccion().getCodigoPostal() != null ? t.getDireccion().getCodigoPostal().getId() : null)
                .distritoId(t.getDireccion() != null && t.getDireccion().getDistrito() != null ? t.getDireccion().getDistrito().getId() : null)
                .responsableTiendaId(t.getResponsableTienda() != null ? t.getResponsableTienda().getId() : null)
                .nombreResponsableTienda(t.getResponsableTienda() != null ? t.getResponsableTienda().getNombre() : "Sin responsable asignado")
                .responsablesInfo(listaInfo)
                .idsCampanias(t.getCampanias() == null ? List.of() : t.getCampanias().stream().map(Campania::getId).collect(Collectors.toList()))
                .idsEntidades(t.getColaboradores() == null ? List.of() : t.getColaboradores().stream().map(EntidadColaboradora::getId).collect(Collectors.toList()))
                .idsResponsables(t.getResponsables() == null ? List.of() : t.getResponsables().stream().map(ResponsableEntidad::getId).collect(Collectors.toList()))
                .build();
    }


    public List<TiendaDTO> filtrarTiendas(Long campaniaId, String nombre, Long cadenaId, Long localidadId,
                                          Long distritoId, Long zonaGeoId, Long colaboradorId,
                                          Long responsableTiendaId, Boolean participaActiva, Boolean esFranquicia) {

        //Fallback: si todos los campos vienen vacíos, devolvemos el listado rápido original de la tabal tiendas
        if ((nombre == null || nombre.trim().isEmpty()) &&
                cadenaId == null &&
                localidadId == null &&
                distritoId == null &&
                zonaGeoId == null &&
                colaboradorId == null &&
                responsableTiendaId == null &&
                participaActiva == null &&
                esFranquicia == null) {

            if (campaniaId != null) {
                return listarPorCampania(campaniaId);
            }
            return listarTodas();
        }

        Long activeCampaniaId = campaniaRepo.findAll().stream()
                .filter(Campania::getActiva)
                .map(Campania::getId)
                .findFirst()
                .orElse(null);

        // PREPARACIÓN EN JAVA: Formateamos el String con los comodines de búsqueda aquí
        String nombreFiltro = (nombre != null && !nombre.trim().isEmpty())
                ? "%" + nombre.trim().toUpperCase() + "%"
                : null;

        return repo.filtrarTiendas(campaniaId, nombreFiltro, cadenaId, localidadId, distritoId, zonaGeoId,
                        colaboradorId, responsableTiendaId, participaActiva, esFranquicia, activeCampaniaId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}