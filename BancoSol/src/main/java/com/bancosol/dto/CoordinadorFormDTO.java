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
public class CoordinadorFormDTO {

    private String area;

    private Short tiendas;

    private Boolean permisoModificar;

    private Long usuarioId;

    private Long contactoId;

    private List<Long> idsCampanias;
}