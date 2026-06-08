package com.bancosol.services;

import com.bancosol.dao.VoluntarioRepository;
import com.bancosol.dto.VoluntarioCompletoDTO;
import com.bancosol.dto.VoluntarioDTO;
import com.bancosol.dto.VoluntarioNuevoDTO;
import com.bancosol.entities.*;
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
    private final com.bancosol.dao.ResponsableEntidadRepository respRepo;
    private final com.bancosol.dao.TiendaRepository tiendaRepo;
    private final com.bancosol.dao.TurnoRepository turnoRepo;

    public VoluntarioService(VoluntarioRepository repo,
                             com.bancosol.dao.ResponsableEntidadRepository respRepo,
                             com.bancosol.dao.TiendaRepository tiendaRepo,
                             com.bancosol.dao.TurnoRepository turnoRepo) {
        this.repo = repo;
        this.respRepo = respRepo;
        this.tiendaRepo = tiendaRepo;
        this.turnoRepo = turnoRepo;
    }

    public List<VoluntarioDTO> listarTodos() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
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

        List<TiendaTurno> asignaciones = new ArrayList<>();
        if (dto.getTurnosAsignados() != null) {
            for (VoluntarioNuevoDTO.TurnoNuevoDTO tDto : dto.getTurnosAsignados()) {
                Tienda tienda = tiendaRepo.findByNombre(tDto.getTienda())
                        .orElseThrow(() -> new RuntimeException("No se encontró la tienda: " + tDto.getTienda()));

                TurnoDia diaEnum = TurnoDia.valueOf(tDto.getDia().toUpperCase());
                TurnoFranja franjaEnum = tDto.getFranja().equalsIgnoreCase("Mañana") ? TurnoFranja.MAÑANA : TurnoFranja.TARDE;

                Turno turno = turnoRepo.findByDiaAndFranja(diaEnum, franjaEnum)
                        .orElseThrow(() -> new RuntimeException("No se encontró el turno de " + diaEnum + " " + franjaEnum));

                TiendaTurno tt = new TiendaTurno();
                tt.setVoluntario(v);
                tt.setTienda(tienda);
                tt.setTurno(turno);
                asignaciones.add(tt);
            }
        }
        v.setTiendaTurnos(asignaciones);
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

        v.getTiendaTurnos().clear();
        if (dto.getTurnosAsignados() != null) {
            for (VoluntarioNuevoDTO.TurnoNuevoDTO tDto : dto.getTurnosAsignados()) {
                Tienda tienda = tiendaRepo.findByNombre(tDto.getTienda())
                        .orElseThrow(() -> new RuntimeException("Tienda no encontrada: " + tDto.getTienda()));

                TurnoDia diaEnum = TurnoDia.valueOf(tDto.getDia().toUpperCase());
                TurnoFranja franjaEnum = tDto.getFranja().equalsIgnoreCase("Mañana") ? TurnoFranja.MAÑANA : TurnoFranja.TARDE;

                Turno turno = turnoRepo.findByDiaAndFranja(diaEnum, franjaEnum)
                        .orElseThrow(() -> new RuntimeException("Turno no encontrado"));

                TiendaTurno tt = new TiendaTurno();
                tt.setVoluntario(v);
                tt.setTienda(tienda);
                tt.setTurno(turno);
                v.getTiendaTurnos().add(tt);
            }
        }
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

        // agrupamos los turnos por tienda para q react los pinte agrupados !!!
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
                                    // ponemos Lunes en vez de LUNES para q react no se queje
                                    .dia(tt.getTurno().getDia().name().charAt(0) + tt.getTurno().getDia().name().substring(1).toLowerCase())
                                    // inyectamos hora exacta o MAÑANA/TARDE segun horasSueltas
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
        // 1. Filtramos en base de datos lo "facil"
        List<Voluntario> voluntariosDB = repo.findFiltrados(campaniaId, id, entidad, responsable, tienda);

        // 2. Filtramos en memoria (java) la logica compleja de horas y franjas
        return voluntariosDB.stream()
                .map(this::toCompletoDTO)
                .filter(v -> {
                    // Filtro de Franja (Mañana o Tarde)
                    if (franja != null && !franja.isEmpty() && !franja.equalsIgnoreCase("TODAS")) {
                        boolean tieneFranja = v.getAsignaciones().stream()
                                .flatMap(a -> a.getTurnos().stream())
                                .anyMatch(t -> t.getFranjaHoraria().equalsIgnoreCase(franja));
                        if (!tieneFranja) return false;
                    }

                    // Filtro de Horas Sueltas (si rellenan el intervalo)
                    if (horaInicio != null && !horaInicio.isEmpty() && horaFin != null && !horaFin.isEmpty()) {
                        if (!Boolean.TRUE.equals(v.getHorasSueltas()) || v.getHoraComienzo() == null) {
                            return false; // si no tiene horas sueltas, no pasa el filtro
                        }

                        LocalTime inicioFiltro = LocalTime.parse(horaInicio);
                        LocalTime finFiltro = LocalTime.parse(horaFin);
                        LocalTime vInicio = LocalTime.parse(v.getHoraComienzo());
                        LocalTime vFin = LocalTime.parse(v.getHoraFinal());

                        // comprobamos q el horario del voluntario este DENTRO de las horas q buscan
                        if (vInicio.isBefore(inicioFiltro) || vFin.isAfter(finFiltro)) {
                            return false;
                        }
                    }
                    return true;
                })
                .collect(Collectors.toList());
    }
}