//francisco javier garcia sierra 0% ia

package com.bancosol.dto;

import lombok.*;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoluntarioDTO {
    private Long id;
    private String observaciones;
    private Boolean horasSueltas;
    private LocalTime horaComienzo;
    private LocalTime horaFinal;

    //ids referenciales
    private Long responsableId;

    //campos extraidos para la tabla y detalles
    private String nombreResponsable;
    private String perteneceA;
    private String telefono;
    private String email;

    //domicilio (placeholder por si luego lo metemos en la entidad!!!!)
    private String localidad;
    private String calle;
    private Short numero;
    private String distrito;
    private String zonaGeografica;

    //lista de asignaciones (tiendas y turnos) q pide el frontend de react
    private List<Object> asignaciones = new ArrayList<>();
}