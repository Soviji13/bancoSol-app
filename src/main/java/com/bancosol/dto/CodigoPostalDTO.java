package com.bancosol.dto;

import java.util.List;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CodigoPostalDTO {
    private Long id;
    private Short codigo; 

    private List<Long> distritosIds;
}