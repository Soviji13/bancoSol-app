package com.bancosol.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TiendaResponsableDTO {
    private Long id;
    private Long tiendaId;
    private Long responsableEntidadId;
    private Long campaniaId;
}
