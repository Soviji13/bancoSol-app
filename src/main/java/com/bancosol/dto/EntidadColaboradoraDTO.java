package com.bancosol.dto;

import lombok.*;

import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class EntidadColaboradoraDTO {
    private Long id;
    private String nombre;
    private Boolean estadoActivo;
    private String observaciones;
    
    private Long coordinadorId;
    private Long direccionId;


    private List<Long> idsTiendas;       // Sustituye a TiendaColaborador
    private List<Long> idsResponsables;     // Sustituye a ResponsableEntidad
}