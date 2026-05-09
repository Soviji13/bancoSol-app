package com.bancosol.dto;

import lombok.*;

import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CoordinadorDTO {
    private Long id;
    private String area;
    private Short tiendas;
    private Boolean permisoModificar;
    private Long usuarioId;  // Clave para el login y gestión de cuenta
    private Long contactoId; // Referencia al contacto personal

    private List<Long> idsCampanias;     // Sustituye a CoordinadorCampania
}