package com.bancosol.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActualizarEntidadColaboradoraDTO {
    private String nombre;
    private Boolean estadoActivo;
    private String observaciones;

    // Dirección
    private String calle;
    private Integer numero;
    private String nombreLocalidad;
    private String numeroCP;
    private String nombreZonaGeografica;
    private Boolean esCapital;
    private String nombreDistrito;

    // Relaciones M:M
    private List<Long> idsCampanias;
    private Map<Long, List<Long>> tiendasPorCampania;

    // Responsables
    private List<ResponsableUpdateDTO> responsables;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResponsableUpdateDTO {
        private String nombre;
        private String email;
        private String telefono;
        private Boolean esPrincipal;
        private String username; // Opcional para nuevos
        private String password; // Opcional para nuevos
    }
}