//Generado por IA partiendo de su respectiva entidad. Posteriormente revisado por el equipo
package com.bancosol.dto;

import java.util.List;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CodigoPostalDTO {
    private Long id;
    private Short codigo; 

    private List<Long> distritosIds;
}