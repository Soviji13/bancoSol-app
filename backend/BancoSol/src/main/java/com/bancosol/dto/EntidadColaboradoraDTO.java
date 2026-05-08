package com.bancosol.dto;

import lombok.*;

import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class EntidadColaboradoraDTO {
    private Long id;
    private String nombre;
    private Boolean estadoActivo;
    private String observaciones;
    private Short numTiendas;
    private Short numTurnos;
    private Short numVoluntarios;
    private Long coordinadorId;
    private Long direccionId;

    // Relaciones por ID
    private List<Long> idsTiendasAsignadas; // Para TiendaColaborador
    private List<Long> idsCampanias;        // Para ColaboradorCampania
    private List<Long> idsResponsables;     // Para ResponsableEntidad
}