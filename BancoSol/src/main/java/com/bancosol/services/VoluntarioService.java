package com.bancosol.services;

import com.bancosol.dao.CampaniaRepository;
import com.bancosol.dao.ResponsableEntidadRepository;
import com.bancosol.dao.TiendaRepository;
import com.bancosol.dao.TurnoRepository;
import com.bancosol.dao.VoluntarioRepository;
import com.bancosol.dto.VoluntarioCompletoDTO;
import com.bancosol.dto.VoluntarioDTO;
import com.bancosol.dto.VoluntarioNuevoDTO;
import com.bancosol.entities.Campania;
import com.bancosol.entities.Contacto;
import com.bancosol.entities.Direccion;
import com.bancosol.entities.EntidadColaboradora;
import com.bancosol.entities.ResponsableEntidad;
import com.bancosol.entities.Tienda;
import com.bancosol.entities.TiendaTurno;
import com.bancosol.entities.Turno;
import com.bancosol.entities.Voluntario;
import com.bancosol.entities.enums.TurnoDia;
import com.bancosol.entities.enums.TurnoFranja;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class VoluntarioService {
    private final VoluntarioRepository repo;
    private final ResponsableEntidadRepository respRepo;
    private final TiendaRepository tiendaRepo;
    private final TurnoRepository turnoRepo;
    private final CampaniaRepository campaniaRepo;

    public VoluntarioService(VoluntarioRepository repo,
                             ResponsableEntidadRepository respRepo,
                             TiendaRepository tiendaRepo,
                             TurnoRepository turnoRepo,
                             CampaniaRepository campaniaRepo) {
        this.repo = repo;
        this.respRepo = respRepo;
        this.tiendaRepo = tiendaRepo;
        this.turnoRepo = turnoRepo;
        this.campaniaRepo = campaniaRepo;
    }

    public List<VoluntarioDTO> listarTodos() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    // --- MAGIA AQUI: Si la campaña de React no existe en SQL, pilla la primera que haya ---
    private Campania obtenerCampaniaSegura(Long idRecibido) {
        Long idBusqueda = idRecibido != null ? idRecibido : 3L;
        return campaniaRepo.findById(idBusqueda)
                .orElseGet(() -> campaniaRepo.findAll().stream().findFirst()
                        .orElseThrow(() -> new RuntimeException("No hay NINGUNA campaña en la base de datos.")));
    }

    @Transactional
    public void guardarVoluntario(VoluntarioNuevoDTO dto) {
        Voluntario v = new Voluntario();
        v.setObservaciones(dto.getObservaciones());
        v.setHorasSueltas(dto.getHorasSueltas());

        if (Boolean.TRUE.equals(dto.getHorasSueltas()) && dto.getHoraInicio() != null && dto.getHoraFin() != null) {
            v.setHoraComienzo(LocalTime.parse(dto.getHoraInicio()));
            v.setHoraFinal(LocalTime.parse(dto.getHoraFin()));
        }

        ResponsableEntidad resp = respRepo.findByNombreAndEntidad(dto.getResponsable(), dto.getEntidad())
                .orElseThrow(() -> new RuntimeException("No se encontró el responsable: " + dto.getResponsable()));
        v.setResponsable(resp);

        v = repo.save(v);

        // Usamos la busqueda segura
        Campania campaniaActiva = obtenerCampaniaSegura(dto.getCampaniaId());

        List<TiendaTurno> asignaciones = new ArrayList<>();
        if (dto.getTurnosAsignados() != null) {
            for (VoluntarioNuevoDTO.TurnoNuevoDTO tDto : dto.getTurnosAsignados()) {
                Tienda tienda = tiendaRepo.findByNombre(tDto.getTienda())
                        .orElseThrow(() -> new RuntimeException("No se encontró la tienda: " + tDto.getTienda()));

                String diaLimpio = tDto.getDia().toUpperCase().replace("É", "E").replace("Á", "A");
                TurnoDia diaEnum = TurnoDia.valueOf(diaLimpio);

                TurnoFranja franjaEnum;
                if (tDto.getFranja().contains(":") || dto.getHorasSueltas()) {
                    int horaComienzoInt = v.getHoraComienzo() != null ? v.getHoraComienzo().getHour() : 10;
                    franjaEnum = horaComienzoInt < 15 ? TurnoFranja.MAÑANA : TurnoFranja.TARDE;
                } else {
                    franjaEnum = tDto.getFranja().equalsIgnoreCase("Mañana") ? TurnoFranja.MAÑANA : TurnoFranja.TARDE;
                }


                Turno turno = turnoRepo.findByDiaAndFranjaAndCampaniaId(diaEnum, franjaEnum, campaniaActiva.getId())
                        .orElseGet(() -> {
                            Turno nuevoTurno = Turno.builder()
                                    .dia(diaEnum)
                                    .franjaHoraria(franjaEnum)
                                    .campania(campaniaActiva)
                                    .build();
                            return turnoRepo.save(nuevoTurno);
                        });

                TiendaTurno tt = new TiendaTurno();
                tt.setVoluntario(v);
                tt.setTienda(tienda);
                tt.setTurno(turno);
                asignaciones.add(tt);
            }
        }

        if (v.getTiendaTurnos() == null) {
            v.setTiendaTurnos(new ArrayList<>());
        } else {
            v.getTiendaTurnos().clear();
        }
        v.getTiendaTurnos().addAll(asignaciones);
        repo.save(v);
    }

    @Transactional
    public void actualizarVoluntario(Long id, VoluntarioNuevoDTO dto) {
        Voluntario v = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe el voluntario con id: " + id));

        v.setObservaciones(dto.getObservaciones());
        v.setHorasSueltas(dto.getHorasSueltas());

        if (Boolean.TRUE.equals(dto.getHorasSueltas()) && dto.getHoraInicio() != null && dto.getHoraFin() != null) {
            v.setHoraComienzo(LocalTime.parse(dto.getHoraInicio()));
            v.setHoraFinal(LocalTime.parse(dto.getHoraFin()));
        } else {
            v.setHoraComienzo(null);
            v.setHoraFinal(null);
        }

        ResponsableEntidad resp = respRepo.findByNombreAndEntidad(dto.getResponsable(), dto.getEntidad())
                .orElseThrow(() -> new RuntimeException("Responsable no encontrado"));
        v.setResponsable(resp);

        // Usamos la busqueda segura
        Campania campaniaActiva = obtenerCampaniaSegura(dto.getCampaniaId());

        v.getTiendaTurnos().clear();
        repo.saveAndFlush(v);

        List<TiendaTurno> asignaciones = new ArrayList<>();
        if (dto.getTurnosAsignados() != null) {
            for (VoluntarioNuevoDTO.TurnoNuevoDTO tDto : dto.getTurnosAsignados()) {
                Tienda tienda = tiendaRepo.findByNombre(tDto.getTienda())
                        .orElseThrow(() -> new RuntimeException("Tienda no encontrada: " + tDto.getTienda()));

                String diaLimpio = tDto.getDia().toUpperCase().replace("É", "E").replace("Á", "A");
                TurnoDia diaEnum = TurnoDia.valueOf(diaLimpio);

                TurnoFranja franjaEnum;
                if (tDto.getFranja().contains(":") || dto.getHorasSueltas()) {
                    int horaComienzoInt = v.getHoraComienzo() != null ? v.getHoraComienzo().getHour() : 10;
                    franjaEnum = horaComienzoInt < 15 ? TurnoFranja.MAÑANA : TurnoFranja.TARDE;
                } else {
                    franjaEnum = tDto.getFranja().equalsIgnoreCase("Mañana") ? TurnoFranja.MAÑANA : TurnoFranja.TARDE;
                }

                Turno turno = turnoRepo.findByDiaAndFranjaAndCampaniaId(diaEnum, franjaEnum, campaniaActiva.getId())
                        .orElseGet(() -> {
                            Turno nuevoTurno = Turno.builder()
                                    .dia(diaEnum)
                                    .franjaHoraria(franjaEnum)
                                    .campania(campaniaActiva)
                                    .build();
                            return turnoRepo.save(nuevoTurno);
                        });

                TiendaTurno tt = new TiendaTurno();
                tt.setVoluntario(v);
                tt.setTienda(tienda);
                tt.setTurno(turno);
                asignaciones.add(tt);
            }
        }

        v.getTiendaTurnos().addAll(asignaciones);
        repo.save(v);
    }

    @Transactional
    public void eliminarVoluntario(Long id) {
        repo.deleteById(id);
    }

    private VoluntarioDTO toDTO(Voluntario v) {
        return VoluntarioDTO.builder()
                .id(v.getId()).observaciones(v.getObservaciones())
                .horasSueltas(v.getHorasSueltas()).horaComienzo(v.getHoraComienzo())
                .horaFinal(v.getHoraFinal()).responsableId(v.getResponsable().getId())
                .build();
    }

    private VoluntarioCompletoDTO toCompletoDTO(Voluntario v) {
        ResponsableEntidad resp = v.getResponsable();
        EntidadColaboradora entidad = resp != null ? resp.getColaborador() : null;
        Contacto contacto = resp != null ? resp.getContacto() : null;
        Direccion dir = entidad != null ? entidad.getDireccion() : null;

        Map<Tienda, List<TiendaTurno>> turnosPorTienda = v.getTiendaTurnos() != null
                ? v.getTiendaTurnos().stream()
                .filter(tt -> tt.getTurno() != null && tt.getTienda() != null)
                .collect(Collectors.groupingBy(TiendaTurno::getTienda))
                : Map.of();

        List<VoluntarioCompletoDTO.AsignacionDTO> asignaciones = turnosPorTienda.entrySet().stream()
                .map(entry -> {
                    Tienda tienda = entry.getKey();
                    List<VoluntarioCompletoDTO.TurnoVoluntarioDTO> turnos = entry.getValue().stream()
                            .map(tt -> VoluntarioCompletoDTO.TurnoVoluntarioDTO.builder()
                                    .turnoId(tt.getTurno().getId())
                                    .dia(tt.getTurno().getDia().name().charAt(0) + tt.getTurno().getDia().name().substring(1).toLowerCase())
                                    .franjaHoraria(Boolean.TRUE.equals(v.getHorasSueltas()) ?
                                            v.getHoraComienzo() + " - " + v.getHoraFinal() :
                                            tt.getTurno().getFranjaHoraria().name())
                                    .build())
                            .collect(Collectors.toList());

                    return VoluntarioCompletoDTO.AsignacionDTO.builder()
                            .tiendaId(tienda.getId())
                            .tiendaNombre(tienda.getNombre())
                            .turnos(turnos)
                            .build();
                }).collect(Collectors.toList());

        return VoluntarioCompletoDTO.builder()
                .id(v.getId())
                .responsableEntidad(contacto != null ? contacto.getNombre() : "Sin responsable")
                .perteneceA(entidad != null ? entidad.getNombre() : "Sin entidad")
                .telefono(contacto != null ? contacto.getTelefono() : "")
                .email(contacto != null ? contacto.getEmail() : "")
                .localidad(dir != null && dir.getLocalidad() != null ? dir.getLocalidad().getNombre() : "")
                .domicilio(dir != null ? dir.getCalle() + ", " + dir.getNumero() : "")
                .distrito(dir != null && dir.getDistrito() != null ? dir.getDistrito().getNombre() : null)
                .observaciones(v.getObservaciones())
                .horasSueltas(Boolean.TRUE.equals(v.getHorasSueltas()))
                .horaComienzo(v.getHoraComienzo() != null ? v.getHoraComienzo().toString() : null)
                .horaFinal(v.getHoraFinal() != null ? v.getHoraFinal().toString() : null)
                .asignaciones(asignaciones)
                .build();
    }

    public List<VoluntarioCompletoDTO> listarFiltrados(Long campaniaId, Long id, String entidad, String responsable, String tienda, String franja, String horaInicio, String horaFin) {
        List<Voluntario> voluntariosDB = repo.findFiltrados(campaniaId, id, entidad, responsable, tienda);

        return voluntariosDB.stream()
                .map(this::toCompletoDTO)
                .filter(v -> {
                    if (franja != null && !franja.isEmpty() && !franja.equalsIgnoreCase("TODAS")) {
                        boolean tieneFranja = v.getAsignaciones().stream()
                                .flatMap(a -> a.getTurnos().stream())
                                .anyMatch(t -> t.getFranjaHoraria().equalsIgnoreCase(franja));
                        if (!tieneFranja) return false;
                    }
                    if (horaInicio != null && !horaInicio.isEmpty() && horaFin != null && !horaFin.isEmpty()) {
                        if (!Boolean.TRUE.equals(v.getHorasSueltas()) || v.getHoraComienzo() == null) {
                            return false;
                        }
                        LocalTime inicioFiltro = LocalTime.parse(horaInicio);
                        LocalTime finFiltro = LocalTime.parse(horaFin);
                        LocalTime vInicio = LocalTime.parse(v.getHoraComienzo());
                        LocalTime vFin = LocalTime.parse(v.getHoraFinal());
                        if (vInicio.isBefore(inicioFiltro) || vFin.isAfter(finFiltro)) {
                            return false;
                        }
                    }
                    return true;
                })
                .collect(Collectors.toList());
    }
}