//francisco javier garcia sierra 0% ia

package com.bancosol.services;

import com.bancosol.dao.VoluntarioRepository;
import com.bancosol.dto.VoluntarioDTO;
import com.bancosol.entities.Voluntario;
import com.bancosol.mapper.VoluntarioMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.AllArgsConstructor;

import java.util.List;

@Service
@AllArgsConstructor
public class VoluntarioService {

    private final VoluntarioRepository voluntarioRepo;
    private final VoluntarioMapper voluntarioMapper;

    public List<VoluntarioDTO> listarTodos() {
        return voluntarioMapper.toDTOList(voluntarioRepo.findAll());
    }

    public List<VoluntarioDTO> listarPorCampania(Long campaniaId) {
        return voluntarioMapper.toDTOList(voluntarioRepo.filtrarPorCampania(campaniaId));
    }

    public VoluntarioDTO findById(Long id) {
        return voluntarioRepo.findById(id).map(voluntarioMapper::toDTO).orElse(null);
    }

    public List<VoluntarioDTO> listarVoluntariosFiltrados(Long campaniaId, String nombre, Long entidadId, String horasSueltasStr) {
        String nombreFiltro = (nombre != null) ? nombre.trim() : "";
        Long entidadFiltro = (entidadId != null) ? entidadId : -1L;

        Boolean horasSueltasFiltro = null;
        if (horasSueltasStr != null && !horasSueltasStr.isEmpty() && !horasSueltasStr.equals("TODAS")) {
            horasSueltasFiltro = horasSueltasStr.equals("SI");
        }

        List<Voluntario> bd = voluntarioRepo.filtrarVoluntariosAvanzado(campaniaId, nombreFiltro, entidadFiltro, horasSueltasFiltro);
        return voluntarioMapper.toDTOList(bd);
    }

    @Transactional
    public void eliminarVoluntario(Long id) {
        voluntarioRepo.findById(id).ifPresent(voluntarioRepo::delete);
    }
}