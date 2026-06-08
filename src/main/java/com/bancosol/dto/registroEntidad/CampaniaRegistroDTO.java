// Sofía Si Villalba Jiménez (0 IA)

package com.bancosol.dto.registroEntidad;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampaniaRegistroDTO {
    private Long idCampania;
    private List <Long> idsTiendas;

    // Localidad no es necesaria ser enviada ni recogida
}