package com.bancosol.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TiendaDTO {
    private Long id;
    private String nombre;
    private Short puntosRecogida;
    private Boolean esFranquicia;
    private Long cadenaId;    // A qué cadena pertenece
    private Long direccionId; // Su dirección exclusiva
}