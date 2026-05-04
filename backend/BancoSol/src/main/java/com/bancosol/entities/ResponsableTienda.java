package com.bancosol.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "\"Responsable_tienda\"", schema = "public")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ResponsableTienda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contacto_id")
    private Contacto contacto;

    @PrePersist @PreUpdate
    private void asegurarMayusculas() {
        if (this.nombre != null) this.nombre = this.nombre.toUpperCase();
    }
}