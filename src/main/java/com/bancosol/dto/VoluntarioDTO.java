

//Generado por IA partiendo de su respectiva entidad. Posteriormente revisado por el equipo

//francisco javier garcia sierra

// ----- justificacion uso ia -----
// problema de recursividad infinita con json: al intentar devolver el voluntario a la vista, jpa entraba en bucle (Voluntario -> TiendaTurno -> Voluntario...). solucionado creando las clases estaticas AsignacionDTO y TurnoVoluntarioDTO para aplanar los datos y que no reviente la serializacion!!!!
// --------------------------------
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

    //AYUDA IA:
    //lista de tiendas/turnos integrada
    private List<AsignacionDTO> asignaciones = new ArrayList<>();

    //AYUDA IA:
    @Data @NoArgsConstructor @AllArgsConstructor
    public static class AsignacionDTO {
        private Long tiendaId;
        private String tiendaNombre;
        private List<TurnoVoluntarioDTO> turnos = new ArrayList<>();
    }

    //AYUDA IA:
    @Data @NoArgsConstructor @AllArgsConstructor
    public static class TurnoVoluntarioDTO {
        private Long turnoId;
        private String dia;
        private String franjaHoraria;
    }
}