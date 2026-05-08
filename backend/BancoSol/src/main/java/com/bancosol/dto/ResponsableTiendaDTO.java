package com.bancosol.dto;

import lombok.*;

import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ResponsableTiendaDTO {
    private Long id;
    private String nombre;
    private Long usuarioId;  // Referencia a su cuenta de usuario
    private Long contactoId; // Referencia a su información de contacto

    // Relaciones por ID
    private List<Long> idsTiendas;   // Para TiendaResponsable
    private List<Long> idsCampanias; // Para saber en qué campañas ha sido responsable
}