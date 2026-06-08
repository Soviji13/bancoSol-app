package com.bancosol.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CodigoPostalDTO {
    private Long id;
    private Short codigo; // En tu SQL es smallint
}