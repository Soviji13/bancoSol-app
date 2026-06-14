//Generado por IA partiendo del modelo de bbdd aprobado por el profesor. Posteriormente revisado por el equipo
package com.bancosol.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "\"Contacto\"", schema = "public")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contacto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(unique = true)
    private String email;

    @Column(unique = true)
    private String telefono;

    @PrePersist
    @PreUpdate
    private void asegurarMayusculas() {
        if (this.nombre != null) this.nombre = this.nombre.toUpperCase();
    }

    @OneToMany(mappedBy = "contacto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ResponsableEntidad> responsableEntidad = new ArrayList<>();
}