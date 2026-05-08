package com.bancosol.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "\"Localidad\"", schema = "public")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Localidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    // RELACIÓN: Muchas localidades pertenecen a UNA zona geográfica
    // FetchType.LAZY es súper importante para el rendimiento.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "zona_geo_id")
    private ZonaGeografica zonaGeografica;

    @PrePersist
    @PreUpdate
    private void asegurarMayusculas() {
        if (this.nombre != null) this.nombre = this.nombre.toUpperCase();
    }
}