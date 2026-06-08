package com.bancosol.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponsableTiendaNuevoDTO {
    private String nombre;
    private String email;
    private String telefono;
    private String contrasenia;
}
