package com.bancosol.dto;

import lombok.*;
import java.time.ZonedDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ColaboradorCampaniaDTO {
    private Long id;
    private Long entidadId;
    private Long campaniaId;
    private Boolean participa;
    private String observaciones;
    private ZonedDateTime createdAt; // El Front puede formatear esta fecha
}