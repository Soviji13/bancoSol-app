package com.bancosol.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

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

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contacto_id")
    private Contacto contacto;

    @ManyToMany
    @JoinTable(
            name = "\"Coordinador_campania\"",
            schema = "public",
            joinColumns = @JoinColumn(name = "coordinador_id"),
            inverseJoinColumns = @JoinColumn(name = "campania_id")
    )
    private List<Campania> campanias = new ArrayList<>();

    @PrePersist
    @PreUpdate
    private void asegurarMayusculas() {
        if (this.area != null) {
            this.area = this.area.toUpperCase();
        }
    }
}