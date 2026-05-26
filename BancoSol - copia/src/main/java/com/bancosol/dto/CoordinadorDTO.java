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

    private String zonaGeografica;
    private Short numeroTiendas;
    private ContactoDTO contacto;
    private List<CampaniaDTO> campanias;

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
