package com.bancosol.dto;

import lombok.*;
import java.time.LocalTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class VoluntarioDTO {
    private Long id;
    private String observaciones;
    private Boolean horasSueltas;
    private LocalTime horaComienzo;
    private LocalTime horaFinal;
    private Long responsableId; // Referencia al responsable de entidad
}