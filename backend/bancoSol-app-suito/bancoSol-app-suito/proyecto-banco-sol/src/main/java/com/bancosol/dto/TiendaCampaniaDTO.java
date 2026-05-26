package com.bancosol.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TiendaCampaniaDTO {
    private Long id;
    private Long tiendaId;
    private Long campaniaId;
}