package com.bancosol.mapper;

import com.bancosol.dto.CadenaDTO;
import com.bancosol.entities.Cadena;
import com.bancosol.entities.Campania;

import java.util.ArrayList;
import java.util.List;

public class CadenaMapper extends MapperDTO<CadenaDTO, Cadena> {

    public CadenaDTO toDTO(Cadena cadena) {
        CadenaDTO cadenaDTO = new CadenaDTO();
        cadenaDTO.setId(cadena.getId());
        cadenaDTO.setNombre(cadena.getNombre());
        cadenaDTO.setCodigo(cadena.getCodigo());

        List<Long> idsCampanias = new ArrayList<>();
        for(Campania id : cadena.getCampanias()){
            idsCampanias.add(id.getId());
        }
        cadenaDTO.setIdsCampanias(idsCampanias);
        return cadenaDTO;

    }


}
