package com.bancosol.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "\"Codigo_postal\"", schema = "public")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodigoPostal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Short codigo;
}