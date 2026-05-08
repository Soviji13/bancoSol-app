package com.bancosol.dto;

import lombok.*;
import java.time.LocalDate;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CampaniaDTO {
    private Long id;
    private String nombre;
    private Boolean activa;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Short anio; // Solo lectura, pero útil para que el Front lo pinte
}