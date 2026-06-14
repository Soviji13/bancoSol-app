// Realización: Alejandro Jiménez González
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
    private Short anio;
    private Boolean activa;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    private List<Long> idsCadenas;       // Sustituye a CampaniaCadena
    private List<Long> idsTiendas;       // Sustituye a TiendaCampania
    private List<Long> idsColaboradores; // Sustituye a ColaboradorCampania
    private List<Long> idsCoordinadores; // Sustituye a CoordinadorCampania
    private List<Long> idsResponsables;  // Sustituye a TiendaResponsable
}