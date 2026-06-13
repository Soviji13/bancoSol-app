package com.bancosol.services;

import com.bancosol.dao.*;
import com.bancosol.dto.TiendaDTO;
import com.bancosol.entities.Direccion;
import com.bancosol.entities.Tienda;
import com.bancosol.entities.TiendaColaborador;
import com.bancosol.mapper.TiendaMapper;

import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor // Sofía
public class TiendaService {

    // Integración Sofía para Backend (0% IA generativa) --------------
    private final TiendaRepository tiendaRepo;
    private final TiendaMapper tiendaMapper;

    //fran {
    private final DireccionRepository direccionRepo;
    private final LocalidadRepository localidadRepo;
    private final CodigoPostalRepository cpRepo;
    private final DistritoRepository distritoRepo;
    private final CadenaRepository cadenaRepo;
    private final CampaniaRepository campaniaRepo;
    private final TiendaColaboradorRepository tiendaColaboradorRepo;
    private final ResponsableTiendaRepository responsableTiendaRepo;
    // }

    public List <TiendaDTO> listarTodas () {
        return tiendaMapper.toDTOList(tiendaRepo.findAll());
    }

    public TiendaDTO findById (Long id) {
        return tiendaMapper.toDTO(tiendaRepo.findById(id).orElse(null));
    }

    // Devuelve todas las que se encuentren en el Array de Ids
    public List<TiendaDTO> findAllById(List<Long> ids) {
        return tiendaMapper.toDTOList(tiendaRepo.findAllById(ids));
    }

    // Fin integración Sofía ---------------------------------------------------


    //francisco javier garcia sierra 0% ia
    //le metemos al mapper las tiendas para q las pase a una lista de dtos
    public List<TiendaDTO> listarTiendasPorCampania(Long campaniaId) {
        List<Tienda> tiendasBD = tiendaRepo.filtrarPorCampania(campaniaId);

        return tiendaMapper.toDTOList(tiendasBD);
    }

    @Transactional
    public void aniadirNuevaTienda(TiendaDTO dto, Long campaniaId, Long localidadId, Long cpId, Long responsableId) {

        //creamos direccion y guardamos primero para enlazarla a tienda despues
        Direccion nuevaDireccion = new Direccion();
        nuevaDireccion.setCalle(dto.getCalle());

        short numero = dto.getNumero() != null ? dto.getNumero() : (short) 0; //le meto un 0 para no meter null
        nuevaDireccion.setNumero(numero);

        localidadRepo.findById(localidadId).ifPresent(nuevaDireccion::setLocalidad);

        cpRepo.findById(cpId).ifPresent(nuevaDireccion::setCodigoPostal);

        Direccion direccionGuardada = direccionRepo.save(nuevaDireccion);

        //creamos tienda con datos basicos
        Tienda nuevaTienda = new Tienda();
        nuevaTienda.setNombre(dto.getNombre());
        nuevaTienda.setEsFranquicia(dto.getEsFranquicia());
        nuevaTienda.setPuntosRecogida(dto.getPuntosRecogida());
        nuevaTienda.setDireccion(direccionGuardada);
        cadenaRepo.findById(dto.getCadenaId()).ifPresent(nuevaTienda::setCadena);

        //ASIGNACIÓN 1:1 DIRECTA!!!!! Q ANTES ESTABA PUESTA COMO 1:M
        if (responsableId != null) {
            responsableTiendaRepo.findById(responsableId).ifPresent(nuevaTienda::setResponsableTienda);
        }

        //vinculamos campania
        if (campaniaId != null) {
            campaniaRepo.findById(campaniaId).ifPresent(campania -> {
                if (nuevaTienda.getCampanias() == null) {
                    nuevaTienda.setCampanias(new java.util.ArrayList<>());
                }
                nuevaTienda.getCampanias().add(campania);
            });
        }

        tiendaRepo.save(nuevaTienda);
    }

    @Transactional
    public void vincularTiendaACampania(Long tiendaId, Long campaniaId) {
        //buscamos tienda y campania y si no esta vinculada la aniadimos
        tiendaRepo.findById(tiendaId).ifPresent(tienda -> {
            campaniaRepo.findById(campaniaId).ifPresent(campania -> {
                if (tienda.getCampanias() == null) {
                    tienda.setCampanias(new java.util.ArrayList<>());
                }
                if (!tienda.getCampanias().contains(campania)) {
                    tienda.getCampanias().add(campania);
                    tiendaRepo.save(tienda);
                }
            });
        });
    }

    @Transactional
    public void actualizarTiendaExistente(TiendaDTO dto, Long localidadId, Long distritoId, Long cpId, Long responsableId) {
        tiendaRepo.findById(dto.getId()).ifPresent(tienda -> {
            //campos básicos de la tienda
            tienda.setNombre(dto.getNombre());
            tienda.setEsFranquicia(dto.getEsFranquicia());
            tienda.setPuntosRecogida(dto.getPuntosRecogida());

            //vincular la cadena
            if (dto.getCadenaId() != null) {
                cadenaRepo.findById(dto.getCadenaId()).ifPresent(tienda::setCadena);
            } else {
                tienda.setCadena(null);
            }

            //vincular resp tienda
            if (responsableId != null) {
                responsableTiendaRepo.findById(responsableId).ifPresent(tienda::setResponsableTienda);
            } else {
                tienda.setResponsableTienda(null);
            }

            //actualizar direccion seguro evitando nulls
            Direccion dir = tienda.getDireccion();
            if (dir == null) {
                dir = new Direccion();
            }
            dir.setCalle(dto.getCalle());
            dir.setNumero(dto.getNumero() != null ? dto.getNumero() : (short) 0);

            if (localidadId != null) {
                localidadRepo.findById(localidadId).ifPresent(dir::setLocalidad);
            }

            //GUARDAMOS DISTRITO SIEMPRE Q NO SEA NULO!!!!
            if (distritoId != null) {
                distritoRepo.findById(distritoId).ifPresent(dir::setDistrito);
            } else {
                dir.setDistrito(null); //si cambia a otra localidad y manda null lo limpiamos de bd
            }

            if (cpId != null) {
                cpRepo.findById(cpId).ifPresent(dir::setCodigoPostal);
            } else {
                dir.setCodigoPostal(null);
            }

            Direccion direccionGuardada = direccionRepo.save(dir);
            tienda.setDireccion(direccionGuardada);

            //guardamos los cambios finales de la tienda
            tiendaRepo.save(tienda);
        });
    }


    @Transactional
    public void eliminarTienda(Long idTienda) {
        tiendaRepo.findById(idTienda).ifPresent(tienda -> {

            //limpiamos tablas intermedias para no dejar datos huerfanos!!!!
            if (tienda.getColaboradores() != null) {
                tienda.getColaboradores().clear();
            }
            if (tienda.getCampanias() != null) {
                tienda.getCampanias().clear();
            }


            Direccion direccionAsociada = tienda.getDireccion();

            //borramos tienda
            tiendaRepo.delete(tienda);

            //borramos direccion asociada
            if (direccionAsociada != null) {
                direccionRepo.delete(direccionAsociada);
            }
        });
    }

    //USO IA: aplicamos cambios necesarios para valores seguros q sugirio ia en repository!!!!
    public List<TiendaDTO> listarTiendasFiltradas(Long campaniaId, String nombre, Long cadenaId, Long localidadId, Long distritoId, Long zonaGeoId, Long colaboradorId, String franquiciaStr) {

        //transformamos nulls en valores seguros para evitar errores fatales en postgres!!!!
        String nombreFiltro = (nombre != null) ? nombre.trim() : "";
        Long cadenaFiltro = (cadenaId != null) ? cadenaId : -1L;
        Long localidadFiltro = (localidadId != null) ? localidadId : -1L;
        Long distritoFiltro = (distritoId != null) ? distritoId : -1L;
        Long zonaGeoFiltro = (zonaGeoId != null) ? zonaGeoId : -1L;
        Long colaboradorFiltro = (colaboradorId != null) ? colaboradorId : -1L;
        String franquiciaFiltro = (franquiciaStr != null && !franquiciaStr.isEmpty()) ? franquiciaStr : "TODAS";

        List<Tienda> tiendasBD = tiendaRepo.filtrarTiendasAvanzado(
                campaniaId, nombreFiltro, cadenaFiltro, localidadFiltro, distritoFiltro, zonaGeoFiltro, colaboradorFiltro, franquiciaFiltro
        );
        return tiendaMapper.toDTOList(tiendasBD);
    }
}