package com.bancosol.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CoordinadorDTO {
    private Long id;
    private String area;
    private Short tiendas;
    private Boolean permisoModificar;
    private Long usuarioId;  // Clave para el login y gestión de cuenta
    private Long contactoId; // Referencia al contacto personal
}