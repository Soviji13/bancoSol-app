//francisco javier garcia sierra 0% ia

package com.bancosol.mapper;

import com.bancosol.dto.VoluntarioDTO;
import com.bancosol.entities.Voluntario;
import org.springframework.stereotype.Component;

@Component
public class VoluntarioMapper extends MapperDTO<VoluntarioDTO, Voluntario> {

    @Override
    public VoluntarioDTO toDTO(Voluntario v) {
        VoluntarioDTO dto = new VoluntarioDTO();

        dto.setId(v.getId());
        dto.setObservaciones(v.getObservaciones());
        dto.setHorasSueltas(v.getHorasSueltas());
        dto.setHoraComienzo(v.getHoraComienzo());
        dto.setHoraFinal(v.getHoraFinal());

        //sacamos datos del contacto y entidad asegurando 100% q no reviente por null
        if (v.getResponsable() != null) {
            dto.setResponsableId(v.getResponsable().getId());

            if (v.getResponsable().getContacto() != null) {
                dto.setNombreResponsable(v.getResponsable().getContacto().getNombre());
                dto.setTelefono(v.getResponsable().getContacto().getTelefono());
                dto.setEmail(v.getResponsable().getContacto().getEmail());
            } else {
                dto.setNombreResponsable("Sin nombre");
            }

            if (v.getResponsable().getColaborador() != null) {
                dto.setPerteneceA(v.getResponsable().getColaborador().getNombre());
            } else {
                dto.setPerteneceA("Sin entidad");
            }
        } else {
            dto.setNombreResponsable("Sin responsable");
            dto.setPerteneceA("Sin entidad");
        }

        return dto;
    }
}