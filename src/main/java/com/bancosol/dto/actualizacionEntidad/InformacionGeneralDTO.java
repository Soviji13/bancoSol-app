// Sofía Si Villalba Jiménez (0 IA)

package com.bancosol.dto.actualizacionEntidad;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InformacionGeneralDTO {
  private String nombre;
  private String observaciones;
}