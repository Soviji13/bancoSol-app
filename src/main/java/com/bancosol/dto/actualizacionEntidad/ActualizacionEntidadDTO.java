// Sofía Si Villalba Jiménez (0 IA) 

package com.bancosol.dto.actualizacionEntidad;

import lombok.*;

import java.util.List;

import com.bancosol.dto.registroEntidad.CampaniaRegistroDTO;
import com.bancosol.dto.registroEntidad.LocalizacionDTO;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActualizacionEntidadDTO {
  private Long idEntidad;
  private InformacionGeneralDTO informacionGeneral;
  private LocalizacionDTO localizacion;
  private ResponsablesDTO responsables;
  private List<CampaniaRegistroDTO> campanias;
}