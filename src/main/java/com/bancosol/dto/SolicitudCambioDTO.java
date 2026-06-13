//Generado por IA partiendo de su respectiva entidad. Posteriormente revisado por el equipo
package com.bancosol.dto;

import com.bancosol.entities.enums.EstadoCambio;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SolicitudCambioDTO {
    private Long id;
    private String asunto;
    private String descripcion;
    private String interfaz;
    private EstadoCambio estadoSolicitud;
    private Long coordinadorId; // Quién solicita el cambio
}