// Realización: Alejandro Jiménez González
// Esto antes estaba en Service así que era metódico de copiar y pegar
package com.bancosol.mapper;

import com.bancosol.dto.CampaniaDTO;
import com.bancosol.entities.*;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;


@Component
public class CampaniaMapper extends MapperDTO<CampaniaDTO, Campania> {


    public CampaniaDTO toDTO(Campania campania){
        CampaniaDTO dto = new CampaniaDTO();
        dto.setId(campania.getId());
        dto.setNombre(campania.getNombre());
        dto.setAnio(campania.getAnio());
        dto.setActiva(campania.getActiva());
        dto.setFechaInicio(campania.getFechaInicio());
        dto.setFechaFin(campania.getFechaFin());

        List<Long> idsCadenas = new ArrayList<>();
        for(Cadena cadena : campania.getCadenas()){
            idsCadenas.add(cadena.getId());
        }
        dto.setIdsCadenas(idsCadenas);

        List<Long> idsTiendas = new ArrayList<>();
        for(Tienda tienda : campania.getTiendas()){
            idsTiendas.add(tienda.getId());
        }
        dto.setIdsTiendas(idsTiendas);

        List<Long> idsColaboradores = new ArrayList<>();
        for(EntidadColaboradora colaboradora : campania.getColaboradores()){
            idsColaboradores.add(colaboradora.getId());
        }
        dto.setIdsColaboradores(idsColaboradores);

        List<Long> idsCoordinadores = new ArrayList<>();
        for(Coordinador coord : campania.getCoordinadores()){
            idsCoordinadores.add(coord.getId());
        }
        dto.setIdsCoordinadores(idsCoordinadores);

        List<Long> idsResponsables = new ArrayList<>();
        for(ResponsableTienda resp : campania.getResponsables()){
            idsResponsables.add(resp.getId());
        }
        dto.setIdsResponsables(idsResponsables);

        return dto;

    }
}
