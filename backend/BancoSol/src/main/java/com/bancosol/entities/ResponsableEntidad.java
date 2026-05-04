package com.bancosol.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "\"Responsable_entidad\"", schema = "public")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ResponsableEntidad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "es_contacto_principal", nullable = false)
    private Boolean esContactoPrincipal = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entidad_id", nullable = false)
    private EntidadColaboradora entidad;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contacto_id")
    private Contacto contacto;
}
