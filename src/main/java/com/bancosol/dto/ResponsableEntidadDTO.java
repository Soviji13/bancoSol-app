package com.bancosol.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponsableEntidadDTO {

    private Long id;
    private Boolean esContactoPrincipal;

    private Long usuarioId;
    private Long contactoId;
}