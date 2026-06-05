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

    // Comentado por Sofía, ya no es necesario
    // private Long contactoId;

    // Código añadido de Sofía Si Villalba Jiménez (0% IA Generativa)
    private ContactoDTO contacto;
}