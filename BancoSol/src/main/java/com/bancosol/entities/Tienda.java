package com.bancosol.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "\"Tienda\"", schema = "public")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tienda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(name = "puntos_recogida", nullable = false)
    private Short puntosRecogida = 0;

    @Column(name = "es_franquicia", nullable = false)
    private Boolean esFranquicia = false;

    // Relaciones (Foreign Keys)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cadena_id", nullable = false)
    private Cadena cadena;



    // Relación 1 a 1 porque una tienda tiene una única dirección exclusiva
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "direccion_id", nullable = false, unique = true)
    private Direccion direccion;

    //Fran: añado 1:1 con responsable tienda q no estaba y me hace falta en Gestionar-tiendas
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responsable_tienda_id", unique = true)
    private ResponsableTienda responsableTienda;

    @PrePersist
    @PreUpdate
    private void asegurarMayusculas() {
        if (this.nombre != null) this.nombre = this.nombre.toUpperCase();
    }

    //Refactorizacion de tienda
    @ManyToMany
    @JoinTable(
            name = "\"Tienda_responsable\"",
            schema = "public",
            joinColumns = @JoinColumn(name = "tienda_id"),
            inverseJoinColumns = @JoinColumn(name = "responsable_entidad_id")
    )
    private List<ResponsableEntidad> responsables = new ArrayList<>(); //Fran: he cambiado aqui el tipo de lista pq poneia responsable de tienda en vez de entidad

    @ManyToMany
    @JoinTable(
            name = "\"Tienda_campania\"",
            schema = "public",
            joinColumns = @JoinColumn(name = "tienda_id"),
            inverseJoinColumns = @JoinColumn(name = "campania_id")
    )
    private List<Campania> campanias = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "\"Tienda_colaborador\"",
            schema = "public",
            joinColumns = @JoinColumn(name = "tienda_id"),
            inverseJoinColumns = @JoinColumn(name = "colaborador_id")
    )
    private List<EntidadColaboradora> colaboradores = new ArrayList<>();
}


