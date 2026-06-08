package com.bancosol.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidenciaDTO {

    private Long id;

    private LocalDateTime fechaHora;

    private String asunto;

    private String descripcion;

    private String estado;

    private Long responsableTiendaId;
    private String responsableTiendaNombre;

    private Long responsableEntidadId;
    private String responsableEntidadNombre;

    private String reportadoPorTipo;
    private String reportadoPorNombre;
}