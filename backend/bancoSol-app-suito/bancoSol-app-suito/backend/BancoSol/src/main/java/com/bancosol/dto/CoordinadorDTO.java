//Generado inicialmente con IA (90%) ajustado y mantenido a lo largo del proyecto por Jose González (10%)
package com.bancosol.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoordinadorDTO {

    private Long id;

    private String nombre;

    private String email;

    private String telefono;

    private String area;

    private Short tiendas;

    private Boolean permisoModificar;

    private Long usuarioId;

    private Long contactoId;

    private Long entidadId;

    private List<Long> idsCampanias;

    private List<String> nombresCampanias;

    private ContactoDTO contacto;

    private List<CampaniaDTO> campanias;
}