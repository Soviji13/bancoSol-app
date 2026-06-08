package com.bancosol.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EntidadColaboradoraDTO {
    // 1. El ID de la entidad es SAGRADO (lo usamos para el doble clic)
    private Long id;
    private String nombre;
    private Boolean estadoActivo;

    // 2. Información para la tabla y el lateral (Ya procesada)
    private String domicilioCompleto;
    private String localidadNombre;
    private String contactoNombre;
    private String contactoInfo;
    private Boolean esCapital;
    private String zonaNombre;
    private String distritoNombre;

    // CAMPOS PARA EL PANEL LATERAL (Tiendas)
    private List<String> nombresTiendas;
    private List<Long> idsTiendas;
    private Map<Long, List<String>> tiendasPorCampania;
    private Map<Long, List<Long>> idsTiendasPorCampania;

    // CAMPOS PARA EL PANEL LATERAL (Campañas)
    private List<String> nombresCampanias;
    private List<Long> idsCampanias;

    // 3. Metadatos que podrías usar en el panel lateral
    private String observaciones;
    private Short numVoluntarios;

    // Código postal
    private String codigoPostal;

    // Este objeto va dentro de EntidadColaboradoraDTO
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResponsableDetalleDTO {
        private String nombre;
        private String email;
        private String telefono;
        private Boolean esPrincipal;
    }

    private List<ResponsableDetalleDTO> responsables;
}