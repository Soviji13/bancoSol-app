//francisco javier garcia sierra ia 0%
//necesaria par a poder tratar la tabla intermedia TiendaResponsable de la bbdd
//he usado ocmo plantilla tienda.java

package com.bancosol.entities;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "\"Tienda_responsable\"", schema = "public")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TiendaResponsable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tienda_id", nullable = false)
    private Tienda tienda;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responsable_entidad_id", nullable = false)
    private ResponsableTienda responsableTienda;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campania_id", nullable = false)
    private Campania campania;
}