package com.bancosol.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "\"Campania\"", schema = "public")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Campania {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private Boolean activa = true;

    @Column(name = "fecha_inicio", nullable = false, unique = true)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin", nullable = false, unique = true)
    private LocalDate fechaFin;

    // Magia de Hibernate: Le decimos que este campo es de solo lectura
    // porque Postgres lo calcula automáticamente con el GENERATED ALWAYS
    @Column(insertable = false, updatable = false)
    private Short anio;

    @PrePersist
    @PreUpdate
    private void asegurarMayusculas() {
        if (this.nombre != null) this.nombre = this.nombre.toUpperCase();
    }

    // Refactorización de campania

    @ManyToMany
    @JoinTable(
            name = "\"Campania_cadena\"",
            joinColumns = @JoinColumn(name = "campania_id"),
            inverseJoinColumns = @JoinColumn(name = "cadena_id")
    )
    private List<Cadena> cadenas = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "\"Tienda_campania\"",
            joinColumns = @JoinColumn(name = "campania_id"),
            inverseJoinColumns = @JoinColumn(name = "tienda_id")
    )
    private List<Tienda> tiendas = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "\"Colaborador_campania\"",
            schema = "public", // <-- ESTO ES VITAL para que PostgreSQL la encuentre
            joinColumns = @JoinColumn(name = "campania_id"), // <-- Revisa si en tu DB es así o id_campania
            inverseJoinColumns = @JoinColumn(name = "entidad_id") // <-- Revisa si en DB es entidad_id o colaborador_id
    )
    private List<EntidadColaboradora> colaboradores = new ArrayList<>();

    @ManyToMany(mappedBy = "campanias")
    private List<Coordinador> coordinadores = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "\"Tienda_responsable\"",
            joinColumns = @JoinColumn(name = "campania_id"),
            inverseJoinColumns = @JoinColumn(name = "responsable_entidad_id")
    )
    private List<ResponsableTienda> responsables = new ArrayList<>();
}