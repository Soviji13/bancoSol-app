package com.bancosol.entities;

import com.bancosol.entities.enums.EstadoIncidencia;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "\"Incidencia\"", schema = "public")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Incidencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora;

    @Column(nullable = false)
    private String asunto;

    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoIncidencia estado = EstadoIncidencia.PENDIENTE;

    // Puede ser creada por un Responsable de Tienda O un Responsable de Entidad
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responsable_tienda_id")
    private ResponsableTienda responsableTienda;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responsable_entidad_id")
    private ResponsableEntidad responsableEntidad;
}