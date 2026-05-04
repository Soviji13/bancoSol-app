package com.bancosol.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ContactoDTO {
    private Long id;
    private String nombre;
    private String email;
    private String telefono;
}