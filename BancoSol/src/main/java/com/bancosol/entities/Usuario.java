package com.bancosol.entities;

import com.bancosol.entities.enums.TipoRol;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "\"Usuario\"", schema = "public")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String contrasenia;

    // Magia: Le decimos que use nuestro Enum, pero que en Postgres lo guarde como un String (texto)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoRol rol = TipoRol.RESPONSABLE_TIENDA;
}