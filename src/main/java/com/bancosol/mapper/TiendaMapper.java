// Creación Mapper básico para poder avanzar con entidad colaboradora
// Sofía Sí Villalba Jiménez (IA Generativa 0%)
//francisco javier garcia sierra ayuda ia en un par de consultas donde se indica


package com.bancosol.mapper;

import com.bancosol.dto.ResponsableEntidadResumenDTO;
import com.bancosol.entities.Campania;
import com.bancosol.entities.TiendaColaborador;
import org.springframework.stereotype.Component;

import com.bancosol.dto.TiendaDTO;
import com.bancosol.entities.Tienda;

import java.util.ArrayList;
import java.util.List;

@Component
public class TiendaMapper extends MapperDTO <TiendaDTO, Tienda> {

    public TiendaDTO toDTO(Tienda tienda) {

        // Sofía
        TiendaDTO dto = new TiendaDTO();

        dto.setId(tienda.getId());
        dto.setNombre(tienda.getNombre());


        // Fin sofía

        //fran:
        //setteo los datos q faltaban
        dto.setPuntosRecogida(tienda.getPuntosRecogida());
        dto.setEsFranquicia(tienda.getEsFranquicia());

        dto.setCalle(tienda.getDireccion().getCalle());
        dto.setNumero(tienda.getDireccion().getNumero());
        dto.setLocalidad(tienda.getDireccion().getLocalidad().getNombre());

        //nmbre de la cadena
        if (tienda.getCadena() != null) {
            dto.setCadenaId(tienda.getCadena().getId());
            dto.setNombreCadena(tienda.getCadena().getNombre());
        }

        if (tienda.getDireccion() != null) {
            dto.setCalle(tienda.getDireccion().getCalle());
            dto.setNumero(tienda.getDireccion().getNumero());

            if (tienda.getDireccion().getCodigoPostal() != null) {
                dto.setCodigoPostal(tienda.getDireccion().getCodigoPostal().getCodigo());
            }
            if (tienda.getDireccion().getDistrito() != null) {
                dto.setDistrito(tienda.getDireccion().getDistrito().getNombre());
            }
            if (tienda.getDireccion().getLocalidad() != null) {
                dto.setLocalidad(tienda.getDireccion().getLocalidad().getNombre());
                if (tienda.getDireccion().getLocalidad().getZonaGeografica() != null) {
                    dto.setZonaGeografica(tienda.getDireccion().getLocalidad().getZonaGeografica().getNombre());
                }
            }
        }

        // Responsable de tienda
        if (tienda.getResponsableTienda() != null) {
            var resp = tienda.getResponsableTienda();
            dto.setResponsableTiendaId(resp.getId());

            if (resp.getContacto() != null && resp.getContacto().getNombre() != null) {
                dto.setNombreResponsable(resp.getContacto().getNombre());
            } else if (resp.getContacto().getNombre() != null) {
                dto.setNombreResponsable(resp.getContacto().getNombre());
            }
        } else {
            dto.setNombreResponsable("No asignado");
            dto.setResponsableTiendaId(null);
        }


        // responsablesEnt y entidades AYUDA IA PARA REFACTORIZAR Y CORRECCION
        List<ResponsableEntidadResumenDTO> listaResponsables = new ArrayList<>();
        String primerNombreEntidad = "Sin entidad asignada";

        if (tienda.getColaboradores() != null && !tienda.getColaboradores().isEmpty()) {
            var primeraEntidad = tienda.getColaboradores().get(0);
            primerNombreEntidad = primeraEntidad.getNombre() != null ? primeraEntidad.getNombre() : "Sin entidad";

            for (var entidad : tienda.getColaboradores()) {
                String nombreEnt = entidad.getNombre() != null ? entidad.getNombre() : "Sin entidad";
                String nombreResp = "Sin responsable asignado";

                if (entidad.getResponsables() != null && !entidad.getResponsables().isEmpty()) {
                    var resp = entidad.getResponsables().get(0);
                    if (resp.getContacto() != null && resp.getContacto().getNombre() != null) {
                        nombreResp = resp.getContacto().getNombre();
                    } else if (resp.getContacto().getNombre() != null) {
                        nombreResp = resp.getContacto().getNombre();
                    }
                }
                listaResponsables.add(new ResponsableEntidadResumenDTO(nombreResp, nombreEnt));
            }
        }

        dto.setNombreEntidad(primerNombreEntidad);
        dto.setResponsablesLista(listaResponsables);

        // Mapear si Participa en la Campaña Activa AYUDA IA
        boolean participaActiva = false;
        if (tienda.getCampanias() != null) {
            for (Campania c : tienda.getCampanias()) {
                if (c != null && Boolean.TRUE.equals(c.getActiva())) {
                    participaActiva = true;
                    break;
                }
            }
        }
        dto.setParticipaCampaniaActiva(participaActiva);

        return dto;
    }
}