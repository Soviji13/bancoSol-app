package com.bancosol.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CoordinadorCampaniaDTO {
    private Long id;
    private Long coordinadorId;
    private Long campaniaId;
}