//francisco javier garcia sierra 0% ia

package com.bancosol.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor
public class VoluntarioDTO {
    private Long id;
    private String observaciones;
    private Boolean horasSueltas;
    private LocalTime horaComienzo;
    private LocalTime horaFinal;

    private Long responsableId;

    //datos tabla
    private String nombreResponsable;
    private String perteneceA;
    private String telefono;
    private String email;

    //placeholders q luego quiza usemos!!!!
    private String localidad;
    private String calle;
    private Short numero;
    private String distrito;
    private String zonaGeografica;

    //lista de tiendas/turnos integrada
    private List<AsignacionDTO> asignaciones = new ArrayList<>();

    //AYUDA IA: division de la tabla intermedia triple, yo estaba usando TiendaTurno, pero al accder, dentro estaba el propio voluntario
    // y por tanto de nuevo el tiendaTurno entrando en bucle, por lo q lo mejor es desacoplazr-
    @Data @NoArgsConstructor @AllArgsConstructor
    public static class AsignacionDTO {
        private Long tiendaId;
        private String tiendaNombre;
        private List<TurnoVoluntarioDTO> turnos = new ArrayList<>();
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class TurnoVoluntarioDTO {
        private Long turnoId;
        private String dia;
        private String franjaHoraria;
    }
}