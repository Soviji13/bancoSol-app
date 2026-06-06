package com.bancosol.services;

import com.bancosol.dao.EntidadColaboradoraRepository;
import com.bancosol.dao.TiendaColaboradorRepository;
import com.bancosol.dto.CampaniaDTO;
import com.bancosol.dto.EntidadColaboradoraDTO;
import com.bancosol.dto.TiendaDTO;
import com.bancosol.entities.Campania;
import com.bancosol.entities.TiendaColaborador;
import com.bancosol.mapper.CampaniaMapper;
import com.bancosol.mapper.EntidadColaboradoraMapper;
import com.bancosol.mapper.TiendaMapper;

import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class EntidadColaboradoraService {

    // Refactorización de Sofía (IA para acceso a tabla de triple entidad SOLO DONDE SE INDICA)

    private final EntidadColaboradoraRepository entidadRepo;
    private final EntidadColaboradoraMapper entidadMapper;

    private final TiendaColaboradorRepository tiendaColabRepo;

    private final TiendaMapper tiendaMapper;

    private final CampaniaMapper campaniaMapper;
    private final CampaniaService campaniaService;

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
            this.tiendaColabRepo.findTiendaColabByCampaniaId(campaniaId);

        
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

    // Ayuda de la IA para filtrar, razonamiento mío
    // Devuelve una entidad específica con sus tiendas asignadas a esa campaña por el ID de la entidad
    public EntidadColaboradoraDTO findByCampaniaId (Long campaniaId, Long entidadId) {
        
        // Se obtiene la tabla intermedia
        List <TiendaColaborador> tiendasConColaboradorEnCampania =
            this.tiendaColabRepo.findTiendaColabByCampaniaId(campaniaId);

        // Se filtran solo las que el id del colaborador coincide con entidadId
        List <TiendaColaborador> tiendasEntidadFiltrada =
            tiendasConColaboradorEnCampania.stream()
            .filter(tiendaColab -> tiendaColab.getColaborador().getId().equals(entidadId))
            .collect(Collectors.toList());
        
        // Obtenemos una entidad de las filtradas, p.e la primera (todas son la misma)
        // La pasamos ya a DTO
        EntidadColaboradoraDTO dto = entidadMapper.toDTO(
            tiendasEntidadFiltrada.get(0).getColaborador()
        );
        
        // Le añadimos las tiendas
        List<String> nombresTiendas = tiendasEntidadFiltrada.stream()
        .map(tc -> tc.getTienda().getNombre())
        .distinct()
        .collect(Collectors.toList());

        dto.setNombresTiendas(nombresTiendas);

        return dto;
    }

    // Devuelve todos las tiendas de la entidad colaboradora 
    public List <TiendaDTO> devolverTodasLasTiendas (Long entidadId) {

        List <TiendaColaborador> todasTiendasEntidad = this.tiendaColabRepo.findByColaboradorId(entidadId);

        return todasTiendasEntidad.stream()
        .map(tc -> this.tiendaMapper.toDTO(tc.getTienda())) 
        .distinct()                                                       
        .collect(Collectors.toList());
    }

    // Devuelve las campañas de la entidad colaboradora
    public List <CampaniaDTO> devolverTodasLasCampanias (Long entidadId) {

        List <TiendaColaborador> todasTiendasEntidad = this.tiendaColabRepo.findByColaboradorId(entidadId);

        return todasTiendasEntidad.stream()
        .map(tc -> this.campaniaMapper.toDTO(tc.getCampania())) 
        .distinct()                                                       
        .collect(Collectors.toList());
    }

    // Devuelve todos los nombres de tiendas de la entidad colaboradora y de la campaña concreta
    public List <TiendaDTO> devolverTiendasPorCampania (Long entidadId, Long campaniaId) {

        List <TiendaColaborador> todasTiendasEntidad = this.tiendaColabRepo.findByColaboradorId(entidadId);

        return todasTiendasEntidad.stream()
        .filter(tc -> tc.getColaborador().getId().equals(entidadId) && tc.getCampania().getId().equals(campaniaId))
        .map(tc -> this.tiendaMapper.toDTO(tc.getTienda())) 
        .distinct()                                                       
        .collect(Collectors.toList());
    }

    // Devuelve todas las campañas en las que participa junto a todas sus tiendas
    public Map <Long, List <TiendaDTO>> devolverCampaniasConTodasTiendas (Long entidadId) {

        List <CampaniaDTO> campaniasEntidad = devolverTodasLasCampanias(entidadId);

        Map <Long, List <TiendaDTO>> res = new HashMap<>();

        for (CampaniaDTO c : campaniasEntidad) {
            if (c != null) {
                res.put(c.getId(), this.campaniaService.devolverTiendas(c.getId()));
            }
        }

        return res;
    }

    // Devuelve todas las campañas en las que participa junto a las tiendas respectivas en las que participa 
    public Map <Long, List <TiendaDTO>> devolverCampaniasConTiendas (Long entidadId) {

        List <CampaniaDTO> campaniasEntidad = devolverTodasLasCampanias(entidadId);

        Map <Long, List <TiendaDTO>> res = new HashMap<>();

        for (CampaniaDTO c : campaniasEntidad) {
            if (c != null) {
                res.put(c.getId(), devolverTiendasPorCampania(entidadId, c.getId()));
            }
        }

        return res;
    }

    // Devuelve todo el par tienda-campania existente



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