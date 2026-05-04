package com.bancosol.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "\"Entidad_colaboradora\"", schema = "public")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EntidadColaboradora {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    @Column(name = "estado_activo", nullable = false)
    private Boolean estadoActivo = false;

    private String observaciones;

    @Column(name = "num_tiendas", nullable = false)
    private Short numTiendas = 0;

    @Column(name = "num_turnos", nullable = false)
    private Short numTurnos = 0;

    @Column(name = "num_voluntarios", nullable = false)
    private Short numVoluntarios = 0;

    // Relaciones
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coordinador_id")
    private Coordinador coordinador;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "direccion_id", nullable = false, unique = true)
    private Direccion direccion;

    @PrePersist
    @PreUpdate
    private void asegurarMayusculas() {
        if (this.nombre != null) this.nombre = this.nombre.toUpperCase();
    }
}