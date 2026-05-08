package com.bancosol.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "\"Coordinador\"", schema = "public")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coordinador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String area;

    @Column(nullable = false)
    private Short tiendas = 0;

    @Column(name = "permiso_modificar", nullable = false)
    private Boolean permisoModificar = false;

    // Relación 1 a 1 con Usuario (Obligatorio)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    // Relación con Contacto
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contacto_id")
    private Contacto contacto;

    @PrePersist
    @PreUpdate
    private void asegurarMayusculas() {
        if (this.area != null) this.area = this.area.toUpperCase();
    }
}