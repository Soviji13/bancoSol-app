package com.bancosol.dto;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CadenaDTO {
    private Long id;
    private String nombre;
    private String codigo;

    private List<Long> idCampanias
}