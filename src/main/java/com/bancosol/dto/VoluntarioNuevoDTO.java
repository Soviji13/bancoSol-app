//francisco javier garcia sierra 0% ia

package com.bancosol.dto;

import lombok.Data;
import java.util.List;

@Data
public class VoluntarioNuevoDTO {
    private Long campaniaId;
    private Long responsableId;
    private Boolean horasSueltas;
    private String horaInicio;
    private String horaFin;
    private String observaciones;
    private List<TurnoNuevoDTO> turnosAsignados;
}