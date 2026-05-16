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
public class EntidadColaboradoraDTO {

    // Datos básicos
    private Long id;
    private String nombre;
    private Boolean estadoActivo;
    private String observaciones;

    // Contadores
    private Short numTiendas;
    private Short numTurnos;
    private Short numVoluntarios;

    // Relaciones por ID
    private Long coordinadorId;
    private Long direccionId;

    // Tiendas asociadas
    private List<Long> idsTiendas;
    private List<String> nombresTiendas;

    // Campañas asociadas
    private List<Long> idsCampanias;
    private List<String> nombresCampanias;

    // Contactos / responsables asociados
    private List<Long> idsContactos;
    private List<ResponsableDetalleDTO> responsables;

    // Datos ya procesados para frontend / panel lateral
    private String domicilioCompleto;
    private String localidadNombre;
    private String contactoNombre;
    private String contactoInfo;
    private String codigoPostal;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResponsableDetalleDTO {
        private Long id;
        private String nombre;
        private String email;
        private String telefono;
        private Boolean esPrincipal;
    }
}