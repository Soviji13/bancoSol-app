package com.bancosol.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;

@Entity
@Table(name = "\"Voluntario\"", schema = "public")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Voluntario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String observaciones;

    @Column(name = "horas_sueltas", nullable = false)
    private Boolean horasSueltas = false;

    @Column(name = "hora_comienzo")
    private LocalTime horaComienzo;

    @Column(name = "hora_final")
    private LocalTime horaFinal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responsable_entidad_id", nullable = false)
    private ResponsableEntidad responsable;

    // Validación manual de la regla de horas sueltas antes de guardar
    @PrePersist @PreUpdate
    private void validarHoras() {
        if (Boolean.TRUE.equals(this.horasSueltas)) {
            if (this.horaComienzo == null || this.horaFinal == null) {
                throw new IllegalArgumentException("Si tiene horas sueltas, el horario es obligatorio");
            }
        } else {
            this.horaComienzo = null;
            this.horaFinal = null;
        }
    }
}