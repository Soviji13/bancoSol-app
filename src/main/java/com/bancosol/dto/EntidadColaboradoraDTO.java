package com.bancosol.dto;

import lombok.*;

import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class EntidadColaboradoraDTO {
    private Long id;
    private String nombre;
    private Boolean estadoActivo;
    private String observaciones;
    
    private Long coordinadorId;
    private Long direccionId;


    private List<Long> idsTiendas;          // Sustituye a TiendaColaborador
    private List<Long> idsResponsables;     // Sustituye a ResponsableEntidad

    // Código añadido por Sofía (0% IA Generativa) --------------------------
    private List<Long> idsCampanias;


    // Para la tabla
    private List <String> nombresTiendas;   // Dependiendo de la campaña
    private ResponsableEntidadDTO contactoPrincipal;

    // Para la tabla y modificación
    private DireccionDTO direccion;

    // Para menú lateral y modificación
    private List <ResponsableEntidadDTO> responsablesEntidad;
}