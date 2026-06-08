package com.bancosol.dto;

import lombok.*;
        import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TiendaDTO {
    private Long id;
    private String nombre;
    private Short puntosRecogida;
    private Boolean esFranquicia;
    private Long cadenaId;
    private Long direccionId;

    private String calle;
    private Short numero;
    private Long localidadId;
    private Long cpId;
    private Long distritoId;

    //Fran: añado campos para 1:1 con respTienda
    private Long responsableTiendaId;
    private String nombreResponsableTienda;

    private List<ResponsableInfoDTO> responsablesInfo;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResponsableInfoDTO {
        private String nombre;
        private String nombreEntidad;
    }

    private List<Long> idsCampanias;
    private List<Long> idsEntidades;
    private List<Long> idsResponsables;
}