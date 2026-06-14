//Generado por IA partiendo del modelo de bbdd aprobado por el profesor. Posteriormente revisado por el equipo
package com.bancosol.entities;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "\"Distrito\"", schema = "public")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Distrito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    @PrePersist
    @PreUpdate
    private void asegurarMayusculas() {
        if (this.nombre != null) this.nombre = this.nombre.toUpperCase();
    }

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
    name = "\"Distrito_cp\"", // El nombre exacto de la tabla en Postgres
    joinColumns = @JoinColumn(name = "distrito_id"), // La columna de esta entidad
    inverseJoinColumns = @JoinColumn(name = "cp_id")  // La columna de la otra entidad
    )
    private List<CodigoPostal> codigosPostales;
}