package com.bancosol.dto;

import com.bancosol.entities.enums.TurnoDia;
import com.bancosol.entities.enums.TurnoFranja;
import lombok.*;

import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TurnoDTO {
    private Long id;
    private TurnoDia dia;
    private TurnoFranja franjaHoraria;
    private Long campaniaId; //

    private List<Long> idsTiendas;       // Sustituye a TiendaTurno (o idsEntidades si cruza con ellas)
}
