//Generado por IA partiendo de su respectiva entidad. Posteriormente revisado por el equipo
package com.bancosol.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class LocalidadDTO {
    private Long id;
    private String nombre;
    
    // Refactorización Sofía (0% IA GENERATIVA)
    private String zonaGeo; // Referencia a la zona geográfica
}