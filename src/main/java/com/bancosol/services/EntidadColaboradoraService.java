package com.bancosol.services;

import com.bancosol.dao.EntidadColaboradoraRepository;
import com.bancosol.dao.TiendaColaboradorRepository;
import com.bancosol.dto.EntidadColaboradoraDTO;
import com.bancosol.entities.TiendaColaborador;
import com.bancosol.mapper.EntidadColaboradoraMapper;


import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class EntidadColaboradoraService {

    // Refactorización de Sofía (IA para acceso a tabla de triple entidad)

    private final EntidadColaboradoraRepository entidadRepo;
    private final EntidadColaboradoraMapper entidadMapper;

    private final TiendaColaboradorRepository tiendaColabRepo;

    public List <EntidadColaboradoraDTO> listarTodas () {
        return entidadMapper.toDTOList(entidadRepo.findAll());
    }

    public EntidadColaboradoraDTO findById (Long id) {
        return entidadMapper.toDTO(entidadRepo.findById(id).orElse(null));
    }

    // Devuelve todas las que se encuentren en el Array de Ids
    public List<EntidadColaboradoraDTO> findAllById(List<Long> ids) {
        return entidadMapper.toDTOList(entidadRepo.findAllById(ids));
    }

    // Uso de IA aquí (como ayuda)
    // Devuelve las de una campaña específica con sus tiendas únicamente respectivas
    // Única función que le añade al DTO las tiendas asignadas
    public List<EntidadColaboradoraDTO> findAllByCampaniaId (Long campaniaId) {
        
        // Se obtiene la tabla intermedia
        List <TiendaColaborador> tiendasConColaboradorEnCampania =
            this.tiendaColabRepo.findByCampaniaId(campaniaId);

        
        List <EntidadColaboradoraDTO> entidadesConTiendas = 
            // Recorremos la tabla intermedia
            tiendasConColaboradorEnCampania.stream()
            // Se agrupan dependiendo del colaborador (clave colaborador, valor tabla intermedia)
            .collect(Collectors.groupingBy(TiendaColaborador::getColaborador))
            .entrySet().stream()
            // Recorremos cada entidad colaboradora
            .map(e -> {

                // Obtenemos el colaborador con e.getKey
                // Obtenemos la tabla intermedia con e.getValue()

                // Pasamos casi todos los parámetros a DTO
                EntidadColaboradoraDTO dto = entidadMapper.toDTO(e.getKey());

                // Pasamos las tiendas correspondientes
                List<String> nombresTiendas = e.getValue().stream()
                    .map(tc -> tc.getTienda().getNombre())
                    .distinct()
                    .collect(Collectors.toList());
                        
                dto.setNombresTiendas(nombresTiendas);

                return dto;
        })
        .collect(Collectors.toList());

        return entidadesConTiendas;
    }

    // Final parte Sofía

    /* 
    private final EntidadColaboradoraRepository repo;
    public EntidadColaboradoraService(EntidadColaboradoraRepository repo) { this.repo = repo; }

    public List<EntidadColaboradoraDTO> listarTodas() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private EntidadColaboradoraDTO toDTO(EntidadColaboradora e) {
        return EntidadColaboradoraDTO.builder()
                .id(e.getId())
                .nombre(e.getNombre())
                .estadoActivo(e.getEstadoActivo())
                .observaciones(e.getObservaciones())
                .numTiendas(e.getNumTiendas())
                .numTurnos(e.getNumTurnos())
                .numVoluntarios(e.getNumVoluntarios())
                .coordinadorId(e.getCoordinador() != null ? e.getCoordinador().getId() : null)
                .direccionId(e.getDireccion() != null ? e.getDireccion().getId() : null)

                // 1. IDs de Tiendas (Relación directa ManyToMany refactorizada)
                .idsTiendas(e.getTiendas() == null ? List.of() :
                        e.getTiendas().stream()
                                .map(Tienda::getId)
                                .collect(Collectors.toList()))

                // 2. IDs de Contactos (Responsables)
                // Si borraste ResponsableEntidad, aquí mapeas la relación directa que hayas dejado
                .idsContactos(List.of()) // Ajustar según la nueva relación directa en la Entity

                .build();
    }
    */
}