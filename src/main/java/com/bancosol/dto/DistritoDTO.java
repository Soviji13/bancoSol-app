package com.bancosol.dto;

import java.util.List;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DistritoDTO {
    private Long id;
    private String nombre;

    private List<Long> codigosIds;
}