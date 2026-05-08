package com.bancosol.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ResponsableTiendaDTO {
    private Long id;
    private String nombre;
    private Long usuarioId;  // Referencia a su cuenta de usuario
    private Long contactoId; // Referencia a su información de contacto
}