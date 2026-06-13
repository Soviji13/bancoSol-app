// Creación Mapper básico para poder avanzar con entidad colaboradora
// Sofía Sí Villalba Jiménez (IA Generativa 0%)

//francisco javier garcia sierra: Uso de ia en un par de consultas donde se indica


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

        //francisco javier garcia sierra:

        //seteamos datos basicos sueltos
        dto.setPuntosRecogida(tienda.getPuntosRecogida());
        dto.setEsFranquicia(tienda.getEsFranquicia());

        //comprobamos q haya cadena antes de sacar nombre o id para q no casque!!!!
        if (tienda.getCadena() != null) {
            dto.setCadenaId(tienda.getCadena().getId());
            dto.setNombreCadena(tienda.getCadena().getNombre());
        }

        //vamos sacando datos de direccion paso a paso !!asegurando q existen!!
        if (tienda.getDireccion() != null) {
            dto.setCalle(tienda.getDireccion().getCalle());
            dto.setNumero(tienda.getDireccion().getNumero());

            //filtramos cp
            if (tienda.getDireccion().getCodigoPostal() != null) {
                dto.setCodigoPostal(tienda.getDireccion().getCodigoPostal().getCodigo());
            }

            //filtramos distrito por si no es malaga capital
            if (tienda.getDireccion().getDistrito() != null) {
                dto.setDistrito(tienda.getDireccion().getDistrito().getNombre());
            }

            //filtramos localidad y de paso enganchamos zona geografica si existe!!!!
            if (tienda.getDireccion().getLocalidad() != null) {
                dto.setLocalidad(tienda.getDireccion().getLocalidad().getNombre());
                if (tienda.getDireccion().getLocalidad().getZonaGeografica() != null) {
                    dto.setZonaGeografica(tienda.getDireccion().getLocalidad().getZonaGeografica().getNombre());
                }
            }
        }

        //miramos si hay responsable de tienda asignado a  la tienda
        if (tienda.getResponsableTienda() != null) {
            var resp = tienda.getResponsableTienda();
            dto.setResponsableTiendaId(resp.getId());

            //comprobamos q datos de contacto no vienen nulos por seguridad
            if (resp.getContacto() != null && resp.getContacto().getNombre() != null) {
                dto.setNombreResponsable(resp.getContacto().getNombre());
            } else if (resp.getContacto().getNombre() != null) {
                dto.setNombreResponsable(resp.getContacto().getNombre());
            }
        } else {
            //si es null mandamos textos por defecto
            dto.setNombreResponsable("No asignado");
            dto.setResponsableTiendaId(null);
        }

        //ayuda ia: extraccion de lista de entidades colaboradoras y responsables
        List<ResponsableEntidadResumenDTO> listaResponsables = new ArrayList<>();
        String primerNombreEntidad = "Sin entidad asignada";

        //si hay varios colaboradores cogemos primero como resumen principal (el q se muestra en tabla sin haber picnhado en la doble flecha)
        if (tienda.getColaboradores() != null && !tienda.getColaboradores().isEmpty()) {
            var primeraEntidad = tienda.getColaboradores().get(0);
            primerNombreEntidad = primeraEntidad.getNombre() != null ? primeraEntidad.getNombre() : "Sin entidad";

            //iteramos por colaboradores para montar array de responsables
            for (var entidad : tienda.getColaboradores()) {
                String nombreEnt = entidad.getNombre() != null ? entidad.getNombre() : "Sin entidad";
                String nombreResp = "Sin responsable asignado";

                //verificamos q entidad tenga responsables y pillamos su nombre
                if (entidad.getResponsables() != null && !entidad.getResponsables().isEmpty()) {
                    var resp = entidad.getResponsables().get(0);
                    if (resp.getContacto() != null && resp.getContacto().getNombre() != null) {
                        nombreResp = resp.getContacto().getNombre();
                    } else if (resp.getContacto().getNombre() != null) {
                        nombreResp = resp.getContacto().getNombre();
                    }
                }
                //metemos al array para desplegable de tabla!!!
                listaResponsables.add(new ResponsableEntidadResumenDTO(nombreResp, nombreEnt));
            }
        }

        dto.setNombreEntidad(primerNombreEntidad);
        dto.setResponsablesLista(listaResponsables);

        //ayuda ia: comprobamos si de todas las campañas asociadas alguna esta activa y marcamos boolean!!!!
        boolean participaActiva = false;
        if (tienda.getCampanias() != null) {
            for (Campania c : tienda.getCampanias()) {
                if (c != null && Boolean.TRUE.equals(c.getActiva())) {
                    participaActiva = true;
                    break; //con encontrar una activa nos vale (no va a haber mas por la restriccion de la bbdd)
                }
            }
        }
        dto.setParticipaCampaniaActiva(participaActiva);

        return dto;
    }
}