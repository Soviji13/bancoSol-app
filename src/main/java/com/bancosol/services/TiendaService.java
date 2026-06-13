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

        Direccion nuevaDireccion = new Direccion();
        nuevaDireccion.setCalle(dto.getCalle());
        short numero = dto.getNumero() != null ? dto.getNumero() : (short) 0;
        nuevaDireccion.setNumero(numero);
        localidadRepo.findById(localidadId).ifPresent(nuevaDireccion::setLocalidad);


        cpRepo.findById(cpId).ifPresent(nuevaDireccion::setCodigoPostal);

        Direccion direccionGuardada = direccionRepo.save(nuevaDireccion);

        Tienda nuevaTienda = new Tienda();
        nuevaTienda.setNombre(dto.getNombre());
        nuevaTienda.setEsFranquicia(dto.getEsFranquicia());
        nuevaTienda.setPuntosRecogida(dto.getPuntosRecogida());
        nuevaTienda.setDireccion(direccionGuardada);
        cadenaRepo.findById(dto.getCadenaId()).ifPresent(nuevaTienda::setCadena);

        // ASIGNACIÓN 1:1 DIRECTA
        if (responsableId != null) {
            responsableTiendaRepo.findById(responsableId).ifPresent(nuevaTienda::setResponsableTienda);
        }

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
            // 1. Campos básicos de la Tienda
            tienda.setNombre(dto.getNombre());
            tienda.setEsFranquicia(dto.getEsFranquicia());
            tienda.setPuntosRecogida(dto.getPuntosRecogida());

            // 2. Vincular Cadena
            if (dto.getCadenaId() != null) {
                cadenaRepo.findById(dto.getCadenaId()).ifPresent(tienda::setCadena);
            } else {
                tienda.setCadena(null);
            }

            // 3. Vincular Responsable de Tienda
            if (responsableId != null) {
                responsableTiendaRepo.findById(responsableId).ifPresent(tienda::setResponsableTienda);
            } else {
                tienda.setResponsableTienda(null);
            }

            // 4. Actualizar Dirección asociada de forma segura
            Direccion dir = tienda.getDireccion();
            if (dir == null) {
                dir = new Direccion();
            }
            dir.setCalle(dto.getCalle());
            dir.setNumero(dto.getNumero() != null ? dto.getNumero() : (short) 0);

            if (localidadId != null) {
                localidadRepo.findById(localidadId).ifPresent(dir::setLocalidad);
            }

            // NUEVO: GUARDAR EL DISTRITO SIEMPRE QUE NO SEA NULO
            if (distritoId != null) {
                distritoRepo.findById(distritoId).ifPresent(dir::setDistrito);
            } else {
                dir.setDistrito(null); // Si cambia a otra localidad y manda null, lo limpiamos de la BD
            }

            if (cpId != null) {
                cpRepo.findById(cpId).ifPresent(dir::setCodigoPostal);
            } else {
                dir.setCodigoPostal(null);
            }

            Direccion direccionGuardada = direccionRepo.save(dir);
            tienda.setDireccion(direccionGuardada);

            // 5. Guardamos los cambios finales de la Tienda
            tiendaRepo.save(tienda);
        });
    }



}