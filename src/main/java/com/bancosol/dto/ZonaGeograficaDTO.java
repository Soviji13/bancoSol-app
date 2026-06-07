package com.bancosol.dto;

import lombok.*;
import java.util.List;

@Data 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor
public class ZonaGeograficaDTO {

    private Long id;
    private String nombre;

    // Refactorización Sofía - (0% IA GENERATIVA)
    private List <Long> idsLocalidades;
}