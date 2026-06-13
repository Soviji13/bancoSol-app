package com.bancosol.dto;

import lombok.*;

import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TiendaDTO {
    private Long id;
    private String nombre;
    private Short puntosRecogida;
    private Boolean esFranquicia;
    private Long cadenaId;    // A qué cadena pertenece
    private Long direccionId; // Su dirección exclusiva

    // Relaciones por ID
    private List<Long> idsCampanias;   // Para TiendaCampania
    private List<Long> idsEntidades;   // Para TiendaColaborador
    private List<Long> idsResponsables; // Para TiendaResponsable (ternaria con campaña)

    //francisco javier garcia sierra 0% ia
    //añado los campos q faltaban para la interfaz de tiendas
    private String calle;
    private Short numero;
    private String localidad;
    private Boolean participaCampaniaActiva;

    //añadidos para hacer eficiente el panel lateral de detalles
    private Short codigoPostal;
    private String distrito;
    private String zonaGeografica;
    private String nombreResponsable; //de tienda
    private Long responsableTiendaId; //para el formulario

    private String nombreCadena;
    private String nombreEntidad;
    //private String responsableEntidad; al final voy a necesitar una lista para mostrarlos con la doble flecha como en clientes
    private List<ResponsableEntidadResumenDTO> responsablesLista;

}