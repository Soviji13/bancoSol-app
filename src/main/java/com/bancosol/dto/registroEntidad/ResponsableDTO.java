// Sofía Si Villalba Jiménez (0 IA)

package com.bancosol.dto.registroEntidad;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponsableDTO {
    // Propio del responsable
    private Boolean esPrincipal;

    // Para crear el contacto
    private String email;
    private String telefono;
    private String nombre;

    // Para crear el usuario
    private String user;
    private String pass;
}