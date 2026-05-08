package com.bancosol.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class LocalidadDTO {
    private Long id;
    private String nombre;
    private Long zonaGeoId; // Referencia a la zona geográfica
}