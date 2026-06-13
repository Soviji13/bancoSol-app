// Sofía Si Villalba Jiménez (0 IA)

package com.bancosol.dto.actualizacionEntidad;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponsableActualizadoDTO {
  // Propio del responsable
  private Long id;

  // Para crear el contacto
  private String email;
  private String telefono;
  private String nombre;
  private Boolean esPrincipal;
}