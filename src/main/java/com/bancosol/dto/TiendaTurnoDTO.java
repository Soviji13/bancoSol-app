//Generado por IA partiendo de su respectiva entidad. Posteriormente revisado por el equipo
package com.bancosol.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TiendaTurnoDTO {
    private Long id;
    private Long tiendaId;
    private Long voluntarioId;
    private Long turnoId; // Puede ser nulo en tu entidad
}