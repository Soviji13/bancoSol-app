package com.bancosol.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TiendaColaboradorDTO {
    private Long id;
    private Long tiendaId;
    private Long colaboradorId; // Apunta a EntidadColaboradora
    private Long campaniaId;
}