//Generado por IA partiendo de su respectiva entidad. Posteriormente revisado por el equipo
package com.bancosol.dto;

import com.bancosol.entities.enums.TipoRol;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UsuarioDTO {
    // No almacenamos su contraseña
    private Long id;
    private String email;
    private TipoRol rol;
}