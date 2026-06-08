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
     * Campo antiguo conservado.
     * Normalmente se obtiene desde contacto.nombre.
     */
    private String nombre;

    /*
     * Campos antiguos conservados para compatibilidad.
     */
    private String zonaGeografica;
    private Short numeroTiendas;
    private ContactoDTO contacto;
    private List<CampaniaDTO> campanias;

    /*
     * Campos nuevos integrados para el frontend refactorizado.
     */
    private String area;
    private Short tiendas;
    private Long contactoId;
    private String email;
    private String telefono;
    private List<Long> idsCampanias;
    private List<String> nombresCampanias;

    private Boolean permisoModificar;

    private Long usuarioId;
}
