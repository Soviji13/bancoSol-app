package com.bancosol.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "\"Zona_geografica\"", schema = "public")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ZonaGeografica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    // Regla: Nombres siempre en MAYÚSCULAS
    @PrePersist
    @PreUpdate
    private void asegurarMayusculas() {
        if (this.nombre != null) this.nombre = this.nombre.toUpperCase();
    }

    // Añadido por Sofía Si Villalba Jiménez
    // Hecho con IA Generativa

    // RELACIÓN: UNA zona geográfica tiene MUCHAS localidades
    // mappedBy indica que el "dueño" de la clave foránea en la BBDD es la clase Localidad
    @OneToMany(mappedBy = "zonaGeografica", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default 
    private List<Localidad> localidades = new ArrayList<>();
}