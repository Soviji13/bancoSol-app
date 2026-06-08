// Sofía Si Villalba Jiménez (0 IA)

package com.bancosol.dto.registroEntidad;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LocalizacionDTO {
    private String calle;
    private Short numero;
    private Long localidad;         // Apunta al ID
    private Long cp;               // Apunta al ID
    private Boolean esCapital;
    private Long idDistrito;

    // Localidad no es necesaria ser enviada ni recogida
}