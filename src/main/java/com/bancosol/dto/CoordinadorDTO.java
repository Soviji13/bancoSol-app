//Generado por IA partiendo de su respectiva entidad. Posteriormente revisado por el equipo
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

    /*
     * Datos planos del contacto.
     * Se usan directamente en JSP/JSTL para pintar el listado.
     */
    private String nombre;

    private String email;

    private String telefono;

    /*
     * Datos propios del coordinador.
     */
    private String area;

    private Short tiendas;

    private Boolean permisoModificar;

    /*
     * Identificadores de relaciones.
     */
    private Long usuarioId;

    private Long contactoId;

    /*
     * Se mantiene porque el listado JSP lo usa como data-entidad-id
     * y porque CoordinadorService lo necesita al convertir DTO a formulario.
     */
    private Long entidadId;

    /*
     * Campañas asociadas.
     */
    private List<Long> idsCampanias;

    private List<String> nombresCampanias;
}