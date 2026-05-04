package com.bancosol.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CadenaDTO {
    private Long id;
    private String nombre;
    private String codigo;
}