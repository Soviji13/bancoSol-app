package com.bancosol.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TiendaNuevaDTO {
    private String nombre;
    private Boolean esFranquicia;
    private Long cadenaId;

    //osn los datos de la nueva dirección (se usan si es nueva)
    private String calle;
    private Short numero;
    private Long cpId;
    private Long localidadId;
    private Long distritoId;
    private Long responsableTiendaId;

    //NUEVOS CAMPOS PARA REUTILIZACIÓN DE TIENDAS ENTRE CAMPAÑAS
    private Long tiendaIdExistente;
    private Long campaniaIdTarget;
}