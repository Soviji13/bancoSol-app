package com.bancosol.dto.actualizacionEntidad;

import lombok.*;
import java.util.List;

import com.bancosol.dto.registroEntidad.ResponsableDTO;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponsablesDTO {
  private List<ResponsableActualizadoDTO> actualizados;
  private List<ResponsableDTO> nuevos;
  private List<Long> idsEliminados;
}
