package com.bancosol.entities;

import jakarta.persistence.*;
import lombok.*;

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

    @PrePersist
    @PreUpdate
    private void asegurarMayusculas() {
        if (this.nombre != null) this.nombre = this.nombre.toUpperCase();
    }
}
