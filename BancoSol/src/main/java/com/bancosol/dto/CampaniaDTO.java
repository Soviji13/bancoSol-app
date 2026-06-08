package com.bancosol.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampaniaDTO {

    private Long id;

    private String nombre;

    private Boolean activa;

    private LocalDate fechaInicio;

    private LocalDate fechaFin;

    private Short anio;

    private List<Long> idsCadenas;

    private List<Long> idsTiendas;

    private List<Long> idsColaboradores;

    private List<Long> idsCoordinadores;

    private List<Long> idsResponsables;
}