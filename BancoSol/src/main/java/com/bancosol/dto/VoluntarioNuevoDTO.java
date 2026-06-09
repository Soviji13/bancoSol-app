package com.bancosol.dto;

import lombok.Data;
import java.util.List;

@Data
public class VoluntarioNuevoDTO {
    private Long campaniaId;
    private String entidad;
    private String responsable;
    private Boolean horasSueltas;
    private String horaInicio;
    private String horaFin;
    private String observaciones;
    private List<TurnoNuevoDTO> turnosAsignados;

    @Data
    public static class TurnoNuevoDTO {
        private String tienda;
        private String dia;
        private String franja;
    }
}