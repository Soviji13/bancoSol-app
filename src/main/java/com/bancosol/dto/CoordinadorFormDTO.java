//Generado por Jose González en base a las necesidades del formulario
package com.bancosol.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoordinadorFormDTO {

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
}