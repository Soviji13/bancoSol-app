//le metemos el responsable y sus contactos, asi como la entidad a la q pertenece para agilizar las cosas
package com.bancosol.dto;

import lombok.*;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class VoluntarioCompletoDTO {
    private Long id;
    private String responsableEntidad;
    private String perteneceA;
    private String telefono;
    private String email;
    private String localidad;
    private String domicilio;
    private String distrito;
    private String observaciones;
    private Boolean horasSueltas;
    private String horaComienzo;
    private String horaFinal;

    private List<AsignacionDTO> asignaciones;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class AsignacionDTO {
        private Long tiendaId;
        private String tiendaNombre;
        private List<TurnoVoluntarioDTO> turnos;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class TurnoVoluntarioDTO {
        private Long turnoId;
        private String dia;
        private String franjaHoraria;
    }
}