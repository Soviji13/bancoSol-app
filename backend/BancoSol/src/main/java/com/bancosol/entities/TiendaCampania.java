package com.bancosol.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "\"Tienda_campania\"", schema = "public")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TiendaCampania {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tienda_id", nullable = false)
    private Tienda tienda;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campania_id", nullable = false)
    private Campania campania;
}