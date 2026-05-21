package com.bancosol.dto;

import java.util.List;
import java.util.Map;

import lombok.*;


@Data
public class RegistroEntidadColaboradoraDTO {
    private String nombre;
    private Boolean estadoActivo;
    private String observaciones;

    // Datos de Dirección (Triple "Find or Create")
    private String calle;
    private Integer numero;
    private Boolean esCapital;
    private String nombreLocalidad;
    private String numeroCP;
    private String nombreDistrito; // Ahora es String para el "Find or Create"
    private Long idCoordinador;

    private String nombreZonaGeografica;

    private List<NuevoResponsableDTO> responsables;
    private List<Long> idsCampanias;
    private Map<Long, List<Long>> tiendasPorCampania;

    @Data
    public static class NuevoResponsableDTO {
        private String nombre;
        private String email;
        private String telefono;
        private Boolean esPrincipal;
        private String username;
        private String password;
    }
}