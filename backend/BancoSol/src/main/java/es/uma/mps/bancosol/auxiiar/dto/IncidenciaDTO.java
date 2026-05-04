package com.bancosol.dto;

import com.bancosol.entities.enums.EstadoIncidencia;
import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class IncidenciaDTO {
    private Long id;
    private LocalDateTime fechaHora;
    private String asunto;
    private String descripcion;
    private EstadoIncidencia estado;
    private Long responsableTiendaId;
    private Long responsableEntidadId;
}