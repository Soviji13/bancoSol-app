//Generado por IA partiendo de su respectiva entidad. Posteriormente revisado por el equipo
package com.bancosol.dto;

import com.bancosol.entities.enums.TipoRol;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {
    // No almacenamos su contraseña
    private Long id;
    private String email;
    private TipoRol rol;

    // Añadido por sofía 0 IA
    private String nombreMostrado;
    private String rolMostrado;
    private Long idReferencia; // El id de la entidad (colaborador, respTienda, etc.)

    // SOLO PARA EL COORDINADOR
    private Boolean puedeModificar;
}