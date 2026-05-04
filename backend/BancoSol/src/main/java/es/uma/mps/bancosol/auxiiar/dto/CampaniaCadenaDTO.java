package com.bancosol.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CampaniaCadenaDTO {
    private Long id;
    private Boolean participa;
    private Long cadenaId;   // Pasamos solo el ID para simplificar
    private Long campaniaId;
}