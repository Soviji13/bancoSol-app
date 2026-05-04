package com.bancosol.entities;

import com.bancosol.entities.enums.EstadoCambio;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "\"Solicitud_cambio\"", schema = "public")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SolicitudCambio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String asunto;

    private String descripcion;

    @Column(nullable = false)
    private String interfaz;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_solicitud", nullable = false)
    private EstadoCambio estadoSolicitud = EstadoCambio.PENDIENTE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coordinador_id", nullable = false)
    private Coordinador coordinador;
}