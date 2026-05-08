package com.bancosol.dto;

import lombok.*;

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
}