package com.bancosol.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DistritoCpDTO {
    private Long id;
    private Long distritoId;
    private Long cpId;
}
