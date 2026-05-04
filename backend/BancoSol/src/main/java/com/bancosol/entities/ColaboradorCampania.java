package com.bancosol.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.ZonedDateTime;

@Entity
@Table(name = "\"Colaborador_campania\"", schema = "public")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ColaboradorCampania {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relaciones que forman el "puente"
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entidad_id", nullable = false)
    private EntidadColaboradora entidad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campania_id", nullable = false)
    private Campania campania;

    // Los datos extra de esta relación N:M
    @Column(nullable = false)
    private Boolean participa = false;

    private String observaciones;

    // Magia de Hibernate: Genera el timestamp automáticamente al crear la fila
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;
}