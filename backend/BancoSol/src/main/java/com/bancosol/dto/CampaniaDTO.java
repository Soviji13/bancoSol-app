package com.bancosol.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampaniaDTO {
    private Long id;
    private String nombre;
    private Integer anio;
    private Boolean activa;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    private List<Long> idsCadenas;       // Para CampaniaCadena
    private List<Long> idsTiendas;       // Para TiendaCampania
    private List<Long> idsCoordinadores; // Para CoordinadorCampania
}