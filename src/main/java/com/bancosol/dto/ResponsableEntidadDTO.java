package com.bancosol.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponsableEntidadDTO {

    private Long id;
    private Boolean esContactoPrincipal;

    private Long entidadId;
    private Long usuarioId;
    private Long contactoId;

    private String nombreContacto;
    private String emailContacto;
    private String telefonoContacto;
}