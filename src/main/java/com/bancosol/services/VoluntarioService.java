//francisco javier garcia sierra 0% ia

// ----- JUSTIFICACIÓN USO IA ---------------------------------------------------
// Excepción de serialización de fechas (LocalTime) a JSON: Al pasar la lista a la vista JSP, el ObjectMapper básico petaba con las horas. Solucionado inyectando el ObjectMapper oficial de Spring Boot que ya viene configurado para Java Time.
// ------------------------------------------------------------------------------

package com.bancosol.services;

import com.bancosol.dao.*;
import com.bancosol.dto.TurnoNuevoDTO;
import com.bancosol.dto.UsuarioDTO;
import com.bancosol.dto.VoluntarioDTO;
import com.bancosol.dto.VoluntarioNuevoDTO;
import com.bancosol.entities.*;
import com.bancosol.entities.enums.TurnoDia;
import com.bancosol.entities.enums.TurnoFranja;
import com.bancosol.mapper.VoluntarioMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.AllArgsConstructor;

import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class VoluntarioService {

    private final VoluntarioRepository voluntarioRepo;
    private final TiendaTurnoRepository tiendaTurnoRepo;
    private final VoluntarioMapper voluntarioMapper;
    private final TurnoRepository turnoRepo;
    private final CampaniaRepository campaniaRepo;
    private final ResponsableEntidadRepository responsableRepo;
    private final TiendaRepository tiendaRepo;

    // AYUDA IA
    // carga los turnos del vol y los mete al dto, se hcae asi para evitar q jpa
    // entre en un bucle infinito (Voluntario -> TiendaTurno -> Voluntario...)
    private VoluntarioDTO cargarTurnosDelVoluntario(Voluntario v) {
        VoluntarioDTO dto = voluntarioMapper.toDTO(v);

        // buscamos todos los turnos del vol en la tabla intermedia
        List<TiendaTurno> turnosEnBD = tiendaTurnoRepo.findByVoluntarioId(v.getId());

        if (turnosEnBD != null && !turnosEnBD.isEmpty()) {
            // agrupamos los turnos por tienda
            Map<Tienda, List<TiendaTurno>> turnosPorTienda = turnosEnBD.stream()
                    .filter(tt -> tt.getTurno() != null && tt.getTienda() != null)
                    .collect(Collectors.groupingBy(TiendaTurno::getTienda));

            // recorremos el map para sacar la lista de asignaciones para el jsp
            List<VoluntarioDTO.AsignacionDTO> listaAsignaciones = turnosPorTienda.entrySet().stream()
                    .map(entry -> {
                        Tienda tienda = entry.getKey();

                        // sacamos dia y franja
                        List<VoluntarioDTO.TurnoVoluntarioDTO> turnos = entry.getValue().stream()
                                .map(tt -> {
                                    // 1ra letra en mayuscula para q quede bien
                                    String nombreDia = tt.getTurno().getDia().name();
                                    String diaCap = nombreDia.charAt(0) + nombreDia.substring(1).toLowerCase();

                                    // si va por horas sueltas mostramos el intervalo en vez de mñn o tarde!!!!!!!
                                    String franja = Boolean.TRUE.equals(v.getHorasSueltas())
                                            && v.getHoraComienzo() != null
                                                    ? v.getHoraComienzo() + " - " + v.getHoraFinal()
                                                    : tt.getTurno().getFranjaHoraria().name();

                                    return new VoluntarioDTO.TurnoVoluntarioDTO(tt.getTurno().getId(), diaCap, franja);
                                }).collect(Collectors.toList());

                        return new VoluntarioDTO.AsignacionDTO(tienda.getId(), tienda.getNombre(), turnos);
                    }).collect(Collectors.toList());

            dto.setAsignaciones(listaAsignaciones);
        }
        return dto;
    }

    // metodos de busqueda (pasan todos por la funcion de cargar turnos)

    // 0 ia
    public List<VoluntarioDTO> buscarTodos() {
        return voluntarioRepo.findAll()
                .stream()
                .map(this::cargarTurnosDelVoluntario)
                .collect(Collectors.toList());
    }

    // 0 ia
    public List<VoluntarioDTO> buscarPorCampania(Long campaniaId) {
        return voluntarioRepo.buscarPorCampaniaId(campaniaId)
                .stream()
                .map(this::cargarTurnosDelVoluntario)
                .collect(Collectors.toList());
    }

    // 0 ia
    public VoluntarioDTO buscarPorId(Long id) {
        return voluntarioRepo.findById(id)
                .map(this::cargarTurnosDelVoluntario)
                .orElse(null);
    }

    public List<VoluntarioDTO> buscarFiltrados(Long campaniaId, Long voluntarioId, String nombreEnt, String nombreResp,
            String nombreTienda) {
        // limpiamos textos vacios q manda html para q la query no explote!!!
        String ent = (nombreEnt != null && !nombreEnt.trim().isEmpty()) ? nombreEnt.trim() : null;
        String resp = (nombreResp != null && !nombreResp.trim().isEmpty()) ? nombreResp.trim() : null;
        String tienda = (nombreTienda != null && !nombreTienda.trim().isEmpty()) ? nombreTienda.trim() : null;

        return voluntarioRepo.buscarFiltrados(campaniaId, voluntarioId, ent, resp, tienda)
                .stream()
                .map(this::cargarTurnosDelVoluntario)
                .collect(Collectors.toList());
    }

    // revision ia
    // convierte los turnos del html a bd. si no existe se crea al vuelo!!!!
    private void procesarAsignaciones(Voluntario voluntario, List<TurnoNuevoDTO> turnos, Long campaniaId) {
        if (turnos == null || turnos.isEmpty())
            return;

        Campania campania = campaniaRepo.findById(campaniaId).orElseThrow();

        for (TurnoNuevoDTO tDto : turnos) {
            Tienda tienda = tiendaRepo.findById(tDto.getTiendaId()).orElse(null);
            if (tienda == null)
                continue; // si no hay tienda pasamos al sig

            // limpieza de ´ para q cuadren
            String diaLimpio = tDto.getDia().toUpperCase().replace("É", "E").replace("Á", "A");
            TurnoDia diaEnum = TurnoDia.valueOf(diaLimpio);

            // calculamos la franja. si es horas sueltas se saca por la hora de inicio!!!!
            TurnoFranja franjaEnum;
            if ("HORAS_SUELTAS".equals(tDto.getFranja()) || voluntario.getHorasSueltas()) {
                int hora = voluntario.getHoraComienzo() != null ? voluntario.getHoraComienzo().getHour() : 10;
                franjaEnum = hora < 15 ? TurnoFranja.MAÑANA : TurnoFranja.TARDE;
            } else {
                franjaEnum = tDto.getFranja().equalsIgnoreCase("Mañana") ? TurnoFranja.MAÑANA : TurnoFranja.TARDE;
            }

            // buscamos si ya existe el turno si no, lo guardamos nuevo!!!!
            Turno turno = turnoRepo.findByDiaAndFranjaHorariaAndCampania_Id(diaEnum, franjaEnum, campaniaId)
                    .orElseGet(() -> turnoRepo
                            .save(Turno.builder().dia(diaEnum).franjaHoraria(franjaEnum).campania(campania).build()));

            // metemos la fila en la intermedia
            TiendaTurno tt = new TiendaTurno();
            tt.setVoluntario(voluntario);
            tt.setTienda(tienda);
            tt.setTurno(turno);
            tiendaTurnoRepo.save(tt);
        }
    }

    @Transactional
    public void guardarVoluntario(VoluntarioNuevoDTO dto) {
        Voluntario v = new Voluntario();
        v.setObservaciones(dto.getObservaciones());
        v.setHorasSueltas(Boolean.TRUE.equals(dto.getHorasSueltas()));

        // AYUDA IA para manejo Localtime
        // pasamos de string a localtime nativo
        if (v.getHorasSueltas() && dto.getHoraInicio() != null && dto.getHoraFin() != null) {
            v.setHoraComienzo(LocalTime.parse(dto.getHoraInicio()));
            v.setHoraFinal(LocalTime.parse(dto.getHoraFin()));
        }

        responsableRepo.findById(dto.getResponsableId()).ifPresent(v::setResponsable);

        // primero guardamos el vol para tener id
        Voluntario volGuardado = voluntarioRepo.save(v);

        // ya con id generamos los turnos
        procesarAsignaciones(volGuardado, dto.getTurnosAsignados(), dto.getCampaniaId());
    }

    @Transactional
    public void actualizarVoluntario(Long voluntarioId, VoluntarioNuevoDTO dto) {
        Voluntario v = voluntarioRepo.findById(voluntarioId)
                .orElseThrow(() -> new RuntimeException("Voluntario no encontrado"));

        // actualizamos campos basicos
        v.setObservaciones(dto.getObservaciones());
        responsableRepo.findById(dto.getResponsableId()).ifPresent(v::setResponsable);
        voluntarioRepo.save(v);

        // OJO!! vaciamos tabla intermedia para q no de error de claves duplicadas!!!!
        tiendaTurnoRepo.deleteByVoluntarioId(v.getId());
        tiendaTurnoRepo.flush();

        // metemos los nuevos q llegan del jsp
        procesarAsignaciones(v, dto.getTurnosAsignados(), dto.getCampaniaId());
    }

    @Transactional
    public void eliminarVoluntario(Long idVoluntario) {
        voluntarioRepo.findById(idVoluntario).ifPresent(voluntario -> {

            // limpiamos turnos asociados para no dejar datos huerfanos!!!!
            tiendaTurnoRepo.deleteByVoluntarioId(voluntario.getId());

            // forzamos el borrado antes de borar al vol
            tiendaTurnoRepo.flush();

            // quitamos clave foranea del resp
            voluntario.setResponsable(null);

            // borramos vol
            voluntarioRepo.delete(voluntario);
        });
    }
}