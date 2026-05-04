package com.bancosol.dto;

import com.bancosol.entities.enums.TurnoDia;
import com.bancosol.entities.enums.TurnoFranja;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TurnoDTO {
    private Long id;
    private TurnoDia dia;
    private TurnoFranja franjaHoraria;
    private Long campaniaId; //
}
