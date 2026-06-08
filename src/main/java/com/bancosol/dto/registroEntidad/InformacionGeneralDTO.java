// Sofía Si Villalba Jiménez (0 IA)

package com.bancosol.dto.registroEntidad;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InformacionGeneralDTO {
    private String nombre;
    private Boolean estadoActivo;
    private String observaciones;
    private Long idCoordinador;
}