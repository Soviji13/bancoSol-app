package com.bancosol.entities;

import com.bancosol.entities.enums.TurnoDia;
import com.bancosol.entities.enums.TurnoFranja;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "\"Turno\"", schema = "public")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Turno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private TurnoDia dia;

    @Enumerated(EnumType.STRING)
    @Column(name = "franja_horaria")
    private TurnoFranja franjaHoraria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campania_id", nullable = false)
    private Campania campania;
}