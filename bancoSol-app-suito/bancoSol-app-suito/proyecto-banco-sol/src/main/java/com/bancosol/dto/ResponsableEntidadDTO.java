package com.bancosol.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ResponsableEntidadDTO {
    private Long id;
    private Boolean esContactoPrincipal;
    private Long entidadId;  // Referencia a la entidad colaboradora
    private Long usuarioId;  // Referencia a su cuenta de usuario
    private Long contactoId; // Referencia a su información de contacto
}