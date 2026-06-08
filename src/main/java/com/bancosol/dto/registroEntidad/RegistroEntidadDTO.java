// Sofía Si Villalba Jiménez (0 IA) 

package com.bancosol.dto.registroEntidad;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistroEntidadDTO {
    private InformacionGeneralDTO informacionGeneral;
    private LocalizacionDTO localizacion;
    private List <ResponsableDTO> responsables;
    private List <CampaniaRegistroDTO> campanias;
}