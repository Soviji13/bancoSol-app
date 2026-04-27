package com.bancosol.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DireccionDTO {
    private Long id;
    private String calle;
    private Short numero;
    private String datosAdicionales;
    private Boolean esCapital;
    private Long localidadId;
    private Long codigoPostalId;
    private Long distritoId;
}
