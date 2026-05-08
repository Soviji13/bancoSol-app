package com.bancosol.dto;

import lombok.*;

import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TiendaDTO {
    private Long id;
    private String nombre;
    private Short puntosRecogida;
    private Boolean esFranquicia;
    private Long cadenaId;    // A qué cadena pertenece
    private Long direccionId; // Su dirección exclusiva

    // Relaciones por ID
    private List<Long> idsCampanias;   // Para TiendaCampania
    private List<Long> idsEntidades;   // Para TiendaColaborador
    private List<Long> idsResponsables; // Para TiendaResponsable (ternaria con campaña)
}