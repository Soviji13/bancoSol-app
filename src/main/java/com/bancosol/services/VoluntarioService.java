//francisco javier garcia sierra 0% ia

package com.bancosol.services;

import com.bancosol.dao.TiendaTurnoRepository;
import com.bancosol.dao.VoluntarioRepository;
import com.bancosol.dto.VoluntarioDTO;
import com.bancosol.entities.Tienda;
import com.bancosol.entities.TiendaTurno;
import com.bancosol.entities.Voluntario;
import com.bancosol.mapper.VoluntarioMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class VoluntarioService {

    private final VoluntarioRepository voluntarioRepo;
    private final TiendaTurnoRepository tiendaTurnoRepo;
    private final VoluntarioMapper voluntarioMapper;

    //helper para inyectar asignaciones al dto aislandonos de la bd!!!!
    private VoluntarioDTO enriquecerConAsignaciones(Voluntario v) {
        VoluntarioDTO dto = voluntarioMapper.toDTO(v);

        List<TiendaTurno> asignacionesBD = tiendaTurnoRepo.findByVoluntarioId(v.getId());

        if (!asignacionesBD.isEmpty()) {
            Map<Tienda, List<TiendaTurno>> turnosPorTienda = asignacionesBD.stream()
                    .filter(tt -> tt.getTurno() != null && tt.getTienda() != null)
                    .collect(Collectors.groupingBy(TiendaTurno::getTienda));

            List<VoluntarioDTO.AsignacionDTO> listaAsignaciones = turnosPorTienda.entrySet().stream()
                    .map(entry -> {
                        Tienda tienda = entry.getKey();
                        List<VoluntarioDTO.TurnoVoluntarioDTO> turnos = entry.getValue().stream()
                                .map(tt -> {
                                    String nombreDia = tt.getTurno().getDia().name();
                                    String diaCap = nombreDia.charAt(0) + nombreDia.substring(1).toLowerCase();

                                    String franja = Boolean.TRUE.equals(v.getHorasSueltas()) && v.getHoraComienzo() != null
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

    public List<VoluntarioDTO> buscarTodos() {
        return voluntarioRepo.findAll().stream()
                .map(this::enriquecerConAsignaciones)
                .collect(Collectors.toList());
    }

    public List<VoluntarioDTO> buscarPorCampania(Long campaniaId) {
        return voluntarioRepo.buscarPorCampaniaId(campaniaId).stream()
                .map(this::enriquecerConAsignaciones)
                .collect(Collectors.toList());
    }

    public VoluntarioDTO buscarPorId(Long id) {
        return voluntarioRepo.findById(id)
                .map(this::enriquecerConAsignaciones)
                .orElse(null);
    }

    public List<VoluntarioDTO> buscarFiltrados(Long campaniaId, Long voluntarioId, String nombreEnt, String nombreResp, String nombreTienda) {
        String ent = (nombreEnt != null && !nombreEnt.trim().isEmpty()) ? nombreEnt.trim() : null;
        String resp = (nombreResp != null && !nombreResp.trim().isEmpty()) ? nombreResp.trim() : null;
        String tienda = (nombreTienda != null && !nombreTienda.trim().isEmpty()) ? nombreTienda.trim() : null;

        List<Voluntario> bd = voluntarioRepo.buscarFiltrados(campaniaId, voluntarioId, ent, resp, tienda);
        return bd.stream()
                .map(this::enriquecerConAsignaciones)
                .collect(Collectors.toList());
    }

    @Transactional
    public void eliminarVoluntario(Long id) {
        voluntarioRepo.findById(id).ifPresent(voluntarioRepo::delete);
    }
}